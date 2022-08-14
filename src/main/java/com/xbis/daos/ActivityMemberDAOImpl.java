package com.xbis.daos;

import com.xbis.models.*;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.naming.event.ObjectChangeListener;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Repository
public class ActivityMemberDAOImpl implements ActivityMemberDAO{

  @Autowired
  private SessionFactory sessionFactory;

  public void setSessionFactory(SessionFactory sessionFactory){
    this.sessionFactory = sessionFactory;
  }

  public Session getSession() {
    return sessionFactory.openSession();
  }

  @Override
  public ActivityMember getActivityMemberEntry(long memberid) {
    Session session = this.sessionFactory.getCurrentSession();
    ActivityMember activityMember =
        (ActivityMember) session.get(ActivityMember.class, memberid);
    return activityMember;
  }

  @Override
  public List<ActivityMember> getActivityMemberEntry(long userid, long activityid) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT am.memberid, am.user.userid, am.activity.activityid " +
        "FROM ActivityMember am WHERE am.user.userid= :userid AND am.activity.activityid= :activityid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("userid", userid);
    query.setParameter("activityid", activityid);
    List<ActivityMember> resultList = query.getResultList();

    return resultList;
  }

  @Override
  public List<ActivityMember> getAllActivityMemberEntries() {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT am FROM ActivityMember am";
    Query query = session.createQuery(sqlQuery);
    List <ActivityMember> activityMemberList = query.getResultList();

    return activityMemberList;
  }

  @Override
  public List<Activity> getAllMemberActivities(long userid) {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT am.activity.activityname FROM ActivityMember am WHERE am.user.userid = :userid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("userid", userid);
    List <Activity> activityList = query.getResultList();

    return activityList;
  }

  @Override
  public List<User> getAllActivityMembers(long activityid) {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT am.User FROM ActivityMember am WHERE am.activityid = :activityid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("activityid", activityid);
    List <User> userList = query.getResultList();

    return userList;
  }

  @Override
  public ActivityMember addActivityMember(ActivityMember activityMember) {
    Session session = this.sessionFactory.getCurrentSession();
    session.persist(activityMember);
    return activityMember;
  }

  @Override
  public boolean removeMember(long memberid) {
    Session session = this.sessionFactory.getCurrentSession();
    Object persistentIns = session.load(Request.class, memberid);
    if (persistentIns != null) {
      session.delete(persistentIns);
      return true;
    }
    return false;
  }

  @Override
  public boolean removeMember(long userid, long activityid) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "DELETE FROM ActivityMember am WHERE am.user.userid= :userid AND am.activity.activityid= :activityid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("userid", userid);
    query.setParameter("activityid", activityid);

    int result = query.executeUpdate();

    if (result>0) {
      return true;
    }
    return false;
  }

  @Override
  public boolean removeActivity(long activityid) {
    Session session = this.sessionFactory.getCurrentSession();
    Object persistentIns = session.load(Request.class, activityid);
    if (persistentIns != null) {
      session.delete(persistentIns);
      return true;
    }
    return false;
  }
}

