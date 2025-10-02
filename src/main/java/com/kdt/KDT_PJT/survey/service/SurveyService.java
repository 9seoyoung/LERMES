package com.kdt.KDT_PJT.survey.service;

import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.survey.dto.RequestSurveyDto;
import com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto;
import com.kdt.KDT_PJT.survey.enums.SurveyRole;
import com.kdt.KDT_PJT.survey.enums.SurveyStatus;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import com.kdt.KDT_PJT.response.mapper.ResponseMapper; // 👈 응답 매퍼 추가
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyMapper surveyMapper;
    private final ResponseMapper responseMapper;

    // 설문 등록
    public ResponseSurveyDto createSurvey(RequestSurveyDto requestDto) {

        // 1. BbsType 기본값 보정
        BbsType type = requestDto.getBbsType() != null ? requestDto.getBbsType() : BbsType.SURVEY;
        requestDto.setBbsType(type);

        // 2. UUID 생성
        String uuid = UUID.randomUUID().toString();
        surveyMapper.insertSurvey(requestDto, uuid);

        return surveyMapper.findSurveyById(requestDto.getSrvySn());
    }

    // 설문 단건 조회 (+조회수 증가)
    @Transactional
    public ResponseSurveyDto getSurvey(Long srvySn) {
        surveyMapper.increaseViewCnt(srvySn);
        return surveyMapper.findSurveyById(srvySn);
    }

    // 설문 전체/회사별 조회
    public List<ResponseSurveyDto> getSurveyList(Long coSn, Long cohortSn, BbsType bbsType) {
        return surveyMapper.findSurveyList(coSn, cohortSn, bbsType);
    }

    // 설문 수정 (응답 있으면 차단)
    @Transactional
    public void updateSurvey(Long srvySn, RequestSurveyDto requestDto, Long userSn, Long roleId) {
        // 1. 설문 조회
        ResponseSurveyDto survey = surveyMapper.findSurveyById(srvySn);
        if (survey == null) {
            throw new IllegalArgumentException("해당 설문을 찾을 수 없습니다.");
        }

        // 2. 상태 계산
        SurveyStatus status = SurveyStatus.of(
                LocalDateTime.now(),
                survey.getSrvyBgngDt().atStartOfDay(),
                survey.getSrvyEndDt().atTime(23, 59, 59)
        );

        // 3. 응답 여부 확인
        int responseCount = responseMapper.countResponsesByParent(srvySn, "SURVEY");

        // 4. 수정 불가 조건
        if (responseCount > 0) {
            throw new IllegalStateException("이미 응답이 존재하는 설문은 수정할 수 없습니다.");
        }

        // 상태가 종료(CLOSED)면 수정 불가
        if (status == SurveyStatus.CLOSED) {
            throw new IllegalStateException("마감된 설문은 수정할 수 없습니다.");
        }

        // 5. 작성자 or 권한 체크
        if (!survey.getUserSn().equals(userSn)) {
            SurveyRole role = SurveyRole.fromCode(roleId);
            if (role != SurveyRole.SUPER_ADMIN && role != SurveyRole.TENANT_ADMIN) {
                throw new SecurityException("설문 수정 권한이 없습니다.");
            }
        }

        // 6. 수정 가능하면 진행
        surveyMapper.updateSurvey(srvySn, requestDto);
    }


    // 설문 삭제 (작성자 본인)
    @Transactional
    public void deleteSurvey(Long srvySn, Long userSn) {
        surveyMapper.softDeleteSurvey(srvySn, userSn);
    }

    // 설문 삭제 (관리자/강사 권한)
    @Transactional
    public void deleteSurveyByAdmin(Long srvySn) {
        surveyMapper.softDeleteSurveyByAdmin(srvySn);
    }
}
