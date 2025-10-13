package com.kdt.KDT_PJT.studySchedule.service;

import com.kdt.KDT_PJT.calendar.dto.CalendarDetailResponseDTO;
import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.studySchedule.dto.StudyScheduleResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudyScheduleService {

    @Autowired
    CmmnDao dao;

    public List<StudyScheduleResponseDTO> getStudySchedule(Integer cohortSn){
        return dao.selectList("com.kdt.mapper.studySchedule.getStudyScheduleByCohortSn",cohortSn);
    }
}
