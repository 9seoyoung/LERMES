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
    SurveyDto survey = surveyMapper.selectSurveyById(id);
    if (survey == null) {
        throw new IllegalArgumentException("존재하지 않거나 삭제된 설문조사입니다. id=" + id);
    }
    return survey;
    }

    public List<SurveyDto> getSurveyList(Long coSn) {
        return surveyMapper.selectSurveyListByCompany(coSn);
    }
    // 설문 수정
    public void updateSurvey(Long id, SurveyDto surveyDto) {
        // DB에 있는지 먼저 확인
        SurveyDto existing = surveyMapper.selectSurveyById(id);
        if (existing == null) {
            throw new IllegalArgumentException("존재하지 않는 설문조사입니다. id=" + id);
        }
        // 안전하게 PK 세팅
        surveyDto.setSrvySn(id);
        surveyMapper.updateSurvey(surveyDto);
    }
}
