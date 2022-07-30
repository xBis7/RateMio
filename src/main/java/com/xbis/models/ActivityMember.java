package com.xbis.models;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;

@Entity
@Table(name = "activity_members")
public class ActivityMember {

  @Id
  @ManyToOne
  @JoinColumn(name = "userid")
  private User user;

  @ManyToOne
  @JoinColumn(name = "activityid")
  private Activity activity;

  public ActivityMember() {
  }

  public ActivityMember(User user, Activity activity) {
    this.user = user;
    this.activity = activity;
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
