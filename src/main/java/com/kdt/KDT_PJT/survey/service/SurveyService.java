package com.kdt.KDT_PJT.survey.service;

import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.survey.dto.RequestSurveyDto;
import com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto;
import com.kdt.KDT_PJT.survey.enums.SurveyRole;
import com.kdt.KDT_PJT.survey.enums.SurveyScope;
import com.kdt.KDT_PJT.survey.enums.SurveyStatus;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import com.kdt.KDT_PJT.response.mapper.ResponseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyMapper surveyMapper;
    private final ResponseMapper responseMapper;

    // 설문 등록
    public ResponseSurveyDto createSurvey(RequestSurveyDto requestDto, Long userSn, Long roleId) {

        //  roleId null 시 처리
        if (roleId == null) {
            throw new SecurityException("님? 권한이 없음");
        }

        // 1. 권한 체크
        SurveyRole role = SurveyRole.fromCode(roleId);
        if (!role.canCreate(requestDto.getSrvyScope())) {
            throw new SecurityException("권한 레벨 부족임 승격 필요");
        }

        // 2. 작성자 보정 (혹시 컨트롤러에서 안 넣었어도 안전하게 세팅)
        requestDto.setUserSn(userSn);

        // 3. BbsType 기본값 보정
        requestDto.setBbsType(requestDto.getBbsType() != null ? requestDto.getBbsType() : BbsType.SURVEY);

        // 4. UUID 생성
        String uuid = UUID.randomUUID().toString();
        surveyMapper.insertSurvey(requestDto, uuid);

        // 5. 생성된 설문 다시 조회해서 반환
        return surveyMapper.findSurveyById(requestDto.getSrvySn());
    }


    // 설문 단건 조회 (+조회수 증가)
    @Transactional
    public ResponseSurveyDto getSurvey(Long srvySn, Long roleId, Long userSn, Long coSn, Long cohortSn) {
        if (roleId == null) {
            throw new SecurityException("권한 정보가 없습니다.");
        }

        SurveyRole role = SurveyRole.fromCode(roleId);
        ResponseSurveyDto survey = surveyMapper.findSurveyById(srvySn);
        if (survey == null) throw new IllegalArgumentException("해당 설문을 찾을 수 없습니다.");

        // INTERNAL
        if (survey.getSrvyScope() == SurveyScope.INTERNAL) {
            boolean allowed = (role == SurveyRole.INSTRUCTOR || role == SurveyRole.STUDENT)
                    && survey.getCoSn().equals(coSn)
                    && survey.getCohortSn().equals(cohortSn);
            if (!allowed) throw new SecurityException("해당 기수 사람만 조회가능 합니다.");
        }

        // COHORT
        if (survey.getSrvyScope() == SurveyScope.COHORT) {
            switch (role) {
                case SUPER_ADMIN -> {
                    // 무조건 허용
                }
                case TENANT_ADMIN, EMPLOYEE -> {
                    boolean allowed = Objects.equals(survey.getCoSn(), coSn);
                    if (!allowed) throw new SecurityException("조회 권한이 없습니다.");
                }
                case STUDENT -> {
                    boolean allowed = Objects.equals(survey.getCohortSn(), cohortSn);
                    if (!allowed) throw new SecurityException("조회 권한이 없습니다.");
                }
                default -> throw new SecurityException("조회 권한이 없습니다.");
            }
        }

        // 접근 허용된 경우에만 조회수 증가
        surveyMapper.increaseViewCnt(srvySn);
        return survey;
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
            throw new IllegalStateException("해당 설문에 응답이 있습니다. 수정 불가능합니다.");
        }
        if (status == SurveyStatus.CLOSED) {
            throw new IllegalStateException("마감된 설문은 수정할 수 없습니다.");
        }

        // 5. 권한 체크
        if (roleId == null) {
            throw new SecurityException("님? 권한이 없음");
        }
        SurveyRole role = SurveyRole.fromCode(roleId);

        boolean isOwner = survey.getUserSn().equals(userSn);
        boolean isAdmin = (role == SurveyRole.SUPER_ADMIN || role == SurveyRole.TENANT_ADMIN);

        // 작성자 / 관리자 다른 쿼리 호출
        if (isOwner) {
            requestDto.setUserSn(userSn); // WHERE USER_SN 매칭용
            surveyMapper.updateSurveyOwner(srvySn, requestDto); // Owner 전용 쿼리
        } else if (isAdmin) {
            surveyMapper.updateSurveyByAdmin(srvySn, requestDto); // Admin 전용 쿼리
        } else {
            throw new SecurityException("설문 수정 권한이 없습니다.");
        }
    }

    // 소프트 딜리트 삭제
    @Transactional
    public void deleteSurvey(Long srvySn, Long userSn, Long roleId, Long coSn, Long cohortSn) {
        ResponseSurveyDto survey = surveyMapper.findSurveyById(srvySn);
        if (survey == null) {
            throw new IllegalArgumentException("해당 설문을 찾을 수 없습니다.");
        }

        SurveyRole role = SurveyRole.fromCode(roleId);

        // 1. 본인 → 항상 삭제 가능
        if (survey.getUserSn().equals(userSn)) {
            surveyMapper.softDeleteSurvey(srvySn, userSn);
            return;
        }

        // 2. EMPLOYEE → 같은 회사(CoSn) + COHORT 범위 설문이면 삭제 가능
        if (role == SurveyRole.EMPLOYEE
                && survey.getCoSn().equals(coSn)
                && survey.getSrvyScope() == com.kdt.KDT_PJT.survey.enums.SurveyScope.COHORT) {
            surveyMapper.softDeleteSurveyByAdmin(srvySn);
            return;
        }
        // 3.강사 → 같은 회사+같은 기수+INTERNAL 범위 설문이면 삭제 가능: 학생이 만든 설문 삭제 가능
        if (role == SurveyRole.INSTRUCTOR
                && survey.getCohortSn().equals(cohortSn)
                && survey.getSrvyScope() == com.kdt.KDT_PJT.survey.enums.SurveyScope.INTERNAL) {
            surveyMapper.softDeleteSurveyByAdmin(srvySn);
            return;
        }

        // 4. SUPER_ADMIN, TENANT_ADMIN → 전체 설문 삭제 가능
        if (role == SurveyRole.SUPER_ADMIN || role == SurveyRole.TENANT_ADMIN) {
            surveyMapper.softDeleteSurveyByAdmin(srvySn);
            return;
        }

        // 4. 그 외 → 권한 없음
        throw new SecurityException("설문 삭제 권한이 없습니다.");
    }
}

