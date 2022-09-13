package com.xbis.models.optimization;

import gurobi.GRB;
import gurobi.GRBException;
import gurobi.GRBVar;

public class Teams {
  private final int playerNum;
  private final int teamSize;

  private float[][] U;

  private boolean[][] teams;

  public Teams(GRBVar[][] X, float[][] U, int N, int teamSize) throws GRBException {
    this.playerNum = N;
    this.teamSize = teamSize;
    this.U = U;

    teams = new boolean[playerNum][playerNum];
    for (int i = 0; i < playerNum; i++) {
      for (int j = 0; j < playerNum; j++) {
        teams[i][j] = X[i][j].get(GRB.DoubleAttr.X) > 0.0;
      }
    }
  }

  public String toString() {
    StringBuilder sb = new StringBuilder();

    sb.append("Teams:\n");

    // Initialize all playerNum to not mentioned
    boolean[] mentioned = new boolean[playerNum];
    for (int i = 0; i < playerNum; i++) {
      mentioned[i] = false;
    }

    for (int i = 0; i < playerNum; i++) {
      // Only print player team if not mentioned yet
      if (mentioned[i]) {
        continue;
      }
      // Mark self as mentioned
      mentioned[i] = true;

      int[] teammates = getTeammates(i);
      // Check if player has teammates
      if (teammates.length == 0) {
        sb.append("Player " + i + " is not in a team\n");
        continue;
      }

      // Print teammates
      sb.append("(" + i);
      for (int teammate : teammates) {
        sb.append(", " + teammate);
        // Mark teammates as mentioned
        mentioned[teammate] = true;
      }

      // Calculate whole team affinity
      float affinity = getTeamAffinity(getTeam(i));
      sb.append(") -> " + affinity + "\n");
    }

    return sb.toString();
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
