package com.xbis.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xbis.models.User;
import com.xbis.models.PendingReview;
import com.xbis.models.Review;
import com.xbis.models.Activity;
import com.xbis.models.ConfToken;
import com.xbis.services.ActivityService;
import com.xbis.services.PendingReviewService;
import com.xbis.services.ReviewService;
import com.xbis.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

  @Autowired
  ReviewService reviewService;

  @Autowired
  UserService userService;

  @Autowired
  ActivityService activityService;

  @Autowired
  PendingReviewService pendingReviewService;

  @RequestMapping(value = "/users/{reviewerid}/pendingReviews", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllReviewerPendingReviews(@PathVariable("reviewerid") long reviewerid)
      throws JsonProcessingException {
    List<PendingReview> pendingReviewList = pendingReviewService.getAllReviewerPendingReviews(reviewerid);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(pendingReviewList);

    return list;
  }

  @RequestMapping(value = "/users/{reviewerid}/reviews", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllReviewerReviews(@PathVariable("reviewerid") long reviewerid)
      throws JsonProcessingException {
    List<Review> reviewList = reviewService.getAllReviewerReviews(reviewerid);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(reviewList);

    return list;
  }

  @RequestMapping(value = "/reviews/new", method = RequestMethod.POST,
      produces = {"application/json"})
  @ResponseBody
  public ConfToken newReview(@RequestParam("reviewerId") long reviewerid, @RequestParam("reviewedId") long reviewedid,
                             @RequestParam("activityId") long activityid, @RequestParam("quality") int quality,
                             @RequestParam("collaboration") int collaboration, @RequestParam("preference") String preference) {
    ConfToken confToken = new ConfToken(false);

    User reviewer = userService.getUser(reviewerid);
    User reviewed = userService.getUser(reviewedid);
    Activity activity = activityService.getActivityObject(activityid);
    Review review = new Review();

    review.setReviewer(reviewer);
    review.setReviewed(reviewed);
    review.setActivity(activity);
    review.setQuality(quality);
    review.setCollaboration(collaboration);
    review.setPreference(preference);

    reviewService.addReview(review);

    PendingReview pendingReview = pendingReviewService
        .getPendingReviewEntry(reviewerid, reviewedid, activityid);

    // remove PendingReview
    pendingReviewService.deletePendingReview(pendingReview.getReviewid());

    confToken.setSuccess(true);
    return confToken;
  }

  @RequestMapping(value = "/pendingReviews", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllPendingReviews() throws JsonProcessingException {
    List <PendingReview> pendingReviewList = pendingReviewService.getAllPendingReviews();
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(pendingReviewList);

    return list;
  }

  @RequestMapping(value = "/activities/{activityid}/pendingReviews", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getActivityPendingReviews(@PathVariable("activityid") long activityid)
      throws JsonProcessingException {
    List <PendingReview> pendingReviewList =
        pendingReviewService.getAllActivityPendingReviews(activityid);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(pendingReviewList);

    return list;
  }

  @RequestMapping(value = "/activities/{activityid}/reviews", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getActivityReviews(@PathVariable("activityid") long activityid)
      throws JsonProcessingException {
    List <Review> reviewList = reviewService.getAllActivityReviews(activityid);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(reviewList);

    return list;
  }
}
