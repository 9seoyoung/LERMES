package com.kdt.KDT_PJT.interview.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InterviewService {
    @Autowired
    CmmnDao dao;


    /** TODO 면담 신청 API 서비스
     * @methodName : createInterviewRequest
     * @author : 김동식
     * @date : 2025.09.19
     * @param me : 로그인한 사용자 정보(교사 또는 학생)
     * @param params : 면담 정보(담당자, 대상자, 일시 등)를 담은 Map
     * @return : 성공 여부 및 저장된 정보를 담은 Map
     * Description : 면담 이벤트와 기록을 생성하고 데이터베이스에 저장합니다.
     * 하나의 면담에 하나의 기록만 존재하는 1:1 관계를 가집니다.
     */
    @PreAuthorize("hasAnyRole('INSTRUCTOR','STUDENT')") //얘네만 면담신청 가능
    @Transactional
    public CmmnMap createInterviewRequest(AuthCustomUserDetails me, CmmnMap params) {
        // 0) 인증 확인
        if (me == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");   //예외 발생시 정상응답(200ok)대신 상태코드에 맞는 HTTP응답을 클라이언트에 돌려보냄
        }
        //params에 담긴 정보 : 면담 신청 제목, 면담 신청 내용, 면담 담당자 권한
        params.put("itvAplcntSn", Math.toIntExact(me.getId()));      //로그인유저 사용자SN 가져옴
        params.put("cohortSn", Math.toIntExact(me.getCohortSn()));   //로그인 유저의 기수SN 가져옴
        String uuid = UUID.randomUUID().toString().replace("-", ""); //하이픈 제거된 uuid 얻음(신청글에대한 uuid) // TODO 일단 모든 면담에 대해 uuid 만드는데, 파일 있을경우만 생성하도록 변경할팔요
        params.put("formUuid", uuid);               //신청글에대한 uuid 만듦
        params.put("itvAplyDt", LocalDateTime.now().truncatedTo(ChronoUnit.SECONDS)); // 면담 신청 일시 추가(기록용)

        //itvPicAuthrt 값을 문자열로 가져와서 Integer로 변환
        String authrtString = (String) params.get("itvPicAuthrt");
        Integer authrtCode = null;
        if ("대표".equals(authrtString)) {
            authrtCode = 2;
        } else if ("직원".equals(authrtString)) {
            authrtCode = 3;
        } else if ("강사".equals(authrtString)) {
            authrtCode = 4;
        } else {
            // 변환할 수 없는 값일 경우 예외 처리
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효하지 않은 면담 담당자 권한입니다.");
        }
        System.out.println("면담대상자 authrtCode = " + authrtCode);
        // 2) 변환된 Integer 값을 다시 CmmnMap에 넣기
        params.put("itvPicAuthrt", authrtCode);


        dao.insert("com.kdt.mapper.interview.insertApplyInterview", params); //itvSn 생성되어 들어옴.
        System.out.println("params = " + params);
        System.out.println(params.get("itvPicAuthrt"));
        System.out.println(params.get("itvPicAuthrt").getClass().getName());
        System.out.println(params.get("itvAplcntSn").getClass().getName());
//        CmmnMap result = new CmmnMap();
        CmmnMap result = params;
        return result;
    }

    @PreAuthorize("hasAnyRole('TENANT','EMPLOYEE','INSTRUCTOR')")
    @Transactional
    public List<CmmnMap> getMyInterviewRequests(Integer pathCohortSn) {

        List<CmmnMap> paramsList = dao.selectList("com.kdt.mapper.interview.getMyInterviewRequests");
        return paramsList;
    }
}
