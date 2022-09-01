package com.xbis.daos;

import com.xbis.models.Review;
import org.hibernate.query.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ReviewDAOImpl implements ReviewDAO {

  @Autowired
  private SessionFactory sessionFactory;

  public void setSessionFactory(SessionFactory sessionFactory){
    this.sessionFactory = sessionFactory;
  }

  public Session getSession() {
    return sessionFactory.openSession();
  }

  @Override
  public List<Review> getAllReviewerReviews(long reviewerId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT r.reviewer.username, r.reviewed.username, r.activity.activityname, " +
        "r.communication, r.productivity, r.efficiency, r.openness, r.balance " +
        "FROM Review r WHERE r.reviewer.userid = :reviewerid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("reviewerid", reviewerId);
    List <Review> list = query.getResultList();
    return list;
  }

  @Override
  public List<Review> getAllUserReviews(long userId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT r FROM Review r WHERE r.userid = :userid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("userid", userId);
    List <Review> list = query.getResultList();
    return list;
  }

  @Override
  public List<Review> getAllActivityReviews(long activityid) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "SELECT r.reviewid, r.reviewer.userid, r.reviewer.username, r.reviewed.userid, " +
        "r.reviewed.username, r.activity.activityname, r.communication, r.productivity, " +
        "r.efficiency, r.openness, r.balance FROM Review r WHERE r.activity.activityid = :activityid";
    Query query = session.createQuery(sqlQuery);
    query.setParameter("activityid", activityid);
    List <Review> list = query.getResultList();
    return list;
  }

  @Override
  public Review getReview(long reviewId) {
    Session session = this.sessionFactory.getCurrentSession();
    Review review = (Review) session.get(Review.class, reviewId);
    return review;
  }

  @Override
  public Review addReview(Review review) {
    Session session = this.sessionFactory.getCurrentSession();
    session.persist(review);
    return review;
  }

  @Override
  public boolean deleteReview(long reviewId) {
    Session session = this.sessionFactory.getCurrentSession();
    Object persistentIns = session.load(Review.class, reviewId);
    if(persistentIns != null){
      session.delete(persistentIns);
      return true;
    }
    return false;
  }
}
