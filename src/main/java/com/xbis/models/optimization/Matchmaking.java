package com.xbis.models.optimization;

import gurobi.GRB;
import gurobi.GRB.IntParam;
import gurobi.GRB.StringParam;
import gurobi.GRBEnv;
import gurobi.GRBException;
import gurobi.GRBLinExpr;
import gurobi.GRBModel;
import gurobi.GRBVar;

public class Matchmaking {
  // Weight factor used to give to personal score. (1 - PERSONAL_WEIGHT) will
  // be used for the aggregate score.
  public static final float PERSONAL_WEIGHT = 0.7f;

  // Weight factor for quality score. (1 - QUALITY_WEIGHT) will be used for
  // cooperation score.
  public static final float QUALITY_WEIGHT = 0.5f;


  private final int players;

  private float L[][];
  private float agg[];
  private float U[][];

  private Game game;

  // Adds context to the matchmaking from the collected ratings.
  public Matchmaking(Game game) {
    this.game = game;
    this.players = game.getPlayers();

    L = new float[players][players];
    agg = new float[players];
    U = new float[players][players];
  }

  // Get context from game to calculate new teams.
  private void initializeRound() {
    // L_i_j: preferences
    L = game.getPreferences();

    float[][] ratings = game.getRatings();

    // agg_j: aggregate utility score
    agg = calcAgg(ratings);

    // U_i_j: utility score
    for (int i = 0; i < players; i++) {
      for (int j = 0; j < players; j++) {
        // Version 1:
        // U[i][j] = agg[j] * L[i][j];
        // Version 2:
        // U[i][j] = agg[j] * (L[i][j] * L[j][i]);

        // Use weights to ensure personal score is more important
        U[i][j] = (PERSONAL_WEIGHT * ratings[i][j] + (1 - PERSONAL_WEIGHT) * agg[j])
            * (L[i][j] * L[j][i]);
      }
    }
  }

  private float[] calcAgg(float[][] ratings) {
    float[] aggUtility = new float[players];

    for (int j = 0; j < players; j++) {
      // Calculate sum of ratings given to him and number of players that rated
      // him.
      float rating = 0;
      int nRatings = 0;
      for (int i = 0; i < players; i++) {
        if (ratings[i][j] != 0) {
          rating += ratings[i][j];
          nRatings++;
        }
      }

      if (nRatings == 0) {
        aggUtility[j] = 0;
      } else {
        aggUtility[j] = rating / (float) nRatings;
      }
    }

    return aggUtility;
  }

  // Solves the linear programming problem and returns the
  // resulting teams.
  public Teams matchmake() throws GRBException {
    GRBEnv env = new GRBEnv(true);
    env.set(StringParam.LogFile, "gaming.log");
    env.set(IntParam.LogToConsole, 0);
    env.start();

    GRBModel model = new GRBModel(env);

    // Create X_i_j variables
    GRBVar[][] X = new GRBVar[players][players];
    for (int i = 0; i < players; i++) {
      for (int j = 0; j < players; j++) {
        X[i][j] = model.addVar(0.0, 1.0, 0.0, GRB.BINARY,
            String.format("x_%d_%d", i, j)); // Assign a name
      }
    }

    // Set objective: maximize sum(i->N) sum(j->N) U_i_j * X_i_j
    GRBLinExpr expr = new GRBLinExpr();
    for (int i = 0; i < players; i++) {
      for (int j = i; j < players; j++) {
        expr.addTerm(U[i][j], X[i][j]);
      }
    }
    model.setObjective(expr, GRB.MAXIMIZE);

    // Constraint: all paired (one left if even)
    // sum(j -> N) X_i_j <= 1
    for (int i = 0; i < players; i++) {
      GRBLinExpr c0_i = new GRBLinExpr();
      for (int j = 0; j < players; j++) {
        c0_i.addTerm(1.0, X[i][j]);
      }
      model.addConstr(c0_i, GRB.LESS_EQUAL, 1.0, "c0_" + i);
    }

    // Constraint: paired players equals (N or N-1 if odd).
    // sum(i -> N) sum(j -> N) X_i_j = N - N % 2
    GRBLinExpr c1 = new GRBLinExpr();
    for (int i = 0; i < players; i++) {
      for (int j = 0; j < players; j++) {
        c1.addTerm(1.0, X[i][j]);
      }
    }
    model.addConstr(c1, GRB.EQUAL, players - players % 2, "c1");

    // Constraint: symmetric matrix
    // X_i_j - X_j_i == 0
    for (int i = 0; i < players; i++) {
      for (int j = i; j < players; j++) {
        GRBLinExpr c2_i_j = new GRBLinExpr();
        c2_i_j.addTerm(1.0, X[i][j]);
        c2_i_j.addTerm(-1.0, X[j][i]);
        model.addConstr(c2_i_j, GRB.EQUAL, 0.0, "c2_" + i + "_" + j);
      }
    }

    // Constraint: not paired with self
    // X_i_i = 0
    for (int i = 0; i < players; i++) {
      GRBLinExpr c3_i = new GRBLinExpr();
      c3_i.addTerm(1.0, X[i][i]);
      model.addConstr(c3_i, GRB.EQUAL, 0.0, "c3_" + i);
    }

    // Optimize model
    model.optimize();

    return new Teams(X, U, players, game.getTeamSize());
  }

  public Teams run() {
    initializeRound();

    Teams teams = null;
    try {
      teams = matchmake();
      System.out.println(teams);
    } catch (GRBException e) {
      System.out.println("Error code: " + e.getErrorCode() + ". " +
          e.getMessage());
    }

    return teams;
  }
}