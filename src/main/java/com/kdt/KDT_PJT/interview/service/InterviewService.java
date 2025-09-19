package com.kdt.KDT_PJT.interview.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class InterviewService {
    @Autowired
    CmmnDao dao;


    /** TODO 면담 신청 API 서비스
     * @methodName : createInterviewRequest
     * @author : 김동식
     * @date : 2025.09.19
     * @param me : 로그인한 사용자 정보
     * @param params : 면담 정보(담당자, 대상자, 일시 등)를 담은 Map
     * @return : 성공 여부 및 저장된 정보를 담은 Map
     * Description : 면담 이벤트와 기록을 생성하고 데이터베이스에 저장합니다.
     * 하나의 면담에 하나의 기록만 존재하는 1:1 관계를 가집니다.
     */
    @Transactional
    public CmmnMap createInterviewRequest(AuthCustomUserDetails me, CmmnMap params) {
        // 0) 인증 확인
        if (me == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인 필요");
        }

        // 1) 기본 유효성


        CmmnMap result = new CmmnMap();
        return result;
    }
}
