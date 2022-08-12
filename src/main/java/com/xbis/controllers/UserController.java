package com.xbis.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xbis.models.ConfToken;
import com.xbis.models.Request;
import com.xbis.models.User;
import com.xbis.services.UserService;
import com.xbis.services.RequestService;

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
public class UserController {

  @Autowired
  UserService userService;

  @Autowired
  RequestService requestService;

  @RequestMapping(value = "/getUser", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public User getUser(@RequestParam("id") long id) {
    User user = userService.getUser(id);
    return user;
  }

  @RequestMapping(value = "/newAccessRequest", method = RequestMethod.POST,
      consumes = {"application/json"},
      produces = {"application/json"})
  @ResponseBody
  public ConfToken newAccessRequest(@RequestParam("id") long id,
                                    @RequestParam("reqType") String type) {
    Request request = new Request();
    ConfToken confToken = new ConfToken(false);
    User user = userService.getUser(id);
    request.setUser(user);
    request.setReqType(type);
    requestService.addRequest(request);
    confToken.setSuccess(true);
    return confToken;
  }
}
