package com.xbis.models;

public class ResponseActivity {

  private long activityid;

  private long userid;

  private String username;

  private String activityname;

  private int membernum;

  private int teamnum;

  public ResponseActivity(long activityid, long userid,
                          String username, String activityname,
                          int membernum, int teamnum) {
    this.activityid = activityid;
    this.userid = userid;
    this.username = username;
    this.activityname = activityname;
    this.membernum = membernum;
    this.teamnum = teamnum;
  }

  public long getActivityid() {
    return activityid;
  }

  public void setActivityid(long activityid) {
    this.activityid = activityid;
  }

  public long getUserid() {
    return userid;
  }

  public void setUserid(long userid) {
    this.userid = userid;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getActivityname() {
    return activityname;
  }

  public void setActivityname(String activityname) {
    this.activityname = activityname;
  }

  public int getMembernum() {
    return membernum;
  }

  public void setMembernum(int membernum) {
    this.membernum = membernum;
  }

  public int getTeamnum() {
    return teamnum;
  }

  public void setTeamnum(int teamnum) {
    this.teamnum = teamnum;
  }
}
