package com.xbis.services;

import com.xbis.models.Activity;
import com.xbis.models.User;

import java.util.List;

public interface ActivityService {

  public List<Activity> getAllActivities();

  public List<Activity> getAllUserActivities(long ownerId);

  public List<User> getAllActivityUsers(long ownerId, long activityId);

  public List<User> getAllUsersNonAdminNonMember(long activityId);

  public List<Activity> getActivity(long activityId);

  public Activity getActivityObject(long activityId);

  public Activity addActivity(Activity activity);

  public void updateMemberNum(Activity activity, int num);

  public void updateTeamNum(Activity activity, int num);

  public boolean deleteActivity(long activityId);
}
