package com.xbis.models;

public class ResponseRequest {

  long requestid;

  long userid;

  String type;

  public ResponseRequest(long requestid, long userid, String type) {
    this.requestid = requestid;
    this.userid = userid;
    this.type = type;
  }

  public long getRequestid() {
    return requestid;
  }

  public void setRequestid(long requestid) {
    this.requestid = requestid;
  }

  public long getUserid() {
    return userid;
  }

  public void setUserid(long userid) {
    this.userid = userid;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }
}
