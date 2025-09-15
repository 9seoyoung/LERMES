package com.kdt.KDT_PJT.attend.api;

import com.kdt.KDT_PJT.attend.dto.*;
import com.kdt.KDT_PJT.attend.service.AttendService;
import com.kdt.KDT_PJT.attend.support.ClientIpResolver;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/attend")
@RequiredArgsConstructor
public class AttendController {

    private final AttendService attendService;

    /** 강사: 출석코드 생성 */
    @PostMapping("/code")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<SimpleResponse> createCode(
            @RequestBody CreateAttendCodeRequest req,
            HttpServletRequest http,
            Authentication auth
    ) {
        String requesterIp = ClientIpResolver.resolve(http);
        String raw = attendService.createCode(req, requesterIp, auth);
        return ResponseEntity.ok(SimpleResponse.builder()
                .ok(true)
                .message("코드 생성 완료 " + raw)
                .build());
    }

    /** 학생: 코드 제출 → 출석 처리 */
    @PostMapping("/checkin")
//    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CheckinResponse> checkin(
            @RequestBody SubmitAttendRequest req,
            HttpServletRequest http,
            Authentication auth
    ) {
        String clientIp = ClientIpResolver.resolve(http);
        CheckinResponse checkinResponse = attendService.checkin(req, clientIp, auth);
        return ResponseEntity.ok(checkinResponse);
    }

    /** 학생: 퇴실 처리 (코드 불필요) */
    @PostMapping("/checkout")
//    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<CheckoutResponse> checkout(
            Authentication auth
    ) {
        CheckoutResponse checkoutResponse = attendService.checkout(auth);
        return ResponseEntity.ok(checkoutResponse);
    }

    /** 강사: 출석코드 강제 만료 */
    @DeleteMapping("/code")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<?> invalidateCode(
            @AuthenticationPrincipal AuthCustomUserDetails me
    ) {
        attendService.invalidateCode(me.getCompanyId());
        return ResponseEntity.ok(SimpleResponse.builder()
                .ok(true)
                .message("코드 삭제 완료")
                .build());
    }
}
