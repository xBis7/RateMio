package com.xbis.services;

import com.xbis.daos.ActivityMemberDAO;
import com.xbis.models.Activity;
import com.xbis.models.ActivityMember;
import com.xbis.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service("activityMemberService")
public class ActivityMemberServiceImpl implements ActivityMemberService {

  @Autowired
  ActivityMemberDAO activityMemberDAO;

  @Override
  @Transactional
  public ActivityMember getActivityMemberEntry(long memberid) {
    return activityMemberDAO.getActivityMemberEntry(memberid);
  }

  @Override
  @Transactional
  public List<ActivityMember> getAllActivityMemberEntries() {
    return activityMemberDAO.getAllActivityMemberEntries();
  }

  @Override
  @Transactional
  public List<Activity> getAllMemberActivities(long userid) {
    return activityMemberDAO.getAllMemberActivities(userid);
  }

  @Override
  @Transactional
  public List<User> getAllActivityMembers(long activityid) {
    return activityMemberDAO.getAllActivityMembers(activityid);
  }

  @Override
  @Transactional
  public ActivityMember addActivityMember(ActivityMember activityMember) {
    return activityMemberDAO.addActivityMember(activityMember);
  }

  @Override
  @Transactional
  public boolean removeMember(long memberid) {
    return activityMemberDAO.removeMember(memberid);
  }
}
