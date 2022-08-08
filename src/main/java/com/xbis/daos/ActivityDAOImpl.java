package com.xbis.daos;

import com.xbis.models.Activity;
import com.xbis.models.ResponseActivity;
import com.xbis.models.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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

    String sqlQuery = "SELECT a.activityid, a.user.userid, a.activityname, a.membernum, a.teamnum FROM Activity a WHERE a.user.userid = :ownerid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("ownerid", ownerId);

    List<Activity> activityList = query.getResultList();

    return activityList;
  }

  @Override
  public List<User> getAllActivityUsers(long activityId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT username FROM User, ActivityMember where ActivityMember.activityid = :activityId AND ActivityMember.userid = User.userid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("activityId", activityId);
    List<User> list = query.getResultList();
    return list;
  }

  @Override
  public Activity getActivity(long activityId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT a.activityid, a.user.userid, a.user.username, a.activityname, a.membernum, a.teamnum " +
        "FROM Activity a WHERE a.activityid = :activityid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("activityid", activityId);

    List<Activity> list = query.getResultList();

    return list.get(0);
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
