package com.xbis.models;

/**
 * Class for returning a confirmation token.
 * Only one boolean field.
 */
public class ConfToken {

  private boolean success;

  public ConfToken(boolean success) {
    this.success = success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }

  public boolean isSuccess() {
    return success;
  }
}
