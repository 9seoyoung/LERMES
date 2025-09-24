package com.kdt.KDT_PJT.calendar.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CalendarCreateResponseDTO {
    private Integer calSn;
    private String  eventNm;
    private LocalDateTime eventBgngDt;
    private LocalDateTime eventEndDt;
    private Byte    prvtYn;
}
