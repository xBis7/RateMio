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
  public List<PendingReview> getAllReviewedPendingReviews(long reviewedId) {
    return pendingReviewDAO.getAllReviewedPendingReviews(reviewedId);
  }

  @Override
  @Transactional
  public List<PendingReview> getAllReviewerPendingReviews(long reviewerId) {
    return pendingReviewDAO.getAllReviewerPendingReviews(reviewerId);
  }

  @Override
  @Transactional
  public List<PendingReview> getAllActivityPendingReviews(long activityId) {
    return pendingReviewDAO.getAllActivityPendingReviews(activityId);
  }

  @Override
  @Transactional
  public PendingReview getPendingReview(long reviewId) {
    return pendingReviewDAO.getPendingReview(reviewId);
  }

  @Override
  @Transactional
  public PendingReview getPendingReviewEntry(long reviewerId, long reviewedId, long activityId) {
    return pendingReviewDAO.getPendingReviewEntry(reviewerId, reviewedId, activityId);
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
