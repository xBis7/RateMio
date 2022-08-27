package com.xbis.models;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.OneToMany;
import javax.persistence.ManyToOne;
import javax.persistence.CascadeType;
import java.util.List;

@Entity
@Table(name = "activities")
public class Activity {

  @Id
  @Column(name = "activityid")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long activityid;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "ownerid", nullable = false)
  private User user;

  @Column(name = "activityname", nullable = false, unique = true)
  private String activityname;

  @Column(name = "membernum")
  private int membernum;

  @Column(name = "teamnum")
  private int teamnum;

  @OneToMany(mappedBy = "activity", cascade = {CascadeType.MERGE, CascadeType.REMOVE })
  private List<ActivityMember> memberList;

  @OneToMany(mappedBy = "activity", cascade = {CascadeType.MERGE, CascadeType.REMOVE})
  private List<Review> reviewList;

  @OneToMany(mappedBy = "activity", cascade = {CascadeType.MERGE, CascadeType.REMOVE})
  private List<PendingReview> pendingReviewList;

  public Activity() {
    super();
  }

  public Activity(long activityid, User user, String activityname, int membernum, int teamnum) {
    super();
    this.activityid = activityid;
    this.user = user;
    this.activityname = activityname;
    this.membernum = membernum;
    this.teamnum = teamnum;
  }

  public long getActivityId() {
    return activityid;
  }

  public void setActivityId(long activityId) {
    this.activityid = activityid;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public String getActivityName() {
    return activityname;
  }

  public void setActivityName(String activityname) {
    this.activityname = activityname;
  }

  public int getMemberNum() {
    return membernum;
  }

  public void setMemberNum(int membernum) {
    this.membernum = membernum;
  }

  public int getTeamNum() {
    return teamnum;
  }

  public void setTeamNum(int teamnum) {
    this.teamnum = teamnum;
  }
}
