package com.kdt.KDT_PJT.cohort.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Setter
@Getter
@Table(name = "TB_COHORT")
public class Cohort {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COHORT_SN")
    private Long cohortSn;

    @Column(name = "CRCLM_NM")
    private String crclmNm;

    @Column(name = "CRCLM_CN")
    private String crclmCn;

    @Column(name = "CO_SN")
    private Long coSn;

    @Column(name = "RECRUIT_BGNG_DT")
    private LocalDate recruitBgngDt;

    @Column(name = "RECRUIT_END_DT")
    private LocalDate recruitEndDt;

    @Column(name = "CRCLM_BGNG_YMD")
    private LocalDate crclmBgngYmd;

    @Column(name = "CRCLM_END_YMD")
    private LocalDate crclmEndYmd;

    @Column(name = "COHORT_STTS_NM")
    private String cohortSttsNm;

    @Column(name = "COHORT_CATE")
    private String cohortCate;

    // Getter, Setter 생략 (롬복 사용 가능)

    // 생성자, toString 등 필요시 추가
}
