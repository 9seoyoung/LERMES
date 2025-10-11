package com.kdt.KDT_PJT.survey.dto;
//설문 등록/조회/수정

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.survey.enums.SurveyScope;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestSurveyDto {

    private Long srvySn;
    @JsonProperty("title")// 설문 일련번호 (PK)
    private String srvyTtl;

    @JsonProperty("surveyForm")
    private Object srvyQitem;

    @JsonProperty("surveyStart")
    private LocalDateTime srvyBgngDt;

    @JsonProperty("surveyEnd")
    private LocalDateTime srvyEndDt;    // 설문 종료일
    private BbsType bbsType;

    @JsonProperty("scope")//게시판 유형 기본값 survey
    private SurveyScope srvyScope;  //공개범위
    @JsonProperty("coSn")
    private Long coSn;
    @JsonProperty("cohortSn")// 회사 일련번호 (FK) 15
    private Long cohortSn;          // 기수/과정 일련번호 (FK) 100
    @JsonProperty("userSn")
    private Long userSn;             //작성자 id 값을 받아서 user_nm으로 처리
}
