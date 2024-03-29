package com.xbis.controllers;

import com.xbis.models.AuthToken;
import com.xbis.models.User;
import com.xbis.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

  @Autowired
  UserService userService;

  @RequestMapping(value= "/users/userAuth", method = RequestMethod.POST,
      consumes = {"application/json"},
      produces = {"application/json"})
  @ResponseBody
  public AuthToken authentication(@RequestBody User user) {

    boolean userExists = userService.checkUser(user.getUsername(), user.getPassword());
    AuthToken authToken;

    if (userExists) {
      List<User> activeUserList = userService.getActiveUserList();
      User activeUser = activeUserList.get(activeUserList.size()-1);

      authToken = new AuthToken(activeUser.getUserid(), activeUser.getUsername(),
          activeUser.getEmail(), activeUser.getAccessLevel());
    } else {
      authToken = new AuthToken(0, null, null, 0);
    }

    return authToken;
  }

  @RequestMapping(value = "/users/new", method = RequestMethod.POST,
      consumes = {"application/json"},
      produces = {"application/json"})
  @ResponseBody
  public User newUser(@RequestBody User user) {
    userService.addUser(user);
    return user;
  }
}
