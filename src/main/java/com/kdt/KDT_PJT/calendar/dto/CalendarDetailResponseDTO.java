package com.kdt.KDT_PJT.calendar.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CalendarDetailResponseDTO { //상세조회용
    private Integer calSn;
    private Integer cohortSn;           //COHORT_SN
    private LocalDateTime eventBgngDt;  //EVENT_BGNG_DT
    private LocalDateTime eventEndDt;   //EVENT_END_DT
    private String eventNm;             //EVENT_NM 이벤트 이름
    private String rmrkCn;              //RMRK_CN 이벤트 설명
    private Integer userSn;             //USER_SN 사용자 일련번호
    private LocalDateTime eventRegDt;   //EVENT_REG_DT 작성일
    private Byte prvtYn;                //PRVT_YN 개인일정이면1 아니면 0
}
