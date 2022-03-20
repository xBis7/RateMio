package com.xbis.services;

import com.xbis.models.Review;

import java.util.List;

public interface ReviewService {

    public List<Review> getAllReviewerReviews(long reviewerId);

    public List<Review> getAllUserReviews(long userId);

    public Review getReview(long reviewId);

    public Review addReview(Review review);

    public boolean deleteReview(long reviewId);
}
