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

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final CohortRepository cohortRepository;
    private final UserRepository userRepository;

    public UserProfileResponse getProfile(@AuthenticationPrincipal AuthCustomUserDetails me) {
        User user = userRepository.findById(me.getId())
                .orElseThrow(() -> new IllegalArgumentException("유저 없음 UserProfileService 파일임"));

        Cohort cohort = cohortRepository.findById(me.getCohortSn())
                .orElseThrow(() -> new IllegalArgumentException("기수 없음 UserProfileService 파일임"));

        String name = user.getName();
        String status = "비활성";
        if (user.isEnabled()) {
            status = "활성";
        }
        String phoneNumber = user.getUserTelno();
        String email = user.getEmail();
        String cohortNm = cohort.getCohortNm();
        String crclmNm = cohort.getCrclmNm();

        UserProfileResponse userProfileResponse = UserProfileResponse.builder()
                .name(name)
                .status(status)
                .phoneNumber(phoneNumber)
                .email(email)
                .cohortName(cohortNm)
                .courseName(crclmNm)
                .build();

        return userProfileResponse;
    }
}
