package com.kdt.KDT_PJT.auth.api;

import com.kdt.KDT_PJT.attend.dto.SimpleResponse;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.auth.dto.ApiResponse;
import com.kdt.KDT_PJT.auth.dto.mypage.UpdateUserProfileRequest;
import com.kdt.KDT_PJT.auth.dto.mypage.UserProfileResponse;
import com.kdt.KDT_PJT.auth.service.UserProfileService;
import com.kdt.KDT_PJT.file.dto.UploadResultDTO;
import com.kdt.KDT_PJT.file.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user-profile")
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final FileService fileService;

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

    @PostMapping("/info")
    public SimpleResponse updateInfo(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @RequestBody UpdateUserProfileRequest req
    ) {
        Long userSn = me.getId();

        userProfileService.updateInfo(userSn, req.getUserEmlAddr(), req.getUserTelno(), req.getUserProfileImage());

        return SimpleResponse.builder()
                .ok(true)
                .message("프로필 수정 완료")
                .data(Map.of(
                        "email", req.getUserEmlAddr() != null ? req.getUserEmlAddr() : "",
                        "phoneNumber", req.getUserTelno() != null ? req.getUserTelno() : "",
                        "fileSn", req.getUserProfileImage() != null ? req.getUserProfileImage() : 0L
                ))
                .build();
    }

}
