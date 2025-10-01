package com.kdt.KDT_PJT.companymem.Dto;

import com.kdt.KDT_PJT.auth.entity.UserRoleType;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyMemberDto {
    private Long companyMemberSn;  // nullable in create
    private Long companySn;
    private Long userSn;
    private UserRoleType userAuthrtSn;
    private LocalDateTime orgStartDate;
    private LocalDateTime orgEndDate;
}

