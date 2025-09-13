package com.kdt.KDT_PJT.auth.api;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.auth.dto.*;
import com.kdt.KDT_PJT.auth.service.LandingService;
import com.kdt.KDT_PJT.auth.service.SignupService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final LandingService landingService;
    private final SignupService signupService;
    private final AuthenticationManager authenticationManager;

    // 인증코드 발송
    @PostMapping("/email/code")
    public ResponseEntity<ApiResponse> emailCode(@RequestBody  EmailCodeRequest req) {
        ApiResponse res = signupService.sendCodeIfEmailAvailable(req);
        return new ResponseEntity<>(res, res.isOk() ? HttpStatus.OK : HttpStatus.CONFLICT);
    }

    // 일반 회원가입
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signupGeneral(@RequestBody GeneralSignupDto dto) {
        ApiResponse res = signupService.registerGeneral(dto);
        return new ResponseEntity<>(res, res.isOk() ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    // 테넌트 회원가입
    @PostMapping("/signup/tenant")
    public ResponseEntity<ApiResponse> signupTenant(@RequestBody TenantSignupDto dto) {
        ApiResponse res = signupService.registerTenant(dto);
        return new ResponseEntity<>(res, res.isOk() ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequestDto dto,
                                             HttpServletRequest request) {

        String email = dto.getEmail() == null ? "" : dto.getEmail().trim().toLowerCase();
        String password = dto.getPassword() == null ? "" : dto.getPassword();

        if (email.isBlank() || password.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "이메일/비밀번호를 입력하세요.", null));
        }

        try {
            UsernamePasswordAuthenticationToken token =
                    new UsernamePasswordAuthenticationToken(email, password);

            Authentication auth = authenticationManager.authenticate(token); // 비번 검증 포함
            SecurityContextHolder.getContext().setAuthentication(auth);      // 인증 저장
            request.getSession(true);                                        // 세션 생성(JSESSIONID)

            AuthCustomUserDetails me = (AuthCustomUserDetails) auth.getPrincipal();
            String nextPath = landingService.buildNextPath(me);

            return ResponseEntity.ok(new ApiResponse(true, "로그인 성공", Map.of("path",nextPath)));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "아이디 또는 비밀번호가 올바르지 않습니다.", null));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal AuthCustomUserDetails me) {
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("ok", false, "message", "로그인 필요"));
        }


        Map<String, Object> data = Map.of(
                "USER_SN", me.getId(),                 // 사용자 PK
                "USER_NM", me.getName(),                  // 사용자 이름
                "USER_EML_ADDR",me.getEmail(),            // 사용자 이메일
                "USER_ACTVTN_YN", me.isEnabled(),        // 사용자 활성여부
                "USER_AUTHRT_SN", me.getRoleType(),       // 사용자 권한 번호
                "USER_TELNO", me.getUserTelno(),          // 사용자 전화번호
                "USER_OGDP_CO_SN", me.getCompanyId(),     // 소속 회사 PK(외래키)
                "USER_COHORT_SN", me.getCohortId()        // 사용자 기수 PK(외래키)
        );

        return ResponseEntity.ok(Map.of("ok", true, "data", data));
    }
}
