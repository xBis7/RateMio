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

  public List<TeamModel> initOptimization() {
    Game game = new Game(playerNum, reviewList);
    Matchmaking matchmaking = new Matchmaking(game, reviewList);

    // get original teams
    Teams teams = matchmaking.run();
    // iterate to get ratings
    game.iteration(teams);

    // get new teams
    teams = matchmaking.run();

    List<TeamModel> teamModelList = teams.getTeams();

    for (TeamModel teamModel : teamModelList) {
      System.out.println("username1: " + teamModel.getUsername1());
      System.out.println("username2: " + teamModel.getUsername2());
      System.out.println("team rating: " + teamModel.getTeamRating());
    }

    return teamModelList;
  }
}
