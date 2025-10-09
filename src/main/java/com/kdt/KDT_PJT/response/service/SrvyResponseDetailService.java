package com.kdt.KDT_PJT.response.service;

import com.kdt.KDT_PJT.response.dto.SrvyResponseDetailDto;
import com.kdt.KDT_PJT.response.mapper.SrvyResponseDetailMapper;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.LifecycleState;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class SrvyResponseDetailService {

    private final SrvyResponseDetailMapper detailMapper;
    private final SurveyMapper surveyMapper;

    //자기 응담만 조회
    @Transactional(readOnly = true)
    public SrvyResponseDetailDto getSurveyDetail(Long srvySn, Long userSn) {
        return detailMapper.findSurveyDetailWithResponse(srvySn, userSn);
    }
    //작성자용 전체 조회
    @Transactional(readOnly = true)
    public List<SrvyResponseDetailDto> getAllResponses(Long srvySn, Long requesterSn) {
        // 설문 작성자 확인
        Map<String, Object> writerInfo = surveyMapper.findWriterBySurveySn(srvySn);

        if (writerInfo == null) {
            throw new IllegalArgumentException("존재하지 않는 설문입니다.");
        }

        // writerSn 키에서 실제 작성자 번호 꺼내기
        Long writerSn = ((Number) writerInfo.get("writerSn")).longValue();

        // 작성자 본인인지 확인
        if (!Objects.equals(writerSn, requesterSn)) {
            throw new AccessDeniedException("해당 설문의 작성자가 아닙니다.");
        }

        // 전체 응답 반환
        return detailMapper.findAllResponsesBySurvey(srvySn);
    }


}
