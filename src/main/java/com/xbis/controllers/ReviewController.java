package com.xbis.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xbis.models.*;
import com.xbis.services.ActivityService;
import com.xbis.services.PendingReviewService;
import com.xbis.services.ReviewService;
import com.xbis.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

  @RequestMapping(value = "/getAllReviewerPendingReviews", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllReviewerPendingReviews(@RequestParam("reviewerid") long reviewerid)
      throws JsonProcessingException {
    List<PendingReview> pendingReviewList = pendingReviewService.getAllReviewerReviews(reviewerid);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(pendingReviewList);

    return list;
  }

  @RequestMapping(value = "/newReview", method = RequestMethod.POST,
      produces = {"application/json"})
  @ResponseBody
  public ConfToken newReview(@RequestParam("reviewerId") long reviewerid, @RequestParam("reviewedId") long reviewedid,
                             @RequestParam("activityId") long activityid, @RequestParam("communication") int communication,
                             @RequestParam("productivity") int productivity, @RequestParam("efficiency") int efficiency,
                             @RequestParam("openness") int openness, @RequestParam("balance") int balance) {
    ConfToken confToken = new ConfToken(false);

    User reviewer = userService.getUser(reviewerid);
    User reviewed = userService.getUser(reviewedid);
    Activity activity = activityService.getActivityObject(activityid);
    Review review = new Review();

    review.setReviewer(reviewer);
    review.setReviewed(reviewed);
    review.setActivity(activity);
    review.setCommunication(communication);
    review.setProductivity(productivity);
    review.setEfficiency(efficiency);
    review.setOpenness(openness);
    review.setBalance(balance);

    reviewService.addReview(review);

    confToken.setSuccess(true);
    return confToken;
  }
}
