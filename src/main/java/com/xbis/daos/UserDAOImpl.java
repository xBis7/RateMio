package com.xbis.daos;

import com.xbis.models.Activity;
import com.xbis.models.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@Repository
public class UserDAOImpl implements UserDAO {

  @Autowired
  private SessionFactory sessionFactory;

  private List<User> activeUserList = new ArrayList<>();

  public void setSessionFactory(SessionFactory sessionFactory){
    this.sessionFactory = sessionFactory;
  }

  public Session getSession() {
    return sessionFactory.openSession();
  }

  @Override
  public List<User> getAllUsers(long currentUserId) {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT userid, username, email, accessLevel FROM User WHERE userid != :currId";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("currId", currentUserId);
    List <User> userList = query.getResultList();

    return userList;
  }

  @Override
  public User getUser(long userId) {
    Session session = this.sessionFactory.getCurrentSession();
    User user = (User) session.get(User.class, userId);
    return user;
  }

  @Override
  public User getAdmin() {
    Session session = this.sessionFactory.getCurrentSession();
    CriteriaBuilder builder = session.getCriteriaBuilder();
    CriteriaQuery<User> criteria = builder.createQuery(User.class);
    Root<User> root = criteria.from(User.class);
    criteria.select(root).where(root.get("username").in("admin"));

    Query<User> query = session.createQuery(criteria);

    List<User> results = query.getResultList();

    User user = (User) results.get(0);

    return user;
  }

  @Override
  public User addUser(User user) {
    Session session = this.sessionFactory.getCurrentSession();
    user.setSalt(PasswordUtil.generateSalt());
    String hashedPassword = PasswordUtil.hashThePassword(user.getPassword(), user.getSalt());
    user.setPassword(hashedPassword);
    user.setAccessLevel(3);
    session.persist(user);
    return user;
  }

  @Override
  public boolean checkUser(String username, String password) {
    System.out.println("Authenticating user...");
    Session session = sessionFactory.openSession();
    boolean userAuthenticated = false;

    String sqlQuery = "SELECT u FROM User u WHERE u.username=:name";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("name", username);
    List list = query.getResultList();
    if((list != null) && (list.size()) > 0) {
      setActiveUserList(list);

      //getting logged in user's password hash
      String hashedPass = activeUserList.get(activeUserList.size()-1).getPassword();

      //getting salt
      String salt = activeUserList.get(activeUserList.size()-1).getSalt();

      //use hash and salt to verify password entered
      if(PasswordUtil.verifyThePassword(password, hashedPass, salt) == true) {
        userAuthenticated = true;
      }
    }
    System.out.println("User authenticated: " + userAuthenticated);
    session.close();
    return userAuthenticated;
  }

  @Override
  public List<Activity> getAllUserActivities(long userId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "select activityname from activities, activity_members where activity_members.userid = ?0 and activities.activityid = activity_members.activityid;";
    Query query = session.createQuery(sqlQuery);
    query.setParameter(0, userId);
    List<Activity> list = query.getResultList();
    return list;
  }

  @Override
  public void updateAccessLevel(User user, int level) {
    Session session = this.sessionFactory.getCurrentSession();
    user.setAccessLevel(level);
    session.update(user);
  }

  @Override
  public boolean deleteUser(long userId) {
    Session session = this.sessionFactory.getCurrentSession();
    Object persistentIns = session.load(User.class, userId);
    if(persistentIns != null){
      session.delete(persistentIns);
      return true;
    }
    return false;
  }

  @Override
  public void setActiveUserList(List<User> activeUserList) {
    this.activeUserList = activeUserList;
  }

  @Override
  public List<User> getActiveUserList() {
    return activeUserList;
  }

  @Override
  public void userLogin(User user) {
    activeUserList.add(user);
  }

  @Override
  public void userLogout() {
    activeUserList.clear();
  }
}
