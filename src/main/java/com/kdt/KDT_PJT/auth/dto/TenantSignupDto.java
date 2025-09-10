package com.kdt.KDT_PJT.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TenantJoinDto {
    private String uesrname;
    private String email;
    private String verfication; // 인증코드 확인
    private String password;
    private String confirmPassword;
    private String phoneNumber;
    private String companyName;
    private String companyNumber;
}
