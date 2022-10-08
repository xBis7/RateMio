package com.xbis.optimization;

public class TeamModel {

  private String username1;
  private String username2;
  private float teamRating;

  public TeamModel(String username1, String username2,
                   float teamRating) {
    this.username1 = username1;
    this.username2 = username2;
    this.teamRating = teamRating;
  }

  public String getUsername1() {
    return username1;
  }

  public void setUsername1(String username1) {
    this.username1 = username1;
  }

  public String getUsername2() {
    return username2;
  }

  public void setUsername2(String username2) {
    this.username2 = username2;
  }

  public float getTeamRating() {
    return teamRating;
  }

  public void setTeamRating(float teamRating) {
    this.teamRating = teamRating;
  }
}
