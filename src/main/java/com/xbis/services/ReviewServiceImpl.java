package com.xbis.services;

import com.xbis.daos.ReviewDAO;
import com.xbis.models.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service("reviewService")
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    ReviewDAO reviewDAO;

    @Override
    @Transactional
    public List<Review> getAllReviewerReviews(long reviewerId) {
        return reviewDAO.getAllReviewerReviews(reviewerId);
    }

    @Override
    @Transactional
    public List<Review> getAllUserReviews(long userId) {
        return reviewDAO.getAllUserReviews(userId);
    }

    @Override
    @Transactional
    public Review getReview(long reviewId) {
        return reviewDAO.getReview(reviewId);
    }

    @Override
    @Transactional
    public Review addReview(Review review) {
        return reviewDAO.addReview(review);
    }

    @Override
    @Transactional
    public boolean deleteReview(long reviewId) {
        return reviewDAO.deleteReview(reviewId);
    }
}
