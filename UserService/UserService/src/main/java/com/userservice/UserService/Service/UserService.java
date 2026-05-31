package com.userservice.UserService.Service;

import com.userservice.UserService.Model.User;
import com.userservice.UserService.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private UserRepository userRepository;
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public List<User> getUsers() {
        return userRepository.findAll();
    }
    public void addUser(User user) {
        userRepository.save(user);
    }
}
