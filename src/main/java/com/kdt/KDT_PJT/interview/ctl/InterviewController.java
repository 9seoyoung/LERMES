package com.kdt.KDT_PJT.interview.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.calendar.service.CalendarService;
import com.kdt.KDT_PJT.cmmn.Enum.AuthEnums;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import com.kdt.KDT_PJT.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InterviewController {
    @Autowired
    CmmnDao dao;

    private final InterviewService interviewService;

    private final Logger log = LoggerFactory.getLogger(getClass());

    /**
     * @param me     : 로그인한 사용자 정보
     * @param params : 면담 신청 정보를 담고 있는 Map (예: 면담 제목, 내용, 면담 희망하는 계급 번호(관리자 or 강사) 등)
     * @return : 성공 여부 및 저장된 정보를 담은 Map
     * Description    : 면담을 신청하는 API. 로그인한 사용자의 정보를 자동으로 받아와 면담 신청인으로 처리합니다.
     * @methodName : applyInterview
     * @author : 김동식
     * @date : 2025.09.19
     */
    @PostMapping("/apply") //TODO 면담 신청 API 컨트롤러
    public ResponseEntity<CmmnMap> applyInterview(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @RequestBody CmmnMap params){

         // 처리후 결과 보낼거임
        CmmnMap resp= interviewService.createInterviewRequest(me, params);

        return ResponseEntity.ok(resp);
    }

    /**
     * 내 면담 요청 목록
     * - 강사(INSTRUCTOR=4): url에 cohortSn 없으면 본인 cohortSn 사용, 그것도 없으면 400
     * - 대표/직원(TENANT=2, EMPLOYEE=3): url에 cohortSn 필수
     */
    @PreAuthorize("hasAnyRole('TENANT_ADMIN','EMPLOYEE','INSTRUCTOR')") // 권한 체크
    @GetMapping({"/my-requests", "/my-requests/{cohortSn}"}) // 강사/대표/직원 공용
    public List<CmmnMap> getMyInterviewRequests(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @PathVariable(value = "cohortSn", required = false) Integer pathCohortSn,
            CmmnMap params) {

        if (me == null) { // 로그인 필요
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
        }

        if (params == null) { // Spring이 바인딩하지 못하는 경우 대비
            params = new CmmnMap();
        }

        final int roleType = Math.toIntExact(me.getRoleType()); // 2=대표,3=직원,4=강사
//        final int userSn   = Math.toIntExact(me.getId()); // 이거는 여기서는 필요없음

        Integer resolvedCohortSn = pathCohortSn;
        switch (roleType) {
            case 4: // 강사인 경우
                if (resolvedCohortSn == null) {
                    Long myCohort = me.getCohortSn();
                    if (myCohort == null) {
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "강사 계정의 기수 정보가 없습니다. 관리자에게 문의하세요.");
                    }
                    resolvedCohortSn = Math.toIntExact(myCohort);
                }
                break;
            case 2: // 대표인 경우
            case 3: // 직원인 경우
                if (resolvedCohortSn == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기수번호(cohortSn)를 입력하세요.");
                }
                break;
            default:
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "권한 없음");
        }
        // SQL 분기에 필요한 최소 파라미터만 전달 (Integer 타입 보장)
        params.put("roleType", roleType);
//        params.put("userSn",   userSn);
        params.put("cohortSn", resolvedCohortSn);

        List<CmmnMap> resp = interviewService.getMyInterviewRequests(params);
        log.debug("getMyInterviewRequests result rows={}", (resp != null ? resp.size() : 0));
        return resp;
    }

    @PutMapping("/confirm/{itvSn}") // 면담 확정
    public void confirmInterview(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @PathVariable("itvSn") Integer itvSn,
            @RequestBody CmmnMap params) {
        if (me == null) { // 로그인 필요
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
        } else if(params == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "내용 보내삼");
        }

        // 요청 파라미터 파싱
        final String itvDay  = (String) params.get("itvDay");   // "2025-09-22"
        final String itvTime = (String) params.get("itvTime");  // "09:00"
        final String itvPlc  = (String) params.get("itvPlc");   // 장소
        final String itvPicAns =(String)params.get("itvPicAns"); // 담당자 메시지

        if (itvDay == null || itvTime == null)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "itvDay, itvTime은 필수입니다.");

        // 날짜+시간 → LocalDateTime
        final LocalDate date;
        final LocalTime time;
        try {
            date = LocalDate.parse(itvDay);        // "yyyy-MM-dd"
            time = LocalTime.parse(itvTime);       // "HH:mm" or "HH:mm:ss"
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "날짜/시간 포맷이 잘못되었습니다. (예: 2025-09-22, 09:00)");
        }
        final LocalDateTime prnmntDt = LocalDateTime.of(date, time);

        params.put("itvPrnmntDt", prnmntDt);// MyBatis가 LocalDateTime→DATETIME 매핑
        params.put("itvPlc", itvPlc);
        params.put("itvPicAns", itvPicAns);  // url에 온거 map에 실어주기
        params.put("itvPicSn", Math.toIntExact(me.getId()) );

        params.put("itvSn",itvSn);
        int isUpdated = interviewService.confirmInterview(params); // 업데이트
        if (isUpdated == 1) {
            System.out.println("확정됨, 캘린더 일정 생성");
            System.out.println("params => "+params);
        }else{
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 확정되었거나 존재하지 않는 면담입니다.");
        }


        System.out.println("itvSn=" + params.get("itvSn"));
        System.out.println(params.get("itvSn").getClass().getName());
        CmmnMap m = new CmmnMap();
        m.put("itvSn",params.get("itvSn"));
        m = dao.selectOne("com.kdt.mapper.interview.selectInterviewParticipants",m);
        System.out.println("m = " + m);
        //TODO 이제 여기서 m = [ITV_PIC_SN=314, ITV_APLCNT_SN=312] 이런거 이용해서
        // 캘린더 각자 만들고 내용도 위의 params이용해서 집어넣기 ㄱㄱ

    }



}
