package com.kdt.KDT_PJT.cohort.dto;

import java.time.LocalDate;

public class CohortDto {

    private Long cohortSn;  // 수정, 조회 응답용

    private String crclmNm;

    private String crclmCn;

    private Long coSn;

    private LocalDate recruitBgngDt;

    private LocalDate recruitEndDt;

    private LocalDate crclmBgngYmd;

    private LocalDate crclmEndYmd;

    private String cohortSttsNm;

    private String cohortCate;

    // 기본 생성자, getter/setter 생략 가능 (롬복 사용 가능)
}
