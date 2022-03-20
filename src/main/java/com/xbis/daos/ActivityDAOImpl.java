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
        List <Activity> activityList = session.createQuery("select * from activities;").list();
        return activityList;
    }

    @Override
    public List<Activity> getAllUserActivities(long ownerId) {
        Session session = this.sessionFactory.getCurrentSession();
        String sqlQuery = "select * from activities where activities.ownerid = ?0";
        Query query = session.createQuery(sqlQuery);
        query.setParameter(0, ownerId);
        List<Activity> list = query.getResultList();
        return list;
    }

    @Override
    public List<User> getAllActivityUsers(long activityId) {
        Session session = this.sessionFactory.getCurrentSession();
        String sqlQuery = "select username from users, activity_members where activity_members.activityid = ?0 and activity_members.userid = users.userid;";
        Query query = session.createQuery(sqlQuery);
        query.setParameter(0, activityId);
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
