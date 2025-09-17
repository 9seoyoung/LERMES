package com.kdt.KDT_PJT.survey.service;

import com.kdt.KDT_PJT.survey.dto.SurveyDto;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyMapper surveyMapper;
//
    public void createSurvey(SurveyDto surveyDto) {
        surveyMapper.insertSurvey(surveyDto);
    }
//
    public SurveyDto getSurvey(Long id) {
        return surveyMapper.selectSurveyById(id);
    }

    public List<SurveyDto> getSurveyList(Long coSn) {
        return surveyMapper.selectSurveyListByCompany(coSn);
    }
}
