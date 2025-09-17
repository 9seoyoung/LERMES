package com.kdt.KDT_PJT.survey.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SurveyDto {
    private Long srvySn;      // 설문 일련번호 (PK)
    private String srvyQitem; // 설문 문항(JSON 문자열)
    private String srvyRspns; // 설문 응답(JSON 문자열)
    private Long coSn;        // 회사 일련번호 (FK)
}
