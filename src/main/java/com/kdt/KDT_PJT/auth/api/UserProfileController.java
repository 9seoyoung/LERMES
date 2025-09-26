package com.kdt.KDT_PJT.auth.api;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.auth.dto.ApiResponse;
import com.kdt.KDT_PJT.auth.dto.mypage.UserProfileResponse;
import com.kdt.KDT_PJT.auth.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user-profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse> getUserProfile(
            @AuthenticationPrincipal AuthCustomUserDetails me) {

        UserProfileResponse profile = userProfileService.getProfile(me);

        ApiResponse response = ApiResponse.builder()
                .ok(true)
                .message("유저 프로필 조회")
                .data(profile)
                .build();

        return ResponseEntity.ok(response);
    }
}
