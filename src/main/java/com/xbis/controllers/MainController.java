package com.xbis.controllers;

import com.xbis.models.User;
import com.xbis.services.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class MainController {

    @Autowired
    UserService userService;

    @RequestMapping(value = {"", "/", "/index"})
    public String index(){
        return "index";
    }

    @RequestMapping(value = "/newUser", method = RequestMethod.POST)
    public String newUser(@ModelAttribute("user") User user){
        userService.addUser(user);
        return "redirect:/index";
    }

    @RequestMapping(value = "/deleteUser", method = RequestMethod.DELETE)
    public String delete(@ModelAttribute("user") User user){
        userService.deleteUser(user.getUserid());
        return "redirect:/index";
    }

}
