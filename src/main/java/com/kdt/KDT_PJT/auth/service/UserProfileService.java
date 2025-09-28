package com.kdt.KDT_PJT.auth.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.auth.dto.mypage.UserProfileResponse;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final CohortRepository cohortRepository;
    private final UserRepository userRepository;

    public UserProfileResponse getProfile(AuthCustomUserDetails me) {
        User user = userRepository.findById(me.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저 없음 UserProfileService 파일임"));

        Cohort cohort = cohortRepository.findById(me.getCohortSn())
                .orElseThrow(() -> new IllegalArgumentException("기수 없음 UserProfileService 파일임"));

        String status = user.isEnabled() ? "활성" : "비활성";

        return UserProfileResponse.builder()
                .name(user.getName())
                .status(status)
                .phoneNumber(user.getUserTelno())
                .email(user.getEmail())
                .cohortName(cohort.getCohortNm())   // 소속 그룹명
                .courseName(cohort.getCrclmNm())    // 과정명
                .userProfileImage(user.getUserProfileImage())
                .build();
    }

    @Transactional
    public void updateInfo(Long userSn, String email, String phoneNumber, Long fileSn) {
        User user = userRepository.findById(userSn)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));

        if (email != null) user.setEmail(email);
        if (phoneNumber != null) user.setUserTelno(phoneNumber);
        user.setUserProfileImage(fileSn); // null이면 DB에서 컬럼 null로 업데이트

        userRepository.save(user);
    }
}
