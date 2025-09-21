package com.kdt.KDT_PJT.attend.service;

import com.kdt.KDT_PJT.attend.entity.Attend;
import com.kdt.KDT_PJT.attend.entity.AttendDtlTypeNm;
import com.kdt.KDT_PJT.attend.entity.DailyAttendTot;
import com.kdt.KDT_PJT.attend.repository.AttendRepository;
import com.kdt.KDT_PJT.attend.repository.DailyAttendTotRepository;
import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class DailyAttendTotService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
    private final UserRepository userRepository;
    private final AttendRepository attendRepository;
    private final DailyAttendTotRepository dailyAttendTotRepository;
    private final CohortRepository cohortRepository;

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

    // 퇴실 찍을 때, 학생의 출결 상태 바뀌는 함수
    @Transactional
    public void updateDailyAttendTot(Long userSn, Long cohortSn, LocalDateTime time) throws IllegalStateException {
        Optional<DailyAttendTot> stdDaily = dailyAttendTotRepository.findByUserSnAndCohortSnAndDate(userSn, cohortSn, time.toLocalDate());

        Optional<Cohort> cohort = cohortRepository.findById(cohortSn);
        Cohort c = cohort.orElseThrow(() -> new IllegalStateException("cohort not found: " + cohortSn));

        // 입퇴실 시간 없을때 기본값 + 조퇴 기준 시간
        LocalTime defaultStartTm = LocalTime.of(8, 30);
        LocalTime defaultEndTm = LocalTime.of(17, 30);
        LocalTime defaultEarlyLeaveTm = LocalTime.of(12, 30);

        // 입퇴실 시간 있을때 + 최소 할당량 시간
        LocalTime attendStartTm =
                cohort.get().getAttendStartTm() != null
                        ? cohort.get().getAttendStartTm() : defaultStartTm;
        LocalTime attendEndTm =
                cohort.get().getAttendEndTm() != null
                        ? cohort.get().getAttendEndTm() : defaultEndTm;
        Duration fullDay = Duration.between(attendStartTm, attendEndTm);


        // 금일 데이터 갖고 오기 위한 변수
            LocalDate date = time.toLocalDate();
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end   = start.plusDays(1);

        // 첫 입실(LocalTime)
            LocalTime checkIn = attendRepository
                    .findByUserSnAndInoutYnAndAttendTmBetween(userSn, true, start, end)
                    .map(a -> a.getAttendTm().toLocalTime())
                    .orElse(null);
        
        //  마지막 퇴실(LocalTime)
            LocalTime checkOut = attendRepository
                    .findByUserSnAndInoutYnAndAttendTmBetween(userSn, false, start, end)
                    .map(a -> a.getAttendTm().toLocalTime())
                    .orElse(null);

        if (checkIn == null) throw new IllegalStateException("입실 시간이 없음");
        // 입퇴실이 null이 아닐때
        if (checkOut != null) {
            Duration work = Duration.between(checkIn, checkOut);
            Duration halfDay = fullDay.dividedBy(2); // fullDay = Duration.between(attendStartTm, attendEndTm)

            // 절반 이상일 때만 판정
            if (work.compareTo(halfDay) >= 0) {

                // 정시 포함 (checkIn <= attendStartTm)
                if (!checkIn.isAfter(attendStartTm)) {

                    // 조퇴
                    if (!checkOut.isBefore(defaultEarlyLeaveTm) && checkOut.isBefore(attendEndTm)) {
                        stdDaily.ifPresent(std -> {
                            std.updateAttendDtlType(AttendDtlTypeNm.EARLY_LEAVE);
                            // dailyAttendTotRepository.save(std); // @Transactional이면 생략
                        });
                    } else {
                        // 출석
                        if (!checkOut.isBefore(attendEndTm)) {
                            stdDaily.ifPresent(std -> {
                                std.updateAttendDtlType(AttendDtlTypeNm.PRESENT);
                            });
                        }
                    }

                } else {
                    // 지각 (지각 + 조퇴는 결석 유지)
                    if (!checkOut.isBefore(attendEndTm)) {
                        stdDaily.ifPresent(std -> {
                            std.updateAttendDtlType(AttendDtlTypeNm.LATE);
                        });
                    }
                }
            }
        }
    }
}
