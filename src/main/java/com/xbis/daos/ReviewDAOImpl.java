package com.xbis.daos;

import com.xbis.models.Activity;
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
    String sqlQuery = "select * from reviews where reviews.reviewerid = ?0;";
    Query query = session.createQuery(sqlQuery);
    query.setParameter(0, reviewerId);
    List <Review> list = query.getResultList();
    return list;
  }

  @Override
  public List<Review> getAllUserReviews(long userId) {
    Session session = this.sessionFactory.getCurrentSession();
    String sqlQuery = "select * from reviews where reviews.userid = ?0;";
    Query query = session.createQuery(sqlQuery);
    query.setParameter(0, userId);
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
