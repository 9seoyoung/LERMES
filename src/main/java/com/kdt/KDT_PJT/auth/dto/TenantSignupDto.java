package com.kdt.KDT_PJT.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TenantSignupDto {
    private String username;
    private String email;
    private String verificationCode; // 인증코드 확인
    private String password;
    private String confirmPassword;
    private String phoneNumber;
    private String companyName;
    private String companyNumber;
}
