package com.xbis.models.optimization;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import com.xbis.models.Review;
import gurobi.GRB;
import gurobi.GRBException;
import gurobi.GRBVar;

import java.util.ArrayList;
import java.util.List;

public class Teams {
  private final int playerNum;
  private final int teamSize;
  private final List<Review> reviewList;
  private List<TeamModel> teamModelList;

  private float[][] U;

  private boolean[][] teams;

  private static final Logger LOG =
      LoggerFactory.getLogger(Teams.class);

  public Teams(GRBVar[][] X, float[][] U, int N,
               int teamSize, List<Review> reviewList) {
    this.playerNum = N;
    this.teamSize = teamSize;
    this.U = U;
    this.teamModelList = new ArrayList<>();
    this.reviewList = reviewList;

    teams = new boolean[playerNum][playerNum];
    for (int i = 0; i < playerNum; i++) {
      for (int j = 0; j < playerNum; j++) {
        try {
          teams[i][j] = X[i][j].get(GRB.DoubleAttr.X) > 0.0;
        } catch (GRBException e) {
          LOG.error("{} in the constructor of class Teams", e);
        }
      }
    }
  }

  public List<TeamModel> getTeams() {
    List<String> players = new ArrayList<>();

    for (int i = 0; i < playerNum; i++) {
      int[] teammates = getTeammates(i);
      // Check if player has teammates
      if (teammates.length == 0) {
        continue;
      }

      String username1 = reviewList.get(i).getReviewer().getUsername();
      String username2 = reviewList.get(i).getReviewed().getUsername();

      if (!(players.contains(username1) || players.contains(username2))) {
        players.add(username1);
        players.add(username2);

        // Calculate whole team affinity
        float affinity = getTeamAffinity(getTeam(i));

        TeamModel teamModel = new TeamModel(username1, username2, affinity);
        teamModelList.add(teamModel);
      }
    }
    return teamModelList;
  }

  public float getTeamAffinity(int[] team) {
    float affinity = 0;

    for (int i : team) {
      for (int j : team) {
        affinity += U[i][j];
      }
    }

    return affinity;
  }

  public int[] getTeam(int player) {
    int[] team = new int[teamSize];

    int idx = 1;
    team[0] = player;
    for (int j = 0; j < playerNum; j++) {
      if (this.teams[player][j]) {
        team[idx] = j;
        idx++;
      }
    }

    if (team.length == 1) {
      return new int[0];
    }

    return team;
  }

  public int[] getTeammates(int player) {
    int[] teammates = new int[teamSize - 1];
    int idx = 0;
    for (int j = 0; j < playerNum; j++) {
      if (this.teams[player][j]) {
        teammates[idx] = j;
        idx++;
      }
    }

    if (idx == 0) {
      return new int[] {};
    }
    return teammates;
  }

  public boolean get(int i, int j) {
    return this.teams[i][j];
  }
}
