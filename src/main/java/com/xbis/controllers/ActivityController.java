package com.xbis.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xbis.models.Activity;
import com.xbis.models.User;
import com.xbis.models.ActivityMember;
import com.xbis.models.ConfToken;
import com.xbis.services.ActivityMemberService;
import com.xbis.services.ActivityService;
import com.xbis.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ActivityController {

  @Autowired
  UserService userService;

  @Autowired
  ActivityService activityService;

  @Autowired
  ActivityMemberService activityMemberService;

  @RequestMapping(value = "/newActivity", method = RequestMethod.POST,
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
  @RequestMapping(value = "/getActivity", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getActivity(@RequestParam("activityid") long id)
      throws JsonProcessingException {
    List<Activity> activityList = activityService.getActivity(id);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(activityList);

    return list;
  }

  @RequestMapping(value = "/getAllUserActivities", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllUserActivities(@RequestParam("userid") long id)
      throws JsonProcessingException {
    List<Activity> activityList = activityService.getAllUserActivities(id);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(activityList);

    return list;
  }

  @RequestMapping(value = "/getAllActivityUsers", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllActivityUsers(@RequestParam("ownerid") long ownerid,
                                    @RequestParam("activityid") long activityid)
      throws JsonProcessingException {
    List<User> userList = activityService.getAllActivityUsers(ownerid, activityid);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(userList);

    return list;
  }
}
