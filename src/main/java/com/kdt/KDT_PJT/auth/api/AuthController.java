package com.kdt.KDT_PJT.auth.api;

import com.kdt.KDT_PJT.auth.dto.*;
import com.kdt.KDT_PJT.auth.service.SignupService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final SignupService signupService;
    private final AuthenticationManager authenticationManager;

    // 인증코드 발송
    @PostMapping(value = {"/email/code", "/email/code/"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> emailCode(@RequestBody  EmailCodeRequest req) {
        ApiResponse res = signupService.sendCodeIfEmailAvailable(req);
        return new ResponseEntity<>(res, res.isOk() ? HttpStatus.OK : HttpStatus.CONFLICT);
    }

    // 일반 회원가입
    @PostMapping(value = {"/signup", "/signup/"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> signupGeneral(@RequestBody GeneralSignupDto dto) {
        ApiResponse res = signupService.registerGeneral(dto);
        return new ResponseEntity<>(res, res.isOk() ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    // 테넌트 회원가입
    @PostMapping(value = {"/signup/tenant", "/signup/tenant/"}, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse> signupTenant(@RequestBody TenantSignupDto dto) {
        ApiResponse res = signupService.registerTenant(dto);
        return new ResponseEntity<>(res, res.isOk() ? HttpStatus.OK : HttpStatus.BAD_REQUEST);
    }

    @PostMapping(value = {"/login", "/login/"}, consumes = MediaType.APPLICATION_JSON_VALUE)
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

            return ResponseEntity.ok(new ApiResponse(true, "로그인 성공", null));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "아이디 또는 비밀번호가 올바르지 않습니다.", null));
        }
    }
}
