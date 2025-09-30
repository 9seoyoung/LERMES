package com.kdt.KDT_PJT.auth.api;

import com.kdt.KDT_PJT.auth.dto.mypage.UserProfileResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user-profile")
public class UserProfileController {
//
//    @GetMapping
//    public ResponseEntity<UserProfileResponse> getUserProfile() {
//
//    }
}
