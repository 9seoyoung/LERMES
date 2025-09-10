package com.kdt.KDT_PJT.auth.service;

import com.kdt.KDT_PJT.auth.dto.ApiResponse;
import com.kdt.KDT_PJT.auth.dto.EmailCodeRequest;
import com.kdt.KDT_PJT.auth.repository.InhoUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JoinService {
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final InhoUserRepository inhoUserRepository;
    private final EmailService emailService;
    private final VerificationService verificationService;

    // 인증 버튼: (1) 중복 체크 → (2) 미존재 시 코드 발송
    public ApiResponse sendCodeIfEmailAvailable(EmailCodeRequest req) {
        String email = req.getEmail().trim().toLowerCase();

        if (inhoUserRepository.existsByEmail(email)) {
            return new ApiResponse(false, "이미 가입된 이메일입니다.", null);
        }

        String code = emailService.sendVerificationCode(email);
        verificationService.saveCode(email, code);
        return new ApiResponse(true, "인증코드를 발송했습니다.", verificationService.ttlSeconds());
    }
}
