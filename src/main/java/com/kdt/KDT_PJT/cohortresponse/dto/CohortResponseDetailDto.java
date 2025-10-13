package com.kdt.KDT_PJT.cohortresponse.dto;

import com.kdt.KDT_PJT.user.Dto.UserDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CohortResponseDetailDto {
    private String responseJson;  // 응답 JSON
    private String surveyForm;    // 모집 설문 JSON
    private UserDto userInfo;     // 사용자 정보
}
