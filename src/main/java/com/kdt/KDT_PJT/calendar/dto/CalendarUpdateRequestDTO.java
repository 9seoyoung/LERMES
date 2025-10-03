package com.kdt.KDT_PJT.calendar.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarUpdateRequestDTO { // 업데이트 전용 DTO
    private LocalDateTime eventBgngDt;
    private LocalDateTime eventEndDt;
    private String eventNm;
    private String rmrkCn;
    private Byte prvtYn;
    @JsonIgnore private Integer calSn;
    @JsonIgnore private Integer userSn;
}
