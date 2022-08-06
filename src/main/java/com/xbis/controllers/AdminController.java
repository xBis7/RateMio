package com.xbis.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xbis.models.ConfToken;
import com.xbis.models.Request;
import com.xbis.models.ResponseRequest;
import com.xbis.models.User;
import com.xbis.services.RequestService;
import com.xbis.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

  @Autowired
  UserService userService;

  @Autowired
  RequestService requestService;

  @RequestMapping(value = "/getAllUsers", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllUsers(@RequestParam("id") long currentUserId)
      throws IOException {
    List <User> userList = userService.getAllUsers(currentUserId);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(userList);

    return list;
  }

  @RequestMapping(value = "/getAllRequests", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllRequests() throws IOException {
    List <ResponseRequest> requestList = requestService.getAllRequests();
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(requestList);

    return list;
  }

  @RequestMapping(value = "/deleteUser", method = RequestMethod.DELETE,
      produces = {"application/json"})
  @ResponseBody
  public ConfToken deleteUser(@RequestParam("id") long id) {
    boolean success = userService.deleteUser(id);
    ConfToken confToken = new ConfToken(success);
    return confToken;
  }

  @RequestMapping(value = "/deleteRequest", method = RequestMethod.DELETE,
      produces = {"application/json"})
  @ResponseBody
  public ConfToken deleteRequest(@RequestParam("id") long id) {
    boolean success = requestService.deleteRequest(id);
    ConfToken confToken = new ConfToken(success);
    return confToken;
  }

  @RequestMapping(value = "/updateAccess", method = RequestMethod.PUT,
      produces = {"application/json"})
  @ResponseBody
  public ConfToken updateAccess(@RequestParam("id") long id,
                                @RequestParam("level") int level) {
    ConfToken confToken = new ConfToken(false);
    User user = userService.getUser(id);
    userService.updateAccessLevel(user, level);
    confToken.setSuccess(true);
    return confToken;
  }
}
