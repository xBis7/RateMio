package com.xbis.models;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

  @Id
  @Column(name = "userid")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long userid;

  @Column(name = "username", unique = true)
  private String username;

  @Column(name = "email")
  private String email;

  @Column(name = "hashedpassword")
  private String password;

  @Column(name = "salt")
  private String salt;

  @Column(name = "accesslevel")
  private int accessLevel;

  @OneToMany(mappedBy = "receiver", cascade = CascadeType.MERGE)
  private List<Request> reqReceiverList;

  @OneToMany(mappedBy = "sender", cascade = CascadeType.MERGE)
  private List<Request> reqSenderList;

  @OneToMany(mappedBy = "user", cascade = CascadeType.MERGE)
  private List<Activity> activityList;

  @OneToMany(mappedBy = "user", cascade = CascadeType.MERGE)
  private List<Review> reviewList;

  @OneToMany(mappedBy = "reviewer", cascade = CascadeType.MERGE)
  private List<PendingReview> pendReviewerList;

  @OneToMany(mappedBy = "reviewed", cascade = CascadeType.MERGE)
  private List<PendingReview> pendReviewedList;

  public User() {
    super();
  }

  public User(long userid, String username, String email,
              String password, String salt) {
    super();
    this.userid = userid;
    this.username = username;
    this.email = email;
    this.password = password;
    this.salt = salt;
    this.accessLevel = 3;           //all users will get access level = 3
  }

  public long getUserid() {
    return userid;
  }

  public void setUserid(long userid) {
    this.userid = userid;
  }

  public List<Request> getReqReceiverList() {
    return reqReceiverList;
  }

  public void setReqReceiverList(List<Request> reqReceiverList) {
    this.reqReceiverList = reqReceiverList;
  }

  public List<Request> getReqSenderList() {
    return reqSenderList;
  }

  public void setReqSenderList(List<Request> reqSenderList) {
    this.reqSenderList = reqSenderList;
  }

  public List<Activity> getActivityList() {
    return activityList;
  }

  public void setActivityList(List<Activity> activityList) {
    this.activityList = activityList;
  }

  public List<Review> getReviewList() {
    return reviewList;
  }

  public void setReviewList(List<Review> reviewList) {
    this.reviewList = reviewList;
  }

  public List<PendingReview> getPendReviewerList() {
    return pendReviewerList;
  }

  public void setPendReviewerList(List<PendingReview> pendReviewerList) {
    this.pendReviewerList = pendReviewerList;
  }

  public List<PendingReview> getPendReviewedList() {
    return pendReviewedList;
  }

  public void setPendReviewedList(List<PendingReview> pendReviewedList) {
    this.pendReviewedList = pendReviewedList;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getSalt() {
    return salt;
  }

  public void setSalt(String salt) {
    this.salt = salt;
  }

  public void setAccessLevel(int accessLevel) {
    this.accessLevel = accessLevel;
  }

  public int getAccessLevel() {
    return accessLevel;
  }
}
