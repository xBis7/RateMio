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
  private long requestid;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "receiverid")
  private User receiver;


  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "senderid")
  private User sender;

  @Column(name = "reqtype", nullable = false)
  private String reqtype;

  public Request() {
    super();
  }

  public Request(long requestid, User receiver, User sender, String reqtype) {
    super();
    this.requestid = requestid;
    this.receiver = receiver;
    this.sender = sender;
    this.reqtype = reqtype;
  }

  public long getRequestid() {
    return requestid;
  }

  public void setRequestid(long requestid) {
    this.requestid = requestid;
  }

  public User getReceiver() {
    return receiver;
  }

  public void setReceiver(User receiver) {
    this.receiver = receiver;
  }

  public User getSender() {
    return sender;
  }

  public void setSender(User sender) {
    this.sender = sender;
  }

  public String getReqtype() {
    return reqtype;
  }

  public void setReqtype(String reqtype) {
    this.reqtype = reqtype;
  }
}
