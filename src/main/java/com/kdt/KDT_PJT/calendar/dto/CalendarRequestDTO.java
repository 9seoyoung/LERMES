package com.kdt.KDT_PJT.calendar.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CalendarRequestDTO {
    private Integer calSn;              //CAL_SN
    private Integer cohortSn;           //COHORT_SN
    private LocalDateTime eventBgngDt;  //EVENT_BGNG_DT
    private LocalDateTime eventEndDt;   //EVENT_END_DT
    private String eventNm;             //EVENT_NM 이벤트 이름
    private String rmrkCn;              //RMRK_CN 이벤트 설명
    private Byte delYn;                 //DEL_YN 삭제여부
    private Integer userSn;             //USER_SN 사용자 일련번호 (개인일정일경우에만 존재, 아니면 null)
}
