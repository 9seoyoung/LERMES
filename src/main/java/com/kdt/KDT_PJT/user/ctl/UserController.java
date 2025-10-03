package com.kdt.KDT_PJT.user.ctl;


import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.user.Dto.UserDto;
import com.kdt.KDT_PJT.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return ResponseEntity.ok(userService.updateUser(id, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

        // 1. 회사Sn + 코호트Sn + 권한
        @GetMapping("/by-company-cohort-role")
        public ResponseEntity<List<UserDto>> getUsersByCompanyCohortAndRole(
                @RequestParam Long ogdpCoSn,
                @RequestParam Long ogdpCohortSn,
                @RequestParam Long userAuthrtSn
        ) {
            List<UserDto> users = userService.findUsersByCompanyCohortAndRole(ogdpCoSn, ogdpCohortSn, userAuthrtSn);
            return ResponseEntity.ok(users);
        }

        // 2. 회사Sn + 권한
        @GetMapping("/by-company-role")
        public ResponseEntity<List<UserDto>> getUsersByCompanyAndRole(
                @RequestParam Long ogdpCoSn,
                @RequestParam Long userAuthrtSn
        ) {
            List<UserDto> users = userService.findUsersByCompanyAndRole(ogdpCoSn, userAuthrtSn);
            return ResponseEntity.ok(users);
        }
    }

