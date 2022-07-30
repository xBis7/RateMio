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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class MainController {

  @Autowired
  UserService userService;

  @RequestMapping(value = {"", "/", "/home"}, method = RequestMethod.GET)
  public String index(){
    return "index";
  }

  @RequestMapping(value= "/userAuth", method = RequestMethod.POST,
      consumes = {"application/json"},
      produces = {"application/json"})
  @ResponseBody
  public AuthToken authentication(@RequestBody User user) {

    boolean userExists = userService.checkUser(user.getUsername(), user.getPassword());
    AuthToken authToken;

    if (userExists) {
      List<User> activeUserList = userService.getActiveUserList();
      User activeUser = activeUserList.get(activeUserList.size()-1);

      authToken = new AuthToken(activeUser.getUsername(),
          activeUser.getEmail(), activeUser.getAccessLevel());
    } else {
      authToken = new AuthToken(null, null, 0);
    }

    return authToken;
  }

  @RequestMapping(value = "/getUser", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public User getUser(@RequestParam("id") long id) {
    User user = userService.getUser(id);
    return user;
  }

  @RequestMapping(value = "/newUser", method = RequestMethod.POST,
      consumes = {"application/json"},
      produces = {"application/json"})
  @ResponseBody
  public User newUser(@RequestBody User user) {
    userService.addUser(user);
    return user;
  }

  @RequestMapping(value="/logout", method = RequestMethod.GET)
  public String logout() {
    userService.userLogout();
    return "redirect:/home";
  }

}
