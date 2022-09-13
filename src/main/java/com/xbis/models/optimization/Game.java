package com.xbis.models.optimization;

import com.xbis.models.Review;

import java.util.List;

public class Game {
  private final int playerNum;
  private final List<Review> reviewList;
  private float preferences[][];
  private float ratings[][];

  private Teams teams;
  private final int teamSize = 2;

  public Game(int playerNum, List<Review> reviewList) {
    this.playerNum = playerNum;
    this.reviewList = reviewList;

    // Preferences (thumbs up or down)
    preferences = new float[playerNum][playerNum];
    for (int i = 0; i < playerNum; i++) {
      for (int j = 0; j < playerNum; j++) {
        preferences[i][j] = Preference.NEUTRAL;
      }
    }

    // Ratings (from 1 to 5)
    ratings = new float[playerNum][playerNum];
    for (int i = 0; i < playerNum; i++) {
      for (int j = 0; j < playerNum; j++) {
        // Initialize to 2 so players have a initial "medium" value
        ratings[i][j] = i == j ? 0.0f : 2.0f;
      }
    }
  }

  // Simulates a round, where players give each other a rating and a
  // preference.
  public void iteration(Teams teams) {
    this.teams = teams;

    for (int i = 0; i < playerNum; i++) {
      playerIteration(i);
    }
  }

  // Simulates the end of round for player <player>, asking him to rate his
  // teammates.
  private void playerIteration(int i) {
    int[] teammates = teams.getTeammates(i);
    if (teammates.length == 0) {
      System.out.println("Player " + i + " doesn't play this round");
      return;
    }

    // Ask for the user to punctuate each teammate
    for (int j = 0; j < teamSize - 1; j++) {
      int teammate = teammates[j];

      Review review = (Review) reviewList.get(teammate);

      if (j == 0) {
        System.out.println("Player " +
            review.getReviewer().getUsername() + " rating:");
      }

      int quality = getRating("quality", review);
      int collaboration = getRating("collaboration", review);
      // Compute weighted rating
      float rating = Matchmaking.QUALITY_WEIGHT * quality + (1 - Matchmaking.QUALITY_WEIGHT) * collaboration;

      // Set rating
      ratings[i][teammate] = rating;

      String preference = review.getPreference();

      System.out.println("\tPreference for player " +
          review.getReviewed().getUsername() + ": " + preference);

      // Set preference
      switch (preference) {
        case "yes":
          preferences[i][teammate] = Preference.THUMBS_UP;
          break;
        case "no":
          preferences[i][teammate] = Preference.THUMBS_DOWN;
          break;
        case "neutral":
          preferences[i][teammate] = Preference.NEUTRAL;
      }
    }
  }

  private int getRating(String name,
                        Review review) {
    int rating;

    if (name.equals("quality")) {
      rating = review.getQuality();
    } else {
      rating = review.getCollaboration();
    }
    System.out.println("\t" + name + " rating for player " +
        review.getReviewed().getUsername() + " : " + rating);
    return rating;
  }

  public float[][] getPreferences() {
    return preferences;
  }

  public float[][] getRatings() {
    return ratings;
  }

  public int getTeamSize() {
    return teamSize;
  }

  public int getPlayerNum() {
    return playerNum;
  }
}
