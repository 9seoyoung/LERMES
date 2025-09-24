package com.kdt.KDT_PJT.attend.service;

import com.kdt.KDT_PJT.attend.dto.AttendSummaryDto;
import com.kdt.KDT_PJT.attend.dto.CohortAbsenceRowDto;
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
import java.util.*;


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

    @Transactional(readOnly = true)
    public AttendSummaryDto getMonthlySummary(Long userSn) {
        LocalDate today = LocalDate.now(ZONE);
        LocalDate start = today.withDayOfMonth(1);
        LocalDate end = today.withDayOfMonth(today.lengthOfMonth());

        Long present = dailyAttendTotRepository
                .countByUserSnAndDateBetweenAndAttendDtlTypeNm(userSn, start, end, AttendDtlTypeNm.PRESENT);

        Long absent = dailyAttendTotRepository
                .countByUserSnAndDateBetweenAndAttendDtlTypeNmIn(
                        userSn, start, end,
                        List.of(
                                AttendDtlTypeNm.ABSENT,
                                AttendDtlTypeNm.VACATION,
                                AttendDtlTypeNm.SICK_LEAVE,
                                AttendDtlTypeNm.OFFICIAL_LEAVE
                        )
                );

        Long lateEarlyOut = dailyAttendTotRepository
                .countByUserSnAndDateBetweenAndAttendDtlTypeNmIn(
                        userSn, start, end,
                        List.of(AttendDtlTypeNm.LATE, AttendDtlTypeNm.EARLY_LEAVE)
                );

        Long requiredDays = Long.valueOf(end.getDayOfMonth()); // 우선 달력 일수

        return AttendSummaryDto.builder()
                .period(start.toString() + " ~ " + end.toString())
                .present(present)
                .lateEarlyOut(lateEarlyOut)
                .absent(absent)
                .requiredDays(requiredDays)
                .build();
    }

    // com.kdt.KDT_PJT.attend.service.DailyAttendTotService (혹은 AttendService)
    @Transactional(readOnly = true)
    public List<CohortAbsenceRowDto> getTodayAbsenceByCohortUsingAttendLogs(Long companySn) {
        LocalDate today = LocalDate.now(ZONE);
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end   = start.plusDays(1);

        // 활성 학생 전체(기존 함수 사용)
        List<User> users = userRepository.findByEnabledTrueAndCompanySnIsNotNullAndCohortSnIsNotNull();

        // 회사 필터 → 코호트별 총원 계산
        Map<Long, Long> totalByCohort = new HashMap<>();
        for (User u : users) {
            if (!companySn.equals(u.getCompanySn())) continue;
            Long cohortSn = u.getCohortSn();
            if (cohortSn == null) continue;
            totalByCohort.put(cohortSn, totalByCohort.getOrDefault(cohortSn, 0L) + 1);
        }

        // 코호트 이름 맵 (있으면)
        Map<Long, String> labelByCohort = new HashMap<>();
        List<Cohort> cohorts = cohortRepository.findAll(); // 없으면 생략 가능
        for (Cohort c : cohorts) {
            if (!companySn.equals(c.getCoSn())) continue;
            labelByCohort.put(c.getCohortSn(), c.getCohortNm()); // "10기" 같은 표시용
        }

        // 오늘 체크인한 사람(=present 후보) 카운트
        Map<Long, Long> checkedInByCohort = new HashMap<>();
        for (User u : users) {
            if (!companySn.equals(u.getCompanySn())) continue;
            Long cohortSn = u.getCohortSn();
            if (cohortSn == null) continue;

            // ★ 기존 함수 재사용 (Optional 로 체크)
            boolean hasCheckIn = attendRepository
                    .findByUserSnAndInoutYnAndAttendTmBetween(u.getId(), true, start, end)
                    .isPresent();

            if (hasCheckIn) {
                checkedInByCohort.put(cohortSn, checkedInByCohort.getOrDefault(cohortSn, 0L) + 1);
            }
        }

        // 응답 조립 (총원 - 체크인자 = 결석)
        List<CohortAbsenceRowDto> rows = new ArrayList<>();
        for (Map.Entry<Long, Long> e : totalByCohort.entrySet()) {
            Long cohortSn = e.getKey();
            Long total    = e.getValue();
            Long in       = checkedInByCohort.getOrDefault(cohortSn, 0L);
            Long absent   = Math.max(0L, total - in);
            rows.add(CohortAbsenceRowDto.builder()
                    .cohortSn(cohortSn)
                    .label(labelByCohort.getOrDefault(cohortSn, cohortSn + "기"))
                            .absent(absent)
                            .build());
        }
        // 라벨/코호트 순 정렬(선택)
        rows.sort(Comparator.comparing(CohortAbsenceRowDto::getCohortSn));
        return rows;
    }

}
