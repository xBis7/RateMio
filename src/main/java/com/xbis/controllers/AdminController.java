package com.xbis.controllers;

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
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

  @Autowired
  UserService userService;

  @RequestMapping(value = "/getAllUsers", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public List<User> getAllUsers() {
    List <User> userList = userService.getAllUsers();
    return userList;
  }

  @RequestMapping(value = "/deleteUser", method = RequestMethod.DELETE)
  public ConfToken deleteUser(@RequestParam("id") long id) {
    ConfToken confToken = new ConfToken();
    confToken.setSuccess(userService.deleteUser(id));
    return confToken;
  }
}
