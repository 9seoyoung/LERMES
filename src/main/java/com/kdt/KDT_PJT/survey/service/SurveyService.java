package com.kdt.KDT_PJT.survey.service;

import com.kdt.KDT_PJT.survey.dto.RequestSurveyDto;
import com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyMapper surveyMapper;
//
// 설문 등록
public ResponseSurveyDto createSurvey(RequestSurveyDto requestDto) {
    surveyMapper.insertSurvey(requestDto);
    // 방금 저장한 PK로 다시 SELECT 해서 최종 데이터 반환
    return surveyMapper.findSurveyById(requestDto.getSrvySn());
}

    // 설문 단건 조회
    public ResponseSurveyDto getSurvey(Long srvySn) {
        return surveyMapper.findSurveyById(srvySn);
    }

    // 설문 전체/회사별 조회
    public List<ResponseSurveyDto> getSurveyList(Long coSn) {
        return surveyMapper.findSurveyListByCompany(coSn);
    }

    // 설문 수정
    public void updateSurvey(Long id, RequestSurveyDto requestDto) {
        surveyMapper.updateSurvey(id, requestDto);
    }
}
