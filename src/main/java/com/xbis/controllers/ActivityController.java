package com.xbis.controllers;

import com.xbis.models.*;
import com.xbis.services.ActivityMemberService;
import com.xbis.services.ActivityService;
import com.xbis.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    activity.setName(name);
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
}
