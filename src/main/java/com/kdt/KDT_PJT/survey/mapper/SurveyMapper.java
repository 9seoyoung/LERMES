package com.kdt.KDT_PJT.survey.mapper;

import com.kdt.KDT_PJT.survey.dto.RequestSurveyDto;
import com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SurveyMapper {
    // 등록
    void insertSurvey(RequestSurveyDto requestDto);

    // 단건 조회
    ResponseSurveyDto findSurveyById(Long srvySn);

    // 회사별 목록 조회
    List<ResponseSurveyDto> findSurveyListByCompany(Long coSn);

    // 수정
    void updateSurvey(@Param("id") Long id, @Param("dto") RequestSurveyDto dto);


}
