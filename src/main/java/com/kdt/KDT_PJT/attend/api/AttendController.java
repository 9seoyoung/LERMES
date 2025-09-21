package com.kdt.KDT_PJT.attend.api;

import com.kdt.KDT_PJT.attend.dto.*;
import com.kdt.KDT_PJT.attend.service.AttendService;
import com.kdt.KDT_PJT.attend.service.DailyAttendTotService;
import com.kdt.KDT_PJT.attend.support.ClientIpResolver;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attend")
@RequiredArgsConstructor
public class AttendController {

    private final AttendService attendService;
    private final DailyAttendTotService dailyAttendTotService;

    /**
     * 강사: 출석코드 생성
     */
    @PostMapping("/code")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<SimpleResponse> createCode(
            @RequestBody CreateAttendCodeRequest req,
            HttpServletRequest http,
            Authentication auth
    ) {
        String requesterIp = ClientIpResolver.resolve(http);
        String raw = attendService.createCode(req, requesterIp, auth); // 평문 생성
        String code = attendService.peekActiveCode(auth).orElse(null); // 현재 활성 코드(표시용)

        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(true)
                        .message("코드 생성 완료 " + raw)
                        .data(Map.of("code", code))
                        .build()
        );
    }

    /**
     * 현재 활성 코드 조회(학생/강사 공용)
     */
    @GetMapping("/code")
    @PreAuthorize("hasAnyRole('INSTRUCTOR','STUDENT')")
    public ResponseEntity<SimpleResponse> getActiveCode(Authentication auth) {
        String code = attendService.peekActiveCode(auth).orElse(null);
        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(true)
                        .message(null)
                        .data(Map.of("code", code))
                        .build()
        );
    }

    /**
     * 학생: 코드 제출 → 출석 처리
     */
    @PostMapping("/checkin")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CheckinResponse> checkin(
            @RequestBody SubmitAttendRequest req,
            HttpServletRequest http,
            Authentication auth
    ) {
        String clientIp = ClientIpResolver.resolve(http);
        CheckinResponse checkinResponse = attendService.checkin(req, clientIp, auth);
        return ResponseEntity.ok(checkinResponse);
    }

    /**
     * 학생: 퇴실 처리 (코드 불필요)
     */
    @PostMapping("/checkout")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CheckoutResponse> checkout(Authentication auth) {
        CheckoutResponse checkoutResponse = attendService.checkout(auth);
        return ResponseEntity.ok(checkoutResponse);
    }

    /**
     * 학생: 오늘 입/퇴실 시각 조회
     */
    @GetMapping("/status/today")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<AttendTodayResponse> getTodayStatus(Authentication auth) {
        AttendTodayResponse todayStatus = attendService.getTodayStatus(auth);
        return ResponseEntity.ok(todayStatus);
    }

    /**
     * 강사: 출석코드 강제 만료
     */
    @DeleteMapping("/code")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<SimpleResponse> invalidateCode(
            @AuthenticationPrincipal AuthCustomUserDetails me
    ) {
        attendService.invalidateCode(me.getCohortSn()); // ★ cohort 기준으로 통일
        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(true)
                        .message("코드 삭제 완료")
                        .build()
        );
    }

    @GetMapping("/today/list")
    public ResponseEntity<SimpleResponse> getTodayStudentAttendance(Authentication auth) {
        List<StudentAttendanceDto> attendanceList = attendService.getTodayStudentAttendance(auth);

        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(true)
                        .message("오늘 출결 현황")
                        .data(attendanceList)
                        .build()
        );


    }

    /** 단위기간 별 출결 조회 (학생 마이페이지) */
    @GetMapping("/summary")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SimpleResponse> getMonthlySummary(
            @AuthenticationPrincipal AuthCustomUserDetails me
    ) {
        AttendSummaryDto dto = dailyAttendTotService.getMonthlySummary(me.getId());
        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(Boolean.TRUE)
                        .message("이번 달 출석 요약")
                        .data(dto)
                        .build()
        );
    }

    /** 기수별 결석 조회 (관리자용) */
    @GetMapping("/absence/by-cohort/today")
    public ResponseEntity<SimpleResponse> getTodayAbsenceByCohort(
            @AuthenticationPrincipal AuthCustomUserDetails me
    ) {
        List<CohortAbsenceRowDto> rows =
                dailyAttendTotService.getTodayAbsenceByCohortUsingAttendLogs(me.getCompanySn());
        return ResponseEntity.ok(
                SimpleResponse.builder()
                        .ok(Boolean.TRUE)
                        .message("오늘 교육 과정별 결석 현황")
                        .data(rows)
                        .build()
        );
    }
}
