package com.kdt.KDT_PJT.interview.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import com.kdt.KDT_PJT.interview.dto.InterviewRecordRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class InterviewRecordService {

    private final InterviewService interviewService;

    @Autowired
    CmmnDao dao;

    public int countActiveRecord(Integer itvSn) {
        return dao.selectOne("com.kdt.mapper.interviewRecord.countActiveRecordByItvSn", itvSn);
    }


    @Transactional
    public void createInterviewRecord(AuthCustomUserDetails me, InterviewRecordRequestDTO params) { //CmmnMap
        boolean isDateInputProvided = params.getDate() != null && !params.getDate().isBlank();
        Integer itvSn = params.getItvSn();
        if (itvSn != null && countActiveRecord(itvSn) != 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 해당 면담신청에 대한 기록이 존재함");
        }
        if (itvSn != null && !isDateInputProvided){ // itvSn 존재하고, 날짜 입력 안왔으면 해당하는 itvSn에서 가져온다.
            LocalDateTime itvPrnmntDt = interviewService.getItvPrnmntDtByItvSn(itvSn);
            if(itvPrnmntDt != null) params.setItvDt(itvPrnmntDt);   //날짜 가져온게 null 아니라면 DTO에 집어넣음
            else throw new ResponseStatusException(HttpStatus.CONFLICT, "확정 된 면담이 아님"); //비워져있으면 확정 면담 아니니까 예외발생
        }
        if (isDateInputProvided){
            params.buildDateTime();
        }
        System.out.println("요청 params = " + params);

        dao.insert("com.kdt.mapper.interviewRecord.createInterviewRecord",params);
        System.out.println("입력된 params = " + params);
    }
}
