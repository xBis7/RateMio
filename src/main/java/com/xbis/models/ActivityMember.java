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
@Table(name = "activity_members")
public class ActivityMember {

  @Id
  @Column(name="memberid")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long memberId;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "userid")
  private User user;

  @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.REMOVE })
  @JoinColumn(name = "activityid")
  private Activity activity;

  public ActivityMember() {
    super();
  }

  public ActivityMember(long memberId, User user, Activity activity) {
    super();
    this.memberId = memberId;
    this.user = user;
    this.activity = activity;
  }

  public long getMemberId() {
    return memberId;
  }

  public void setMemberId(long memberId) {
    this.memberId = memberId;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public User getUser() {
    return user;
  }

  public void setActivity(Activity activity) {
    this.activity = activity;
  }

  public Activity getActivity() {
    return activity;
  }
}
