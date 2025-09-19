package com.kdt.KDT_PJT.survey.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SurveyDto {
    private Long srvySn;          // 설문 일련번호 (PK)
    private String srvyQitem;     // 설문 문항 (JSON 문자열)
    private Long coSn;            // 회사 일련번호
    private Long cohortSn;        // 기수/과정 일련번호
    private LocalDate srvyBgngDt; // 설문 시작일
    private LocalDate srvyEndDt;  // 설문 종료일
    private int userSn;           // 작성자 ID
    private String userNm;        // 작성자 이름

}
