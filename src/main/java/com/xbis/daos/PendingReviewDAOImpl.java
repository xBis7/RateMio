package com.xbis.daos;

import com.xbis.models.PendingReview;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PendingReviewDAOImpl implements PendingReviewDAO {

  @Autowired
  private SessionFactory sessionFactory;

  public void setSessionFactory(SessionFactory sessionFactory){
    this.sessionFactory = sessionFactory;
  }

  public Session getSession() {
    return sessionFactory.openSession();
  }

  @Override
  public List<PendingReview> getAllPendingReviews() {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT pr.reviewid, pr.reviewer.userid, pr.reviewer.username," +
        " pr.reviewed.userid, pr.reviewed.username, pr.activity.activityid, pr.activity.activityname" +
        " FROM PendingReview pr";
    Query query = session.createQuery(sqlQuery);
    List <PendingReview> pendingReviewList = query.getResultList();

    return pendingReviewList;
  }

  @Override
  public List<PendingReview> getAllReviewedPendingReviews(long reviewedId) {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT pr.reviewid, pr.reviewer.userid, pr.reviewed.userid, pr.activity.activityid" +
        " FROM PendingReview pr WHERE pr.sender.userid = :reviewedid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("reviewedid", reviewedId);
    List <PendingReview> pendingReviewList = query.getResultList();

    return pendingReviewList;
  }

  @Override
  public List<PendingReview> getAllReviewerPendingReviews(long reviewerId) {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT pr.reviewid, pr.reviewed.userid, pr.reviewed.username, " +
        "pr.activity.activityname, pr.activity.activityid FROM PendingReview pr " +
        "WHERE pr.reviewer.userid = :reviewerid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("reviewerid", reviewerId);
    List <PendingReview> pendingReviewList = query.getResultList();

    return pendingReviewList;
  }

  @Override
  public List<PendingReview> getAllActivityPendingReviews(long activityId) {
    Session session = this.sessionFactory.getCurrentSession();

    String sqlQuery = "SELECT pr.reviewid, pr.reviewer.userid, pr.reviewer.username, pr.reviewed.userid, pr.reviewed.username, " +
        "pr.activity.activityid FROM PendingReview pr WHERE pr.activity.activityid = :activityid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("activityid", activityId);
    List <PendingReview> pendingReviewList = query.getResultList();

    return pendingReviewList;
  }

  @Override
  public PendingReview getPendingReview(long reviewId) {
    Session session = this.sessionFactory.getCurrentSession();
    PendingReview pendingReview = (PendingReview) session.get(PendingReview.class, reviewId);
    return pendingReview;
  }

  @Override
  public PendingReview getPendingReviewEntry(long reviewerId,
                                             long reviewedId,
                                             long activityId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT pr FROM PendingReview pr WHERE pr.reviewer.userid = :reviewerid " +
        "AND pr.reviewed.userid = :reviewedid AND pr.activity.activityid = :activityid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("reviewerid", reviewerId);
    query.setParameter("reviewedid", reviewedId);
    query.setParameter("activityid", activityId);
    List <PendingReview> pendingReviewList = query.getResultList();

    PendingReview pendingReview = (PendingReview) pendingReviewList.get(0);

    return pendingReview;
  }

  @Override
  public PendingReview addPendingReview(PendingReview pendingReview) {
    Session session = this.sessionFactory.getCurrentSession();
    session.persist(pendingReview);
    return pendingReview;
  }

  @Override
  public boolean deletePendingReview(long reviewId) {
    Session session = this.sessionFactory.getCurrentSession();
    Object persistentIns = session.load(PendingReview.class, reviewId);
    if (persistentIns != null) {
      session.delete(persistentIns);
      return true;
    }
    return false;
  }
}
