package com.xbis.models.optimization;

import com.xbis.models.Review;

import java.util.List;

public class Optimizing {

  public static final boolean DEBUG = true;

  private int playerNum;
  private List<Review> reviewList;

  public Optimizing(int playerNum, List<Review> reviewList) {
    this.playerNum = playerNum;
    this.reviewList = reviewList;
  }

  public void initOptimization() {
    Game game = new Game(playerNum);
    Matchmaking matchmaking = new Matchmaking(game);

    for (int rounds = 0; rounds < 5; rounds++) {
      System.out.println("--------------------");
      System.out.println("Round " + rounds);
      System.out.println("--------------------");

      Teams teams = matchmaking.run();
      game.iteration(teams);

      System.out.println("--------------------");
      System.out.println();
    }
  }
}
