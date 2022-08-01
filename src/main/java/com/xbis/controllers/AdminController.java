package com.xbis.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xbis.models.ConfToken;
import com.xbis.models.User;
import com.xbis.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

  @Autowired
  UserService userService;

  @RequestMapping(value = "/getAllUsers", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public String getAllUsers() throws IOException {
    List <User> userList = userService.getAllUsers();
    ObjectMapper mapper = new ObjectMapper();

    String list = mapper.writeValueAsString(userList);

    return list;
  }

  @RequestMapping(value = "/deleteUser", method = RequestMethod.DELETE,
      produces = {"application/json"})
  @ResponseBody
  public ConfToken deleteUser(@RequestParam("id") long id) {
    ConfToken confToken = new ConfToken();
    confToken.setSuccess(userService.deleteUser(id));
    return confToken;
  }

  @RequestMapping(value = "/updateAccess", method = RequestMethod.PUT)
  public ConfToken updateAccess(@RequestParam("id") long id, @RequestParam("level") int level) {
    ConfToken confToken = new ConfToken();
    User user = userService.getUser(id);
    userService.updateAccessLevel(user, level);
    confToken.setSuccess(true);
    return confToken;
  }
}
