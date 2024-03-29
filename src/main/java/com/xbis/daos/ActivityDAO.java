package com.xbis.daos;

import com.xbis.models.Activity;
import com.xbis.models.ActivityMember;
import com.xbis.models.User;

import java.util.List;

public interface ActivityDAO {

  public List<Activity> getAllActivities();

  public List<Activity> getAllUserActivities(long ownerId);

  public List<User> getAllActivityUsers(long ownerId, long activityId);

  public List<User> getAllUsersNonAdminNonMember(long activityId);

  public List<Activity> getActivity(long activityId);

  public Activity getActivityObject(long activityId);

  public Activity addActivity(Activity activity, ActivityMember activityMember);

  public void updateMemberNum(Activity activity, int num);

  public void refreshMemberNum(Activity activity);

  public void updateTeamNum(Activity activity, int num);

  public boolean deleteActivity(long activityId);
}
