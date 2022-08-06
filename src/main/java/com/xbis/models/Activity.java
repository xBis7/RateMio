package com.xbis.models;

import javax.persistence.*;
import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "activities")
public class Activity {

  @Id
  @Column(name = "activityid")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long activityId;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "ownerid", nullable = false)
  private User user;

  @Column(name = "activityname", nullable = false, unique = true)
  private String name;

  @Column(name = "membernum")
  private int memberNum;

  @Column(name = "teamnum")
  private int teamNum;

  @OneToMany(mappedBy = "activity", cascade = CascadeType.MERGE)
  private List<ActivityMember> memberList;

  public Activity() {
    super();
  }

  public Activity(long activityId, User user, String name, int memberNum, int teamNum) {
    super();
    this.activityId = activityId;
    this.user = user;
    this.name = name;
    this.memberNum = memberNum;
    this.teamNum = teamNum;
  }

  public long getActivityId() {
    return activityId;
  }

  public void setActivityId(long activityId) {
    this.activityId = activityId;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getMemberNum() {
    return memberNum;
  }

  public void setMemberNum(int memberNum) {
    this.memberNum = memberNum;
  }

  public int getTeamNum() {
    return teamNum;
  }

  public void setTeamNum(int teamNum) {
    this.teamNum = teamNum;
  }
}
