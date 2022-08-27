package com.xbis.services;

import com.xbis.daos.PendingReviewDAO;
import com.xbis.models.PendingReview;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service("pendingReviewService")
public class PendingReviewServiceImpl implements PendingReviewService {

  @Autowired
  PendingReviewDAO pendingReviewDAO;

  @Override
  @Transactional
  public List<PendingReview> getAllPendingReviews() {
    return pendingReviewDAO.getAllPendingReviews();
  }

  @Override
  @Transactional
  public List<PendingReview> getAllReviewedReviews(long reviewedId) {
    return pendingReviewDAO.getAllReviewedReviews(reviewedId);
  }

  @Override
  @Transactional
  public List<PendingReview> getAllReviewerReviews(long reviewerId) {
    return pendingReviewDAO.getAllReviewerReviews(reviewerId);
  }

  @Override
  @Transactional
  public List<PendingReview> getAllActivityReviews(long activityId) {
    return pendingReviewDAO.getAllActivityReviews(activityId);
  }

  @Override
  @Transactional
  public PendingReview getPendingReview(long reviewId) {
    return pendingReviewDAO.getPendingReview(reviewId);
  }

  @Override
  @Transactional
  public PendingReview addPendingReview(PendingReview pendingReview) {
    return pendingReviewDAO.addPendingReview(pendingReview);
  }

  @Override
  @Transactional
  public boolean deletePendingReview(long reviewId) {
    return pendingReviewDAO.deletePendingReview(reviewId);
  }
}
