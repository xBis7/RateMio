package com.xbis.models;

public class AuthToken {

  private long userid;
  private String username;
  private String email;
  private int accesslevel;

  public AuthToken(long userid, String username, String email, int accesslevel) {
    this.userid = userid;
    this.username = username;
    this.email = email;
    this.accesslevel = accesslevel;
  }

  public long getUserId() {
    return userid;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getUsername() {
    return username;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getEmail() {
    return email;
  }

  public void setAccessLevel(int accesslevel) {
    this.accesslevel = accesslevel;
  }

  public int getAccessLevel() {
    return accesslevel;
  }
}