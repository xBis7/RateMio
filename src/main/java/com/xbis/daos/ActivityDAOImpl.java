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
    List <Activity> activityList = session.createQuery("SELECT a FROM Activity a").list();
    return activityList;
  }

  @Override
  public List<Activity> getAllUserActivities(long ownerId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT a FROM Activity a WHERE a.ownerid = :ownerid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("ownerid", ownerId);
    List<Activity> list = query.getResultList();
    return list;
  }

  @Override
  public List<User> getAllActivityUsers(long activityId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT username FROM User, ActivityMember where ActivityMember.activityid = :activityId and ActivityMember.userid = User.userid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("activityId", activityId);
    List<User> list = query.getResultList();
    return list;
  }

  @Override
  public Activity getActivity(long activityId) {
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
    if(persistentIns != null){
      session.delete(persistentIns);
      return true;
    }
    return false;
  }
}
