package com.kdt.KDT_PJT.attend.service;

import com.kdt.KDT_PJT.attend.dto.CheckinResponse;
import com.kdt.KDT_PJT.attend.dto.CheckoutResponse;
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
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AttendService {

    private final CodeStore codeStore;                 // 메모리 캐시
    private final PasswordEncoder passwordEncoder;     // BCrypt
    private final AttendRepository attendRepository;

    @PersistenceContext
    private EntityManager em;                          // 네이티브 쿼리

    private static final int DEFAULT_TTL = 480;

    private String codeKey(Long coSn) {
        return "attend:code:co:" + coSn;
    }

    /** 강사 코드 생성 */
    public String createCode(CreateAttendCodeRequest req, String requesterIp, Authentication auth) {
        if (req.getCode() == null || req.getCode().isBlank()) {
            throw new IllegalArgumentException("code는 필수입니다.");
        }
        int ttl = DEFAULT_TTL;

        AuthCustomUserDetails me = requirePrincipal(auth);
        Long coSn = requireNonNull(me.getCompanyId(), "로그인 정보에 회사 번호가 없습니다.");
        Long cohortSn = requireNonNull(me.getCohortId(), "로그인 정보에 기수 번호가 없습니다.");

        String allowedIp = (req.getAllowedIp() == null || req.getAllowedIp().isBlank())
                ? requesterIp
                : req.getAllowedIp();

        String hashed = passwordEncoder.encode(req.getCode());
        codeStore.put(codeKey(cohortSn), hashed, allowedIp, ttl);

        return req.getCode(); // 테스트용 평문 반환
    }

    /** 학생 출석 처리 */
    @Transactional
    public CheckinResponse checkin(SubmitAttendRequest req, String clientIp, Authentication auth) {
        if (req.getCode() == null || req.getCode().isBlank()) {
            throw new IllegalArgumentException("code는 필수입니다.");
        }

        AuthCustomUserDetails me = requirePrincipal(auth);
        Long userSn = requireNonNull(me.getId(), "로그인 정보에 사용자 번호가 없습니다.");
        Long coSn   = requireNonNull(me.getCompanyId(), "로그인 정보에 회사 번호가 없습니다.");
        Long cohortSn = requireNonNull(me.getCohortId(), "로그인 정보에 기수 번호가 없습니다.");

        CodeStore.CodeData data = codeStore.get(codeKey(cohortSn))
                .orElseThrow(() -> new IllegalStateException("유효한 출석코드가 없습니다."));

        if (!clientIp.equals(data.allowedIp())) {
            throw new IllegalStateException("허용되지 않은 네트워크(IP)입니다.");
        }
        if (!passwordEncoder.matches(req.getCode(), data.hashedCode())) {
            throw new IllegalArgumentException("코드가 일치하지 않습니다.");
        }

        if (existsTodayByInout(userSn, true)) {
            throw new IllegalStateException("오늘 이미 출석 처리되었습니다.");
        }

        Attend att = Attend.builder()
                .userSn(userSn)
                .coSn(coSn)
                .cohortSn(cohortSn)
                .attendTm(LocalDateTime.now())
                .inoutYn(true) // 입실
                .build();
        attendRepository.save(att);

        return CheckinResponse.builder()
                .ok(true)
                .message("입실")
                .checkinTime(att.getAttendTm())
                .build();
    }

    /** 학생 퇴실 처리 (코드 불필요) */
    @Transactional
    public CheckoutResponse checkout(Authentication auth) {
        AuthCustomUserDetails me = requirePrincipal(auth);
        Long userSn = requireNonNull(me.getId(), "로그인 정보에 사용자 번호가 없습니다.");
        Long coSn   = requireNonNull(me.getCompanyId(), "로그인 정보에 회사 번호가 없습니다.");
        Long cohortSn = requireNonNull(me.getCohortId(), "로그인 정보에 기수 번호가 없습니다.");

        if (!existsTodayByInout(userSn, true)) {
            throw new IllegalStateException("오늘 입실 이력이 없습니다.");
        }
        if (existsTodayByInout(userSn, false)) {
            throw new IllegalStateException("오늘 이미 퇴실 처리되었습니다.");
        }

        Attend att = Attend.builder()
                .userSn(userSn)
                .coSn(coSn)
                .cohortSn(cohortSn)
                .attendTm(LocalDateTime.now())
                .inoutYn(false) // 퇴실 (DB = 0)
                .build();
        attendRepository.save(att);

        return CheckoutResponse.builder()
                .ok(true)
                .message("퇴실")
                .checkoutTime(att.getAttendTm())
                .build();
    }

    /** 오늘 특정 in/out 존재 여부 */
    private boolean existsTodayByInout(Long userSn, boolean inoutYn) {
        Object r = em.createNativeQuery("""
                SELECT EXISTS(
                  SELECT 1
                  FROM TB_ATTEND
                  WHERE USER_SN = ?1
                    AND DATE(ATTEND_TM) = CURRENT_DATE
                    AND INOUT_YN = ?2
                  LIMIT 1
                )
                """)
                .setParameter(1, userSn)
                .setParameter(2, inoutYn ? 1 : 0)
                .getSingleResult();

        if (r instanceof BigInteger bi) return bi.intValue() == 1;
        if (r instanceof Number n)     return n.intValue() == 1;
        return Boolean.TRUE.equals(r);
    }

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

    /** 출석코드 강제 만료 */
    public void invalidateCode(Long companyId) {
        codeStore.clear(codeKey(companyId));
    }
}
