package com.kdt.KDT_PJT.response.dto;

import com.kdt.KDT_PJT.response.enums.ParentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RequestResponseDto {
    private Long parentSn;          /*survey_sn / cohort_sn*/
    private ParentType parentType;  /*BBS / COHORT*/
    private Long userSn;
    private String rspnsCn;

}
