package com.xbis.models.optimization;

import com.xbis.models.Review;

import java.util.List;

public class Optimizing {

  public static final boolean DEBUG = true;
  private final int playerNum;
  private final List<Review> reviewList;

  public Optimizing(int playerNum, List<Review> reviewList) {
    this.playerNum = playerNum;
    this.reviewList = reviewList;
  }

  public void initOptimization() {
    Game game = new Game(playerNum, reviewList);
    Matchmaking matchmaking = new Matchmaking(game);

    // get original teams
    Teams teams = matchmaking.run();

    // iterate to get ratings
    game.iteration(teams);

    // get new teams
    matchmaking.run();
  }
}
