package com.xbis.daos;

import com.xbis.models.Activity;
import com.xbis.models.ActivityMember;
import com.xbis.models.User;

import java.util.List;

public interface ActivityMemberDAO {

  public ActivityMember getActivityMemberEntry(long memberid);

  public List<ActivityMember> getAllActivityMemberEntries();

  public List<Activity> getAllMemberActivities(long userid);

  public List<User> getAllActivityMembers(long activityid);

  public ActivityMember addActivityMember(ActivityMember activityMember);

  public boolean removeMember(long memberid);
}
