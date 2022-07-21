package com.xbis.controllers;

import com.xbis.models.User;
import com.xbis.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainController {

    @Autowired
    UserService userService;

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = {"", "/", "/index"}, method = RequestMethod.GET)
    public String index(){
        return "index";
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
        return "login";
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public String register() {
        return "register";
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/newUser", method = RequestMethod.POST)
    public String newUser(@ModelAttribute("user") User user){
        userService.addUser(user);
        return "redirect:/login";
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @RequestMapping(value = "/deleteUser", method = RequestMethod.DELETE)
    public String delete(@ModelAttribute("user") User user){
        userService.deleteUser(user.getUserid());
        return "redirect:/index";
    }

}
