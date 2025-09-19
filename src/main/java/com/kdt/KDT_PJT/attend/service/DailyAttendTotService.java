package com.kdt.KDT_PJT.attend.service;

import com.kdt.KDT_PJT.attend.entity.AttendDtlTypeNm;
import com.kdt.KDT_PJT.attend.entity.DailyAttendTot;
import com.kdt.KDT_PJT.attend.repository.DailyAttendTotRepository;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyAttendTotService {

    private final UserRepository userRepository;
    private final DailyAttendTotRepository dailyAttendTotRepository;

    // 매일 새벽: 모든 학생 기본값 결석 처리
    @Transactional
    public void seedAbsent(LocalDate date) {
        List<User> users = userRepository.findByEnabledTrueAndCompanySnIsNotNullAndCohortSnIsNotNull();

        List<User> students = new ArrayList<>();

        for (User user : users) {
            if (user.getRoleType() == 5) {
                students.add(user);
            }
        }

        for (User student : students) {
            if (!dailyAttendTotRepository.existsByDateAndUserSn(date, student.getId())) {
                DailyAttendTot row = DailyAttendTot.builder()
                        .date(date)
                        .userSn(student.getId())
                        .companySn(student.getCompanySn())
                        .cohortSn(student.getCohortSn() != null ? student.getCohortSn() : 0L)
                        .attendDtlTypeNm(AttendDtlTypeNm.ABSENT)
                        .build();
                dailyAttendTotRepository.save(row);
            }
        }
    }

    // 퇴실
    @Transactional
    public void recompute(LocalDate date) {
    }
}
