package com.xbis.models.optimization;

import java.util.Scanner;

public class Game {
  private final int players;

  private float preferences[][];
  private float ratings[][];

  private Teams teams;
  private final int teamSize = 2;

  Scanner scanner = new Scanner(System.in);

  public Game(int players) {
    this.players = players;

    // Preferences (thumbs up or down)
    preferences = new float[players][players];
    for (int i = 0; i < players; i++) {
      for (int j = 0; j < players; j++) {
        preferences[i][j] = Preference.NEUTRAL;
      }
    }

    // Ratings (from 1 to 5)
    ratings = new float[players][players];
    for (int i = 0; i < players; i++) {
      for (int j = 0; j < players; j++) {
        // Initialize to 2 so players have a initial "medium" value
        ratings[i][j] = i == j ? 0.0f : 2.0f;
      }
    }
  }

  private int askRating(Scanner scanner, String name, int teammate) {
    int rating = 0;
    while (rating < 1 || rating > 5) {
      System.out.printf(name + " rating for player %d (1-5): ", teammate);
      System.out.flush();
      rating = scanner.nextInt();
    }
    scanner.skip("(\r\n|[\n\r])?");

    return rating;
  }

  // Simulates the end of round for player <player>, asking him to rate his
  // teammates.
  private void playerIteration(int i) {
    int[] teammates = teams.getTeammates(i);
    if (teammates.length == 0) {
      System.out.println("Player " + i + " doesn't play this round");
      return;
    }

    System.out.println("Player " + i + " round:");
    // Ask for the user to punctuate each teammate
    for (int j = 0; j < teamSize - 1; j++) {
      int teammate = teammates[j];

      int quality = askRating(scanner, "Quality", teammate);
      int cooperation = askRating(scanner, "Cooperation", teammate);
      // Compute weighted rating
      float rating = Matchmaking.QUALITY_WEIGHT * quality + (1 - Matchmaking.QUALITY_WEIGHT) * cooperation;

      // Set rating
      ratings[i][teammate] = rating;

      char preference = '\0';
      while (preference != 'y' && preference != 'n' && preference != '\n') {
        System.out.printf("Preference for player %d (y/n or press enter to skip): ", teammate);
        System.out.flush();

        String input = scanner.nextLine();

        if (input.length() == 0) {
          break;
        } else if (input.length() != 1) {
          continue;
        }

        preference = input.charAt(0);
      }

      // Set preference
      switch (preference) {
        case 'y':
          preferences[i][teammate] = Preference.THUMBS_UP;
          break;
        case 'n':
          preferences[i][teammate] = Preference.THUMBS_DOWN;
          break;
        default:
          preferences[i][teammate] = Preference.NEUTRAL;
      }
    }

  }

  // Simulates a round, where players give each other a rating and a
  // preference.
  public void iteration(Teams teams) {
    this.teams = teams;

    for (int i = 0; i < players; i++) {
      playerIteration(i);
    }
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

  public int getPlayers() {
    return players;
  }

}
