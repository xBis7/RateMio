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

  @Column(name = "quality")
  private int quality;

  @Column(name = "collaboration")
  private int collaboration;

  @Column(name = "preference")
  private String preference;

  public Review() {
    super();
  }

  public Review(long reviewid, User reviewer,
                User reviewed, Activity activity,
                int quality, int collaboration,
                String preference) {
    super();
    this.reviewid = reviewid;
    this.reviewer = reviewer;
    this.reviewed = reviewed;
    this.activity = activity;
    this.quality = quality;
    this.collaboration = collaboration;
    this.preference = preference;
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

  public int getQuality() {
    return quality;
  }

  public void setQuality(int quality) {
    this.quality = quality;
  }

  public int getCollaboration() {
    return collaboration;
  }

  public void setCollaboration(int collaboration) {
    this.collaboration = collaboration;
  }

  public String getPreference() {
    return preference;
  }

  public void setPreference(String preference) {
    this.preference = preference;
  }
}
