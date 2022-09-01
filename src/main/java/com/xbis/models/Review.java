package com.xbis.models;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.ManyToOne;
import javax.persistence.CascadeType;

@Entity
@Table(name = "reviews")
public class Review {

  @Id
  @Column(name = "reviewid")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long reviewid;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "reviewerid")
  private User reviewer;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "reviewedid")
  private User reviewed;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "activityid")
  private Activity activity;

  @Column(name = "communication")
  private int communication;

  @Column(name = "productivity")
  private int productivity;

  @Column(name = "efficiency")
  private int efficiency;

  @Column(name = "openness")
  private int openness;

  @Column(name = "balance")
  private int balance;

  public Review() {
    super();
  }

  public Review(long reviewid, User reviewer,
                User reviewed, Activity activity,
                int communication, int productivity,
                int efficiency, int openness, int balance) {
    super();
    this.reviewid = reviewid;
    this.reviewer = reviewer;
    this.reviewed = reviewed;
    this.activity = activity;
    this.communication = communication;
    this.productivity = productivity;
    this.efficiency = efficiency;
    this.openness = openness;
    this.balance = balance;
  }

  public long getReviewid() {
    return reviewid;
  }

  public void setReviewid(long reviewid) {
    this.reviewid = reviewid;
  }

  public User getReviewer() {
    return reviewer;
  }

  public void setReviewer(User reviewer) {
    this.reviewer = reviewer;
  }

  public User getReviewed() {
    return reviewed;
  }

  public void setReviewed(User reviewed) {
    this.reviewed = reviewed;
  }

  public Activity getActivity() {
    return activity;
  }

  public void setActivity(Activity activity) {
    this.activity = activity;
  }

  public int getCommunication() {
    return communication;
  }

  public void setCommunication(int communication) {
    this.communication = communication;
  }

  public int getProductivity() {
    return productivity;
  }

  public void setProductivity(int productivity) {
    this.productivity = productivity;
  }

  public int getEfficiency() {
    return efficiency;
  }

  public void setEfficiency(int efficiency) {
    this.efficiency = efficiency;
  }

  public int getOpenness() {
    return openness;
  }

  public void setOpenness(int openness) {
    this.openness = openness;
  }

  public int getBalance() {
    return balance;
  }

  public void setBalance(int balance) {
    this.balance = balance;
  }
}
