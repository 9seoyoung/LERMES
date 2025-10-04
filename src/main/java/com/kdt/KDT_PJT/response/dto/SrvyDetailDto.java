package com.kdt.KDT_PJT.response.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SrvyDetailDto {
    private Long surveySn;        // 설문 SN
    private String title;         // 설문 제목
    private String questions;     // 설문 질문 JSON
    private String response;      // 내 응답 JSON (없으면 null)
}


//단건 조회 시 응답 전/후 분기에 따라:
//
//응답 전 → response=null
//
//응답 후 → response=JSON