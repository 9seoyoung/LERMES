package com.kdt.KDT_PJT.interview.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.calendar.service.CalendarService;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import com.kdt.KDT_PJT.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InterviewController {

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

//    @PreAuthorize("hasAnyRole('TENANT','EMPLOYEE','INSTRUCTOR')") //컨트롤러에서 체크하겠음
//    @GetMapping({"/my-requests", "/my-requests/{cohortSn}"}) //강사인경우, 테넌트/직원인 경우
//    public List<CmmnMap> getMyInterviewRequests(
//            @AuthenticationPrincipal AuthCustomUserDetails me,
//            @PathVariable(value = "cohortSn", required = false) Integer pathCohortSn) {
//
//        if (me == null) { // 로그인 안했으면 집가라
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
//        }
//
//        // 강사, 테넌트/직원 판단
//        if (Math.toIntExact(me.getRoleType()) == 4){ // 강사님이신지?
//            if (pathCohortSn == null && me.getCohortId() != null) {
//                pathCohortSn = Math.toIntExact(me.getCohortId()); //자신의 cohortsn 할당
//            }else {
//                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "강사는 cohortsn 포함 ㄴㄴ거나 본인의 cohortSn 비어있음");
//            }
//        } else if (Math.toIntExact(me.getRoleType()) == 2 || Math.toIntExact(me.getRoleType()) == 3) { //테넌트or직원인가
//            if (pathCohortSn == null){ // 근데 url에 기수번호 없으면 돌려보냄
//                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"기수번호 입력하셈 테넌트/직원은");
//            }
//        } else {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "권한도 없으신데 어딜!");
//        }
//
//        List<CmmnMap> resp = interviewService.getMyInterviewRequests(pathCohortSn);
//
//
//        return resp;
//    }



}
