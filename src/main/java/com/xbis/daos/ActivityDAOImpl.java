package com.xbis.daos;

import com.xbis.models.Activity;
import com.xbis.models.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ActivityDAOImpl implements ActivityDAO {

  @Autowired
  private SessionFactory sessionFactory;

  public void setSessionFactory(SessionFactory sessionFactory){
    this.sessionFactory = sessionFactory;
  }

  public Session getSession() {
    return sessionFactory.openSession();
  }

  @Override
  public List<Activity> getAllActivities() {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT a FROM Activity a";
    Query query = session.createQuery(sqlQuery);

    List<Activity> activityList = query.getResultList();

    return activityList;
  }

  @Override
  public List<Activity> getAllUserActivities(long ownerId) {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT a.activityid, a.user.username, a.activityname, a.membernum, a.teamnum " +
        "FROM Activity a WHERE a.user.userid = :ownerid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("ownerid", ownerId);

    List<Activity> activityList = query.getResultList();

    return activityList;
  }

  /**
   * We want all the members, so we get all the users, except the owner.
   */
  @Override
  public List<User> getAllActivityUsers(long ownerid, long activityid) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT u.userid, u.username FROM User u, ActivityMember am WHERE " +
        "u.userid=am.user.userid AND am.user.userid != :ownerId AND am.activity.activityid = :activityId";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("ownerId", ownerid);
    query.setParameter("activityId", activityid);
    List<User> list = query.getResultList();

    return list;
  }

  @Override
  public List<User> getAllUsersNonAdminNonMember(long activityId) {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT u.userid, u.username, u.email, u.accessLevel FROM User u WHERE u.username != 'admin' " +
        "AND u.userid NOT IN (SELECT am.user.userid FROM ActivityMember am WHERE am.activity.activityid= :activityId)";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("activityId", activityId);
    List <User> userList = query.getResultList();

    return userList;
  }

  @Override
  public List<Activity> getActivity(long activityId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT a.activityid, a.user.userid, a.user.username, a.activityname, a.membernum, a.teamnum " +
        "FROM Activity a WHERE a.activityid = :activityid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("activityid", activityId);

    List<Activity> list = query.getResultList();

    return list;
  }

  @Override
  public Activity getActivityObject(long activityId) {
    Session session = this.sessionFactory.getCurrentSession();
    Activity activity = (Activity) session.get(Activity.class, activityId);
    return activity;
  }

  @Override
  public Activity addActivity(Activity activity) {
    Session session = this.sessionFactory.getCurrentSession();
    session.persist(activity);
    return activity;
  }

  @Override
  public void updateMemberNum(Activity activity, int num) {
    Session session = this.sessionFactory.getCurrentSession();
    activity.setMemberNum(num);
    session.update(activity);
  }

  @Override
  public void updateTeamNum(Activity activity, int num) {
    Session session = this.sessionFactory.getCurrentSession();
    activity.setTeamNum(num);
    session.update(activity);
  }

  @Override
  public boolean deleteActivity(long activityId) {
    Session session = this.sessionFactory.getCurrentSession();
    Object persistentIns = session.load(Activity.class, activityId);
    if (persistentIns != null){
      session.delete(persistentIns);
      return true;
    }
    return false;
  }
}
