package com.xbis.services;

import com.xbis.daos.UserDAO;
import com.xbis.models.Activity;
import com.xbis.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service("userService")
public class UserServiceImpl implements UserService {

  @Autowired
  UserDAO userDAO;

  @Override
  @Transactional
  public List<User> getAllUsers(long currentUserId){
    return userDAO.getAllUsers(currentUserId);
  }

  @Override
  @Transactional
  public User getUser(long userId) {
    return userDAO.getUser(userId);
  }

  @Override
  @Transactional
  public User getAdmin() {
    return userDAO.getAdmin();
  }

  @Override
  @Transactional
  public User addUser(User user) {
    return userDAO.addUser(user);
  }

  @Override
  @Transactional
  public boolean checkUser(String username, String password) {
    return userDAO.checkUser(username, password);
  }

  @Override
  @Transactional
  public List<Activity> getAllUserActivities(long userId) {
    return userDAO.getAllUserActivities(userId);
  }

  @Override
  @Transactional
  public void updateAccessLevel(User user, int level) {
    userDAO.updateAccessLevel(user, level);
  }

  @Override
  @Transactional
  public boolean deleteUser(long userId) {
    return userDAO.deleteUser(userId);
  }

  @Override
  @Transactional
  public void setActiveUserList(List<User> activeUserList) {
    userDAO.setActiveUserList(activeUserList);
  }

  @Override
  @Transactional
  public List<User> getActiveUserList() {
    return userDAO.getActiveUserList();
  }

  @Override
  @Transactional
  public void userLogin(User user) {
    userDAO.userLogin(user);
  }

  @Override
  @Transactional
  public void userLogout() {
    userDAO.userLogout();
  }
}
