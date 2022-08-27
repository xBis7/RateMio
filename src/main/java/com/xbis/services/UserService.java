package com.xbis.services;

import com.xbis.models.Activity;
import com.xbis.models.User;

import java.util.List;

public interface UserService {

  public List<User> getAllUsers(long currentUserId);

  public User getUser(long userId);

  public User getAdmin();

  public User addUser(User user);

  public boolean checkUser(String username, String password);

  public List<Activity> getAllUserActivities(long userId);

  public void updateAccessLevel(User user, int level);

  public boolean deleteUser(long userId);

  public void setActiveUserList(List<User> activeUserList);

  public List<User> getActiveUserList();

  public void userLogin(User user);

  public void userLogout();
}
