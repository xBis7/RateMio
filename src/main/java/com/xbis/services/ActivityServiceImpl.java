package com.xbis.services;

import com.xbis.daos.ActivityDAO;
import com.xbis.models.Activity;
import com.xbis.models.ActivityMember;
import com.xbis.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service("activityService")
public class ActivityServiceImpl implements ActivityService {

  @Autowired
  ActivityDAO activityDAO;

  @Override
  @Transactional
  public List<Activity> getAllActivities() {
    return activityDAO.getAllActivities();
  }

  @Override
  @Transactional
  public List<Activity> getAllUserActivities(long ownerId) {
    return activityDAO.getAllUserActivities(ownerId);
  }

  @Override
  @Transactional
  public List<User> getAllActivityUsers(long ownerId, long activityId) {
    return activityDAO.getAllActivityUsers(ownerId, activityId);
  }

  @Override
  @Transactional
  public List<User> getAllUsersNonAdminNonMember(long activityId) {
    return activityDAO.getAllUsersNonAdminNonMember(activityId);
  }

  @Override
  @Transactional
  public List<Activity> getActivity(long activityId) {
    return activityDAO.getActivity(activityId);
  }

  @Override
  @Transactional
  public Activity getActivityObject(long activityId) {
    return activityDAO.getActivityObject(activityId);
  }

  @Override
  @Transactional
  public Activity addActivity(Activity activity, ActivityMember activityMember) {
    return activityDAO.addActivity(activity, activityMember);
  }

  @Override
  @Transactional
  public void updateMemberNum(Activity activity, int num) {
    activityDAO.updateMemberNum(activity, num);
  }

  @Override
  @Transactional
  public void refreshMemberNum(Activity activity) {
    activityDAO.refreshMemberNum(activity);
  }

  @Override
  @Transactional
  public void updateTeamNum(Activity activity, int num) {
    activityDAO.updateTeamNum(activity, num);
  }

  @Override
  @Transactional
  public boolean deleteActivity(long activityId) {
    return activityDAO.deleteActivity(activityId);
  }
}
