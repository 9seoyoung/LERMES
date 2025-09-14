package com.kdt.KDT_PJT.attend.api;

import com.kdt.KDT_PJT.attend.dto.CreateAttendCodeRequest;
import com.kdt.KDT_PJT.attend.dto.SubmitAttendRequest;
import com.kdt.KDT_PJT.attend.dto.SimpleResponse;
import com.kdt.KDT_PJT.attend.service.AttendService;
import com.kdt.KDT_PJT.attend.support.ClientIpResolver;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attend")
@RequiredArgsConstructor
public class AttendController {

    private final AttendService attendService;

    /** 강사: 출석코드 생성 (TTL 5~15분, allowedIp 없으면 요청자의 공인IP 사용) */
    @PostMapping("/code")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<SimpleResponse> createCode(
            @RequestBody CreateAttendCodeRequest req,
            HttpServletRequest http,
            Authentication auth
    ) {
        String requesterIp = ClientIpResolver.resolve(http);
        String raw = attendService.createCode(req, requesterIp, auth); // 테스트 편의상 평문 코드 반환
        return ResponseEntity.ok(SimpleResponse.builder()
                .ok(true)
                .message("코드 생성 완료: " + raw) // 실서비스에선 평문 노출 제거 권장
                .build());
    }

    /** 학생: 코드 제출 → 출석 처리 */
    @PostMapping("/checkin")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SimpleResponse> checkin(
            @RequestBody SubmitAttendRequest req,
            HttpServletRequest http,
            Authentication auth
    ) {
        String clientIp = ClientIpResolver.resolve(http);
        attendService.checkin(req, clientIp, auth);
        return ResponseEntity.ok(SimpleResponse.builder()
                .ok(true)
                .message("출석 완료")
                .build());
    }
}
