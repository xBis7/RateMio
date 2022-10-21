package com.xbis.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xbis.models.User;
import com.xbis.models.Activity;
import com.xbis.models.PendingReview;
import com.xbis.models.Review;
import com.xbis.models.ConfToken;
import com.xbis.models.ActivityMember;
import com.xbis.optimization.Optimizing;
import com.xbis.optimization.TeamModel;
import com.xbis.services.UserService;
import com.xbis.services.ActivityService;
import com.xbis.services.ReviewService;
import com.xbis.services.ActivityMemberService;
import com.xbis.services.PendingReviewService;
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
public class ActivityController {

  @Autowired
  UserService userService;

  @Autowired
  ActivityService activityService;

  @Autowired
  ReviewService reviewService;

  @Autowired
  ActivityMemberService activityMemberService;

  @Autowired
  PendingReviewService pendingReviewService;

  @RequestMapping(value = "/activities/new", method = RequestMethod.POST,
      consumes = {"application/json"},
      produces = {"application/json"})
  @ResponseBody
  public ConfToken newActivity(@RequestParam("ownerid") long id,
                               @RequestParam("name") String name) {
    ConfToken confToken = new ConfToken(false);
    Activity activity = new Activity();
    User user = userService.getUser(id);
    activity.setUser(user);
    activity.setActivityName(name);
    activity.setMemberNum(1);
    activity.setTeamNum(0);

    //add user to ActivityMembers table
    ActivityMember activityMember = new ActivityMember();

    activityMember.setActivity(activity);
    activityMember.setUser(user);

    activityService.addActivity(activity);
    activityMemberService.addActivityMember(activityMember);

    confToken.setSuccess(true);
    return confToken;
  }

  /**
   * @return a list with only one element
   */
  @RequestMapping(value = "/activities/{activityid}", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getActivity(@PathVariable("activityid") long id)
      throws JsonProcessingException {
    List<Activity> activityList = activityService.getActivity(id);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(activityList);

    return list;
  }

  @RequestMapping(value = "/users/{userid}/activities", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllUserActivities(@PathVariable("userid") long id)
      throws JsonProcessingException {
    List<Activity> activityList = activityService.getAllUserActivities(id);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(activityList);

    return list;
  }

  @RequestMapping(value = "/activities/{activityid}/users", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllActivityUsers(@RequestParam("ownerid") long ownerid,
                                    @PathVariable("activityid") long activityid)
      throws JsonProcessingException {
    List<User> userList = activityService.getAllActivityUsers(ownerid, activityid);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(userList);

    return list;
  }

  @RequestMapping(value = "/activities/{activityid}", method = RequestMethod.DELETE,
      produces = {"application/json"})
  @ResponseBody
  public ConfToken deleteActivity(@PathVariable("activityid") long activityid) {
    ConfToken confToken = new ConfToken(false);

    activityService.deleteActivity(activityid);

    confToken.setSuccess(true);
    return confToken;
  }

  @RequestMapping(value = "/activityMembers/new", method = RequestMethod.POST,
      consumes = {"application/json"},
      produces = {"application/json"})
  @ResponseBody
  public ConfToken addActivityMember(@RequestParam("userid") long userid,
                                     @RequestParam("activityid") long activityid) {
    ConfToken confToken = new ConfToken(false);

    User user = userService.getUser(userid);
    Activity activity = activityService.getActivityObject(activityid);

    ActivityMember activityMember = new ActivityMember();
    activityMember.setActivity(activity);
    activityMember.setUser(user);

    activityMemberService.addActivityMember(activityMember);

    //update activity member num
    activityService.updateMemberNum(activity, (activity.getMemberNum() + 1));

    confToken.setSuccess(true);
    return confToken;
  }

  @RequestMapping(value = "/activities/{activityid}/activityMembers/{userid}",
      method = RequestMethod.DELETE,
      produces = {"application/json"})
  @ResponseBody
  public ConfToken removeActivityMember(@PathVariable("userid") long userid,
                                        @PathVariable("activityid") long activityid) {
    ConfToken confToken = new ConfToken(false);

    Activity activity = activityService.getActivityObject(activityid);
    confToken.setSuccess(activityMemberService.removeMember(userid, activityid));

    //update activity member num
    activityService.updateMemberNum(activity, (activity.getMemberNum() - 1));

    return confToken;
  }

  @RequestMapping(value = "/activities/{activityid}/activityNonMembers",
      method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllUsersNonAdminNonMember(@PathVariable("activityid") long activityId)
      throws JsonProcessingException {
    List<User> userList = activityService.getAllUsersNonAdminNonMember(activityId);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(userList);

    return list;
  }

  @RequestMapping(value = "/pendingReviews/new", method = RequestMethod.POST,
      consumes = {"application/json"},
      produces = {"application/json"})
  @ResponseBody
  public ConfToken newPendingReviewRequest(@RequestParam("reviewerid") long reviewerid,
                                           @RequestParam("reviewedid") long reviewedid,
                                           @RequestParam("activityid") long activityid) {
    ConfToken confToken = new ConfToken(false);

    PendingReview pendingReview = new PendingReview();
    User reviewer = userService.getUser(reviewerid);
    User reviewed = userService.getUser(reviewedid);
    Activity activity = activityService.getActivityObject(activityid);

    pendingReview.setReviewer(reviewer);
    pendingReview.setReviewed(reviewed);
    pendingReview.setActivity(activity);

    pendingReviewService.addPendingReview(pendingReview);

    confToken.setSuccess(true);
    return confToken;
  }

  @RequestMapping(value = "/activities/{activityid}/matchmaking", method = RequestMethod.GET)
  @ResponseBody
  public String matchmaking(@PathVariable("activityid") long activityid)
      throws JsonProcessingException {

    Activity activity = activityService.getActivityObject(activityid);
    int playerNum = activity.getMemberNum()-1;
    List<Review> reviewList = reviewService.getAllActivityReviewsToObjects(activityid);

    Optimizing optimizing = new Optimizing(playerNum, reviewList);
    List<TeamModel> teamModelList = optimizing.initOptimization();

    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(teamModelList);

    return list;
  }
}
