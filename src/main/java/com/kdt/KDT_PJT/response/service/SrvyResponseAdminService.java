package com.kdt.KDT_PJT.response.service;

import com.kdt.KDT_PJT.response.dto.SrvyResponseResponseDto;
import com.kdt.KDT_PJT.response.mapper.SrvyResponseMapper;
import com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto;
import com.kdt.KDT_PJT.survey.enums.SurveyRole;
import com.kdt.KDT_PJT.survey.enums.SurveyScope;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SrvyResponseAdminService {

    private final SrvyResponseMapper srvyResponseMapper;
    private final SurveyMapper surveyMapper;

    /**
     * 설문 단건 + 응답 리스트 조회 (역할별 분기)
     */
    @Transactional(readOnly = true)
    public List<SrvyResponseResponseDto> getSurveyResponses(
            Long srvySn,
            Long roleId,
            Long userSn,
            Long filterCoSn,
            Long filterCohortSn,
            Long authCoSn,
            Long authCohortSn) {

        SurveyRole role = SurveyRole.fromCode(roleId);
        ResponseSurveyDto survey = surveyMapper.findSurveyById(srvySn);

        if (survey == null) {
            throw new IllegalArgumentException("해당 설문이 존재하지 않습니다.");
        }

        // INTERNAL 스코프 차단 예외
        if (survey.getSrvyScope() == SurveyScope.INTERNAL && role == SurveyRole.SUPER_ADMIN) {
            throw new SecurityException("기수 내부(INTERNAL) 설문은 접근할 수 없습니다.");
        }

        // 권한별 로직 분기
        return switch (role) {
            case SUPER_ADMIN -> {
                // ✅ 전체 접근 가능 + coSn, cohortSn 필터 가능
                yield srvyResponseMapper.findAllByParentWithFilter(srvySn, filterCoSn, filterCohortSn);
            }

            case TENANT_ADMIN, EMPLOYEE -> {
                // ✅ 같은 회사 + COHORT 범위만 가능
                if (!Objects.equals(survey.getCoSn(), authCoSn)) {
                    throw new SecurityException("회사 범위를 벗어남");
                }
                if (survey.getSrvyScope() == SurveyScope.INTERNAL) {
                    throw new SecurityException("INTERNAL 범위는 접근 불가");
                }
                yield srvyResponseMapper.findAllByParentWithUserName(srvySn);
            }

            case INSTRUCTOR -> {
                // ✅ 자신 코호트 내 설문만 접근 가능
                if (!Objects.equals(survey.getCohortSn(), authCohortSn)) {
                    throw new SecurityException("다른 기수 접근 불가");
                }
                yield srvyResponseMapper.findAllByParentWithUserName(srvySn);
            }

            case STUDENT -> {
                // ✅ 자신이 만든 설문 → 전체 응답, 남의 설문 → 본인 응답만
                if (Objects.equals(survey.getUserSn(), userSn)) {
                    yield srvyResponseMapper.findAllByParentWithUserName(srvySn);
                } else {
                    yield srvyResponseMapper.findByParentAndUserList(srvySn, userSn);
                }
            }

            default -> throw new SecurityException("조회 권한이 없습니다.");
        };
    }

}
