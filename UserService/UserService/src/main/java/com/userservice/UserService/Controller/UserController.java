package com.userservice.UserService.Controller;

import com.userservice.UserService.Model.User;
import com.userservice.UserService.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserController {
    private UserService userService;
    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/user")
    public void addUser(@RequestBody User user){
        userService.addUser(user);
    }
    @GetMapping("/user")
    public List<User> getAllUsers(){
        return userService.getUsers();
    }
}
