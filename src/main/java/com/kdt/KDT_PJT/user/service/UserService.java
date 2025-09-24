package com.kdt.KDT_PJT.user.service;


import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("userUserService")
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setName(updatedUser.getName());
            user.setPassword(updatedUser.getPassword());
            user.setEmail(updatedUser.getEmail());
            user.setEnabled(updatedUser.isEnabled());
            user.setRoleType(updatedUser.getRoleType());
            user.setUserTelno(updatedUser.getUserTelno());
            user.setCompanySn(updatedUser.getCompanySn());
            user.setCohortSn(updatedUser.getCohortSn());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }


    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}

