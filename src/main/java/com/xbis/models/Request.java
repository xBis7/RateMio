package com.xbis.models;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.persistence.CascadeType;

@Entity
@Table(name = "requests")
public class Request {

  @Id
  @Column(name = "requestid")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long requestId;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "userid")
  private User user;

  @Column(name = "reqtype", nullable = false)
  private String reqtype;

  public Request() {
    super();
  }

  public Request(long requestId, User user, String reqtype) {
    super();
    this.requestId = requestId;
    this.user = user;
    this.reqtype = reqtype;
  }

  public long getRequestId() {
    return requestId;
  }

  public void setRequestId(long requestId) {
    this.requestId = requestId;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public String getReqType() {
    return reqtype;
  }

  public void setReqType(String reqtype) {
    this.reqtype = reqtype;
  }
}
