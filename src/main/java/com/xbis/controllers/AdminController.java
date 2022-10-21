package com.xbis.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xbis.models.ConfToken;
import com.xbis.models.Request;
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
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

  @Autowired
  UserService userService;

  @Autowired
  RequestService requestService;

  @RequestMapping(value = "/users/id!={id}", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllUsers(@PathVariable("id") long currentUserId)
      throws JsonProcessingException {
    List <User> userList = userService.getAllUsers(currentUserId);
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(userList);

    return list;
  }

  @RequestMapping(value = "/requests/access", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllAccessRequests() throws JsonProcessingException {
    List <Request> requestList = requestService.getAllAccessRequests();
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(requestList);

    return list;
  }

  @RequestMapping(value = "/users/{id}", method = RequestMethod.DELETE,
      produces = {"application/json"})
  @ResponseBody
  public ConfToken deleteUser(@PathVariable("id") long id) {
    boolean success = userService.deleteUser(id);
    ConfToken confToken = new ConfToken(success);
    return confToken;
  }

  @RequestMapping(value = "/requests/access/{id}", method = RequestMethod.DELETE,
      produces = {"application/json"})
  @ResponseBody
  public ConfToken deleteRequest(@PathVariable("id") long id) {
    boolean success = requestService.deleteRequest(id);
    ConfToken confToken = new ConfToken(success);
    return confToken;
  }

  @RequestMapping(value = "/users/{id}/access", method = RequestMethod.PUT,
      produces = {"application/json"})
  @ResponseBody
  public ConfToken updateAccess(@PathVariable("id") long id,
                                @RequestParam("level") int level) {
    ConfToken confToken = new ConfToken(false);
    User user = userService.getUser(id);
    userService.updateAccessLevel(user, level);
    confToken.setSuccess(true);
    return confToken;
  }
}
