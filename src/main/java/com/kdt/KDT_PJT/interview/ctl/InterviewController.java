package com.kdt.KDT_PJT.interview.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.calendar.service.CalendarService;
import com.kdt.KDT_PJT.cmmn.Enum.AuthEnums;
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

//        // 강사, 테넌트/직원 판단
//        if (Math.toIntExact(me.getRoleType()) == 4){ // 강사님이신지?
//            if (pathCohortSn == null && me.getCohortSn() != null) {
//                pathCohortSn = Math.toIntExact(me.getCohortSn()); //자신의 cohortsn 할당
//                params.put("roleType", 4);
//            }else {
//                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "강사는 cohortsn 포함 ㄴㄴ거나 본인의 cohortSn 비어있음");
//            }
//        } else if (Math.toIntExact(me.getRoleType()) == 2 || Math.toIntExact(me.getRoleType()) == 3) { //테넌트or직원인가
//
//            if (pathCohortSn == null){ // 근데 url에 기수번호 없으면 돌려보냄
//                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"기수번호 입력하셈 테넌트/직원");
//            }
//        } else {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "권한도 없으신데 어딜!");
//        }

//        List<CmmnMap> resp = interviewService.getMyInterviewRequests(pathCohortSn, params);
//        System.out.println("select문 실행 결과 = " + resp);
//
//
//        return resp;
    }



}
