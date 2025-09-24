package com.kdt.KDT_PJT.survey.service;

import com.kdt.KDT_PJT.survey.dto.RequestSurveyDto;
import com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import com.kdt.KDT_PJT.response.mapper.ResponseMapper; // 👈 응답 매퍼 추가
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyMapper surveyMapper;
    private final ResponseMapper responseMapper;

    // 설문 등록
    public ResponseSurveyDto createSurvey(RequestSurveyDto requestDto) {
        surveyMapper.insertSurvey(requestDto);
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

    // 설문 수정 (응답 있으면 차단)
    @Transactional
    public void updateSurvey(Long id, RequestSurveyDto requestDto) {
        // 1. 설문조사 응답 개수 확인
        int responseCount = responseMapper.countResponsesByParent(id, "BBS");
        if (responseCount > 0) {
            throw new IllegalStateException("이미 응답이 존재 하는 설문은 수정할 수 없습니다.");
        }

        // 2. 응답 없으면 수정 진행
        surveyMapper.updateSurvey(id, requestDto);
    }
}
