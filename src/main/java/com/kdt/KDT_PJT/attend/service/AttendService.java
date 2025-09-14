package com.kdt.KDT_PJT.attend.service;

import com.kdt.KDT_PJT.attend.dto.CreateAttendCodeRequest;
import com.kdt.KDT_PJT.attend.dto.SubmitAttendRequest;
import com.kdt.KDT_PJT.attend.entity.Attend;
import com.kdt.KDT_PJT.attend.repository.AttendRepository;
import com.kdt.KDT_PJT.attend.support.CodeStore;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigInteger;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AttendService {

    private final CodeStore codeStore;                 // 메모리 캐시
    private final PasswordEncoder passwordEncoder;     // BCrypt
    private final AttendRepository attendRepository;

    @PersistenceContext
    private EntityManager em;                          // 네이티브 쿼리

    private static final int DEFAULT_TTL = 10;

    private String codeKey(Long coSn) {
        return "attend:code:co:" + coSn;
    }

    /** 강사 코드 생성 */
    public String createCode(CreateAttendCodeRequest req, String requesterIp, Authentication auth) {
        if (req.getCode() == null || req.getCode().isBlank()) {
            throw new IllegalArgumentException("code는 필수입니다.");
        }
        int ttl = (req.getTtlMinutes() == null) ? DEFAULT_TTL : req.getTtlMinutes();
        if (ttl < 5 || ttl > 15) throw new IllegalArgumentException("TTL은 5~15분");

        AuthCustomUserDetails me = requirePrincipal(auth);
        Long coSn = requireNonNull(me.getCompanyId(), "로그인 정보에 회사 번호가 없습니다.");

        String allowedIp = (req.getAllowedIp() == null || req.getAllowedIp().isBlank())
                ? requesterIp
                : req.getAllowedIp();

        String hashed = passwordEncoder.encode(req.getCode());
        codeStore.put(codeKey(coSn), hashed, allowedIp, ttl);

        // 테스트 편의: 평문 코드 반환 (운영에서는 제거 권장)
        return req.getCode();
    }

    /** 학생 출석 처리 */
    @Transactional
    public void checkin(SubmitAttendRequest req, String clientIp, Authentication auth) {
        if (req.getCode() == null || req.getCode().isBlank()) {
            throw new IllegalArgumentException("code는 필수입니다.");
        }

        AuthCustomUserDetails me = requirePrincipal(auth);
        Long userSn = requireNonNull(me.getId(), "로그인 정보에 사용자 번호가 없습니다.");
        Long coSn   = requireNonNull(me.getCompanyId(), "로그인 정보에 회사 번호가 없습니다.");

        CodeStore.CodeData data = codeStore.get(codeKey(coSn))
                .orElseThrow(() -> new IllegalStateException("유효한 출석코드가 없습니다."));

        if (!clientIp.equals(data.allowedIp())) {
            throw new IllegalStateException("허용되지 않은 네트워크(IP)입니다.");
        }
        if (!passwordEncoder.matches(req.getCode(), data.hashedCode())) {
            throw new IllegalArgumentException("코드가 일치하지 않습니다.");
        }

        // 오늘 이미 출석했는지 확인 (네이티브)
        if (existsToday(userSn)) {
            throw new IllegalStateException("오늘 이미 출석 처리되었습니다.");
        }

        Attend att = Attend.builder()
                .userSn(userSn)
                .coSn(coSn)
                .attendTm(LocalDateTime.now())
                .inoutYn(true)
                .build();
        attendRepository.save(att);
    }

    /** 오늘 출석 존재 여부 (네이티브) */
    private boolean existsToday(Long userSn) {
        Object r = em.createNativeQuery("""
                SELECT EXISTS(
                  SELECT 1
                  FROM TB_ATTEND
                  WHERE USER_SN = ?1
                    AND DATE(ATTEND_TM) = CURRENT_DATE
                    AND INOUT_YN = 1
                  LIMIT 1
                )
                """)
                .setParameter(1, userSn)
                .getSingleResult();

        if (r instanceof BigInteger bi) return bi.intValue() == 1;
        if (r instanceof Number n)     return n.intValue() == 1;
        return Boolean.TRUE.equals(r);
    }

    /** principal 필수/타입 보장 */
    private AuthCustomUserDetails requirePrincipal(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()
                || !(auth.getPrincipal() instanceof AuthCustomUserDetails p)) {
            throw new IllegalStateException("로그인 필요");
        }
        return p;
    }

    private static Long requireNonNull(Long v, String msg) {
        if (v == null) throw new IllegalStateException(msg);
        return v;
    }
}
