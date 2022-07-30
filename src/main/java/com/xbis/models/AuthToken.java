package com.xbis.models;

public class AuthToken {

  private String username;

  private String email;

  private int accessLevel;

  public AuthToken(String username, String email, int accessLevel) {
    this.username = username;
    this.email = email;
    this.accessLevel = accessLevel;
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

  public void setAccessLevel(int accessLevel) {
    this.accessLevel = accessLevel;
  }

  public int getAccessLevel() {
    return accessLevel;
  }
}