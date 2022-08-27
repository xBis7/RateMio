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
@Table(name = "pending_reviews")
public class PendingReview {

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

  public PendingReview() {
    super();
  }

  public PendingReview(long reviewid, User reviewer,
                       User reviewed, Activity activity) {
    super();
    this.reviewid = reviewid;
    this.reviewer = reviewer;
    this.reviewed = reviewed;
    this.activity = activity;
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
}
