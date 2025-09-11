package com.kdt.KDT_PJT.auth.service;

import com.kdt.KDT_PJT.auth.dto.ApiResponse;
import com.kdt.KDT_PJT.auth.dto.EmailCodeRequest;
import com.kdt.KDT_PJT.auth.dto.GeneralSignupDto;
import com.kdt.KDT_PJT.auth.dto.TenantSignupDto;
import com.kdt.KDT_PJT.auth.entity.EnrollmentStatus;
import com.kdt.KDT_PJT.auth.entity.InhoUserEntity;
import com.kdt.KDT_PJT.auth.entity.UserRoleType;
import com.kdt.KDT_PJT.auth.repository.InhoUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SignupService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final InhoUserRepository inhoUserRepository;
    private final EmailService emailService;
    private final VerificationService verificationService;

    // 0) 인증 버튼: (1) 중복 체크 → (2) 미존재 시 코드 발송
    public ApiResponse sendCodeIfEmailAvailable(EmailCodeRequest req) {
        String email = req.getEmail().trim().toLowerCase();

        if (inhoUserRepository.existsByEmail(email)) {
            return new ApiResponse(false, "이미 가입된 이메일입니다.", null);
        }

        String code = emailService.sendVerificationCode(email);
        verificationService.saveCode(email, code);
        return new ApiResponse(true, "인증코드를 발송했습니다.", verificationService.ttlSeconds());
    }

    // 1) 일반 회원가입
    @Transactional
    public ApiResponse registerGeneral(GeneralSignupDto dto) {
        String email = dto.getEmail().trim().toLowerCase();

        // 1) 이메일 중복
        if (inhoUserRepository.existsByEmail(email)) {
            return new ApiResponse(false, "이미 가입된 이메일입니다.", null);
        }
        // 2) 비밀번호 확인
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            return new ApiResponse(false, "비밀번호가 일치하지 않습니다.", null);
        }
        // 3) 인증코드 검증
        if (!verificationService.verify(email,
                dto.getVerificationCode() == null ? "" : dto.getVerificationCode().trim())) {
            return new ApiResponse(false, "이메일 인증 실패", null);
        }

        InhoUserEntity user = new InhoUserEntityBuilder()
                .name(dto.getUsername())
                .email(email)
                .encodedPw(bCryptPasswordEncoder.encode(dto.getPassword()))
                .role(UserRoleType.GENERAL)     // 일반 회원
                .enabled(true)
                .status(EnrollmentStatus.PENDING) // 초기값(원하면 변경)
                .build();

        inhoUserRepository.save(user);
        return new ApiResponse(true, "회원가입 완료", null);
    }

    // 2) 테넌트 회원가입 (회사 생성은 이후 단계에서 처리한다고 가정, 여기선 관리자 계정만 생성)
    @Transactional
    public ApiResponse registerTenant(TenantSignupDto dto) {
        String email = dto.getEmail().trim().toLowerCase();

        if (inhoUserRepository.existsByEmail(email)) {
            return new ApiResponse(false, "이미 가입된 이메일입니다.", null);
        }
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            return new ApiResponse(false, "비밀번호가 일치하지 않습니다.", null);
        }if (!verificationService.verify(email,
                dto.getVerificationCode() == null ? "" : dto.getVerificationCode().trim())) {
            return new ApiResponse(false, "이메일 인증 실패", null);
        }

        InhoUserEntity user = new InhoUserEntityBuilder()
                .name(dto.getUsername())
                .email(email)
                .encodedPw(bCryptPasswordEncoder.encode(dto.getPassword()))
                .role(UserRoleType.TENANT) // 테넌트 관리자
                .enabled(true)
                .status(EnrollmentStatus.COMPLETED)
                .build();

        inhoUserRepository.save(user);
        return new ApiResponse(true, "테넌트 관리자 등록 완료", null);
    }

    /** 간단한 빌더 (엔티티가 롬복/생성자 없어서 세터 없이 만들기 위함) */
    private static class InhoUserEntityBuilder {
        private final InhoUserEntity u = new InhoUserEntity();

        public InhoUserEntityBuilder name(String v){ set("name", v); return this; }
        public InhoUserEntityBuilder email(String v){ set("email", v); return this; }
        public InhoUserEntityBuilder encodedPw(String v){ set("password", v); return this; }
        public InhoUserEntityBuilder role(UserRoleType v){ set("roleType", v); return this; }
        public InhoUserEntityBuilder enabled(boolean v){ set("enabled", v); return this; }
        public InhoUserEntityBuilder status(EnrollmentStatus v){ set("status", v); return this; }

        private void set(String field, Object value) {
            try {
                var f = InhoUserEntity.class.getDeclaredField(field);
                f.setAccessible(true);
                f.set(u, value);
            } catch (Exception e) { throw new IllegalStateException(e); }
        }
        public InhoUserEntity build(){ return u; }
    }
}
