package com.xbis.controllers;

import com.xbis.models.User;
import com.xbis.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@Controller
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
  public String authentication(@RequestBody User user, BindingResult result, Map model) {

    if (result.hasErrors()) {
      return "redirect:/login";
    }

    boolean userExists = userService.checkUser(user.getUsername(), user.getPassword());
    if (userExists) {
      model.put("userAuth", user);
      return "redirect:/loggedIn";
    } else {
      result.rejectValue("username","invaliduser");
      return "redirect:/login";
    }
  }

  @RequestMapping(value = "/getUser", method = RequestMethod.GET,
      produces = {"application/json"})
  @ResponseBody
  public User getUser(@RequestParam("id") long id) {
    User user = userService.getUser(id);
    return user;
  }

  @RequestMapping(value = "/newUser", method = RequestMethod.POST,
      consumes = {"application/json"})
  public String newUser(@RequestBody User user) {
    userService.addUser(user);
    return "redirect:/login";
  }

  @RequestMapping(value = "/deleteUser", method = RequestMethod.DELETE)
  public String delete(@ModelAttribute("user") User user) {
    userService.deleteUser(user.getUserId());
    return "redirect:/home";
  }

  @RequestMapping(value="/logout", method = RequestMethod.GET)
  public String logout() {
    userService.userLogout();
    return "redirect:/home";
  }

}
