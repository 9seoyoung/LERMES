package com.kdt.KDT_PJT.response.dto;

import com.kdt.KDT_PJT.response.enums.ParentType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponseResponseDto {
    private Long rspnsSn;           // 응답 일련번호 (PK)
    private ParentType parentType;  // 부모 유형 (BBS / COHORT)
    private Long parentSn;          // 부모 PK
    private Long userSn;            // 작성자 ID
    private String userNm;          // 작성자 이름 (조회 시만 표시)
    private LocalDateTime rspnsDt;  // 응답 작성일시
    private String rspnsCn;         // 응답 내용 (JSON or 텍스트)
}
