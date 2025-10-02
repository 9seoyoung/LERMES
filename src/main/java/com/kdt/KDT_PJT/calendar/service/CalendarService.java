package com.kdt.KDT_PJT.calendar.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.calendar.dto.*;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarService {
    @Autowired
    CmmnDao dao; //공용 DAO

    @Transactional
    public CalendarDetailResponseDTO createCalendar(AuthCustomUserDetails me, CalendarRequestDTO req) {

        // 0) 인증 확인
        if (me == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
        }

        req.buildDateTime(); // 테이블 저장용 시간 만들어냄, 현재 시각도 이때 넣음.
        // 1) 기본 유효성
        if (req.getEventBgngDt() == null || req.getEventEndDt() == null
                || !req.getEventEndDt().isAfter(req.getEventBgngDt())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이벤트 종료는 시작 이후여야 합니다.");
        }
        if (req.getPrvtYn() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "prvtYn 필요 (1:개인, 0:공식)");
        }

        // 2) 개인/공식 분기 + 권한 & cohort 결정
        Integer cohortSnFinal;
        if (req.getPrvtYn() == 1) { // 개인 일정
            Long userCohort = me.getCohortSn();     //로그인 유저의 기수SN 가져옴
            Long userRoleType = me.getRoleType();   //로그인 유저의 권한 가져옴
            //개인일정이며 학생/교사일 경우
            if (userRoleType <4 ){  // 관리자인경우(1,2,3)
                cohortSnFinal = null;
            } else                  // 4,5,6~~ (교사 이하 권한)
                if(userCohort == null){ //기수 없으면 등록 안됨
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "교사/학생인경우 개인일정 등록을 위해 사용자 cohort가 필요합니다.");
            } else{                     //기수 있으면 등록 ㄱㄴ
                    cohortSnFinal = userCohort.intValue();
                }
        } else { // 공식 일정
            if (me.getRoleType() > 3) { // 권한 번호 4부터는 공식일정 등록 못함
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "권한이 없습니다.");
            }
            cohortSnFinal = req.getCohortSn();
            if (cohortSnFinal == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "공식일정은 cohortSn이 필요합니다.");
            }
        }

        // 3) DTO -> CmmnMap 평탄화 + 서버 주입
//        CmmnMap m = new CmmnMap();
//        m.put("COHORT_SN",     cohortSnFinal);
//        m.put("EVENT_BGNG_DT", req.getEventBgngDt());
//        m.put("EVENT_END_DT",  req.getEventEndDt());
//        m.put("EVENT_NM",      req.getEventNm());
//        m.put("RMRK_CN",       req.getRmrkCn());
//        m.put("DEL_YN",        (byte) 0);
//        m.put("USER_SN",       me.getId());                   // 등록자(항상 서버에서)
//        m.put("PRVT_YN",       req.getPrvtYn());
//        m.put("EVENT_REG_DT",  LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS));          // << 서버에서 세팅
//        m.put("CO_SN",Math.toIntExact(me.getCompanySn())); // 해당유저 회사번호 가져옴

        req.setCohortSn(cohortSnFinal);
//        req.buildDateTime(); // 테이블 저장용 시간 만들어냄, 현재 시각도 이때 넣음.
        req.setUserSn(me.getId().intValue()); // 등록자
        req.setCoSn(me.getCompanySn().intValue());
        System.out.println("req : " + req);

        // 4) INSERT (PK 반환)
        try {
            dao.insert("com.kdt.mapper.calendar.saveCalendar", req);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "무결성 제약 위반: 입력값을 확인하세요.");
        }

        // calSn으로 detailResponseDTO 리턴해줘야겠음 -> 상세정보 이름 조인해서 조회해오는거
//        Integer calSn = Integer.parseInt(m.get("CAL_SN").toString());
        Integer calSn = req.getCalSn();
        return dao.selectOne("com.kdt.mapper.calendar.selectCalendarDetailByCalSn",calSn);

    }
    public List<CalendarSimpleResponseDTO> getCalendarForDay(CalendarSimpleResponseDTO params){
        return dao.selectList("selectSimpleByRange",params);
    }

    public List<CalendarSimpleResponseDTO> getCalendarForMonth(CalendarSimpleResponseDTO params){
        return dao.selectList("selectSimpleByRange",params);
    }

    /*
    * 일정 상세 보기
    * 조회수 +1 하면서 받아옴*/
    @Transactional
    public CalendarDetailResponseDTO getCalendarDetailByCalSn(Integer calSn){
        dao.update("com.kdt.mapper.calendar.incCalendarViewCnt",calSn);
        return dao.selectOne("com.kdt.mapper.calendar.selectCalendarDetailByCalSn",calSn);
    }

    public List<CalendarListResponseDTO> getCalendarList(CalendarSimpleResponseDTO params){
        return dao.selectList("com.kdt.mapper.calendar.getCalendarList",params);
    }

    /*
    * 업데이트*/
    @Transactional
    public CalendarDetailResponseDTO putCalendarDetailByCalSn(CalendarUpdateRequestDTO params){
        int u = dao.update("com.kdt.mapper.calendar.putCalendarDetailByCalSn",params);
        if(u!=0){
            System.out.println("성공~");
        }else{
            System.out.println("실패~");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "업뎃실패요");
        }
        Integer calSn = params.getCalSn();
        return dao.selectOne("com.kdt.mapper.calendar.selectCalendarDetailByCalSn",calSn);
    }

    /*
    * 삭제(soft)*/
    @Transactional
    public void deleteCalendarByCalSn(Integer calSn){
        int u = dao.update("com.kdt.mapper.calendar.deleteCalendarByCalSn",calSn);
        if(u!=0){
            System.out.println("성공~");
        }else{
            System.out.println("실패~");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "삭제실패임");
        }
    }



}
