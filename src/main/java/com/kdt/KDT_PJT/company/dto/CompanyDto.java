package com.kdt.KDT_PJT.company.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDto {

    private Long id;              // 회사 PK
    private String brno;          // 사업자등록번호
    private String name;          // 회사명
    private boolean active;       // 활성여부
    private LocalDateTime registeredAt; // 등록일자
    private Integer fileSn;       // 파일 순번 (null 허용)

}
