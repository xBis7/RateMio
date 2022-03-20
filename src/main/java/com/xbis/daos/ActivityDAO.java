package com.xbis.daos;

import com.xbis.models.Activity;
import com.xbis.models.User;

import java.util.List;

public interface ActivityDAO {

    public List<Activity> getAllActivities();

    public List<Activity> getAllUserActivities(long ownerId);

    public List<User> getAllActivityUsers(long activityId);

    public Activity getActivity(long activityId);

    public Activity addActivity(Activity activity);

    public void updateMemberNum(Activity activity, int num);

    public void updateTeamNum(Activity activity, int num);

    public boolean deleteActivity(long activityId);
}
