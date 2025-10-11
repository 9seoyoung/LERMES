package com.kdt.KDT_PJT.cohortresponse.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CohortResponseDto {

    private Long rspnsSn;
    private String parentType;
    private Integer parentSn;
    private Integer userSn;
    private LocalDateTime rspnsDt;
    private String rspnsCn;
    private Integer viewCnt;
    private Boolean delYn;
    private String formUuid;
}
