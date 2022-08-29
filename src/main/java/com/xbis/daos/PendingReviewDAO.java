package com.xbis.daos;

import com.xbis.models.PendingReview;

import java.util.List;

public interface PendingReviewDAO {

  public List<PendingReview> getAllPendingReviews();

  public List<PendingReview> getAllReviewedPendingReviews(long reviewedId);

  public List<PendingReview> getAllReviewerPendingReviews(long reviewerId);

  public List<PendingReview> getAllActivityReviews(long activityId);

  public PendingReview getPendingReview(long reviewId);

  public PendingReview getPendingReviewEntry(long reviewerId, long reviewedId, long activityId);

  public PendingReview addPendingReview(PendingReview pendingReview);

  public boolean deletePendingReview(long reviewId);
}
