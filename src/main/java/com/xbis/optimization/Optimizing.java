package com.xbis.optimization;

import com.xbis.models.Review;

import java.util.ArrayList;
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
    Teams currTeams = matchmaking.run();
    // iterate to get ratings
    game.iteration(currTeams);

    // get new affinity for the teams
    Teams newTeams = matchmaking.run();

    // existing teams
    List<TeamModel> teamModelList = newTeams.getTeams();

    // for rearranging team members
    List<TeamModel> tmpTeamList = new ArrayList<>();

    for (TeamModel teamModel : teamModelList) {
      // for debugging
      System.out.println("username1: " + teamModel.getUsername1());
      System.out.println("username2: " + teamModel.getUsername2());
      System.out.println("team rating: " + teamModel.getTeamRating());

      // bad affinity, rearrange the teams
      if (teamModel.getTeamRating() < 5) {
        // first team
        String username1 = teamModel.getUsername1();
        String username2 = teamModel.getUsername2();

        for (int i = 0; i < teamModelList.size(); i++) {
          TeamModel currTeamModel = teamModelList.get(i);

          // if not the first team
          if (!teamModel.equals(currTeamModel)) {
            String currUsername1 = currTeamModel.getUsername1();
            String currUsername2 = currTeamModel.getUsername2();

            TeamModel tmpTeamModel1 = new TeamModel(username1, currUsername2, 0);
            TeamModel tmpTeamModel2 = new TeamModel(currUsername1, username2, 0);

            tmpTeamList.add(tmpTeamModel1);
            tmpTeamList.add(tmpTeamModel2);
          }
        }
      }
    }

    if (tmpTeamList.size() > 0) {
      return tmpTeamList;
    } else {
      return teamModelList;
    }
  }
}
