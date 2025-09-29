package com.kdt.KDT_PJT.calendar.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

// 글 하나 상세 조회시 사용하는 DTO
@Data
@Builder
public class CalendarDetailResponseDTO {
    private Integer calSn;
    //    private Integer cohortSn;           //COHORT_SN
    private LocalDateTime eventBgngDt;  //EVENT_BGNG_DT
    private LocalDateTime eventEndDt;   //EVENT_END_DT
    private String eventNm;             //EVENT_NM 이벤트 이름
        private String rmrkCn;              //RMRK_CN 이벤트 설명
//    @JsonIgnore
//    private Integer userSn;             //USER_SN 사용자 일련번호 이거는 보내줄필요없을듯,
    private String userNm;                // 작성자명, TB_USER에서 userSn으로 조인해서 가져오기
    private LocalDateTime eventRegDt;   //EVENT_REG_DT 작성일
    private Byte prvtYn;                //PRVT_YN 개인일정이면1 아니면 0
    //    private Integer coSn;             //굳이? 회사정보 보내줄필요는없을듯
    private Integer viewCnt;            // 조회수 (상세보기 눌렀을떄 up)
}
