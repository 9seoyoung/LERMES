package com.kdt.KDT_PJT.survey.mapper;

import com.kdt.KDT_PJT.survey.dto.SurveyDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SurveyMapper {
    void insertSurvey(SurveyDto surveyDto);
    SurveyDto selectSurveyById(Long id);
    List<SurveyDto> selectSurveyListByCompany(@Param("coSn")Long coSn);

    SurveyDto findById(Long id);
    void updateSurvey(SurveyDto surveyDto);

}
