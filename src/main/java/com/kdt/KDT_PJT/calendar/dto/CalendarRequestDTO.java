package com.kdt.KDT_PJT.calendar.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder // 사용시 .로 와다다 붙이기 ㄱㄴ
public class CalendarRequestDTO {
//    private Integer calSn;              //CAL_SN
    @JsonProperty("cohortSn")
    private Integer cohortSn;           //COHORT_SN
    @JsonProperty("startDate")
    private LocalDateTime eventBgngDt;  //EVENT_BGNG_DT
    @JsonProperty("endDate")
    private LocalDateTime eventEndDt;   //EVENT_END_DT
    @JsonProperty("title")
    private String eventNm;             //EVENT_NM 이벤트 이름
    @JsonProperty("memo")
    private String rmrkCn;              //RMRK_CN 이벤트 설명
//    private Byte delYn;                 //DEL_YN 삭제여부
    private Integer userSn;             //USER_SN 사용자 일련번호
//    private LocalDateTime eventRegDt;   //EVENT_REG_DT 작성일
    private Byte prvtYn;                //PRVT_YN 개인일정이면1 아니면 0
}


//장소, 시작/종료 시간은 안받음??? 받아야쥐~
