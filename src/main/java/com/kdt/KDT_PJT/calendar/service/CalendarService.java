package com.kdt.KDT_PJT.calendar.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.calendar.dto.CalendarDetailResponseDTO;
import com.kdt.KDT_PJT.calendar.dto.CalendarRequestDTO;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CalendarService {
    @Autowired
    CmmnDao dao; //공용 DAO

    @Transactional
    public CalendarDetailResponseDTO createCalendar(@AuthenticationPrincipal AuthCustomUserDetails me, CalendarRequestDTO req) {

        // 1) 기본 유효성
        if (req.getEventBgngDt() == null || req.getEventEndDt() == null
                || !req.getEventEndDt().isAfter(req.getEventBgngDt())) {
            throw new IllegalArgumentException("이벤트 종료는 시작 이후여야 합니다.");
        }
        if (req.getPrvtYn() == null) throw new IllegalArgumentException("prvtYn 필요 (1:개인, 0:공식)");

        // 2) 개인/공식 분기 + 권한 & cohort 결정
        Integer cohortSnFinal;
        if (req.getPrvtYn() == 1) { // 개인 일정
            cohortSnFinal = me.getCohortId().intValue();                 // 프론트 미전달
        } else { // 공식 일정
            if (me.getRoleType() > 3) { // 권한 번호 4부터는 공식일정 등록 못함
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "권한이 없습니다.");
            }
            cohortSnFinal = req.getCohortSn();
            if (cohortSnFinal == null) {
                throw new IllegalArgumentException("공식일정은 cohortSn이 필요합니다.");
            }
        }

        // 3) DTO -> CmmnMap 평탄화 + 서버 주입
        CmmnMap m = new CmmnMap();
        m.put("COHORT_SN",     cohortSnFinal);
        m.put("EVENT_BGNG_DT", req.getEventBgngDt());
        m.put("EVENT_END_DT",  req.getEventEndDt());
        m.put("EVENT_NM",      req.getEventNm());
        m.put("RMRK_CN",       req.getRmrkCn());
        m.put("DEL_YN",        (byte) 0);
        m.put("USER_SN",       me.getId());                   // 등록자(항상 서버에서)
        m.put("PRVT_YN",       req.getPrvtYn());
        m.put("EVENT_REG_DT",  LocalDateTime.now());          // << 서버에서 세팅

        // 4) INSERT (PK 반환)
        dao.insert("com.kdt.mapper.calendar.saveCalendar", m);
        Integer calSn = (Integer) m.get("CAL_SN");

        // 5) 재조회 없이 응답 구성 (지금 m에 값 다 있으니 그대로 사용)
        return CalendarDetailResponseDTO.builder()
                .calSn(calSn)
                .cohortSn((Integer) m.get("COHORT_SN"))
                .eventBgngDt((LocalDateTime) m.get("EVENT_BGNG_DT"))
                .eventEndDt((LocalDateTime) m.get("EVENT_END_DT"))
                .eventNm((String) m.get("EVENT_NM"))
                .rmrkCn((String) m.get("RMRK_CN"))
                .userSn((Integer) m.get("USER_SN"))
                .eventRegDt((LocalDateTime) m.get("EVENT_REG_DT"))
                .prvtYn((Byte) m.get("PRVT_YN"))
                .build();
    }

}
