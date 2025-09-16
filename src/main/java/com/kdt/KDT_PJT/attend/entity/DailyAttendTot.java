package com.kdt.KDT_PJT.attend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "TB_DAILY_ATTEND_TOT")
@Builder
public class DailyAttendTot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DAILY_ATTEND_TOT_SN")
    private Long id;

    @Column(name = "ATTEND_YMD", nullable = false)
    private LocalDate date;

    @Column(name = "ATTEND_DTL_TYPE_SN", nullable = false)
    private Integer attendDtlTypeSn;

    @Column(name = "USER_SN", nullable = false)
    private Long userSn;

    @Column(name = "CO_SN", nullable = false)
    private Long companySn;

    @Column(name = "COHORT_SN", nullable = false)
    private Long cohortSn;
}
