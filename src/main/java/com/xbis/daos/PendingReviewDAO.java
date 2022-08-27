package com.xbis.daos;

import com.xbis.models.PendingReview;

import java.util.List;

public interface PendingReviewDAO {

  public List<PendingReview> getAllPendingReviews();

  public List<PendingReview> getAllReviewedReviews(long reviewedId);

  public List<PendingReview> getAllReviewerReviews(long reviewerId);

  public List<PendingReview> getAllActivityReviews(long activityId);

  public PendingReview getPendingReview(long reviewId);

  public PendingReview addPendingReview(PendingReview pendingReview);

  public boolean deletePendingReview(long reviewId);
}
