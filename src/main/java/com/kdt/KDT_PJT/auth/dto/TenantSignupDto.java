package com.kdt.KDT_PJT.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TenantSignupDto {
    private String companyName;      // 회사명
    private String businessNumber;   // 사업자등록번호(BRNO)
    private String username;         // 관리자 이름
    private String email;
    private String verificationCode;
    private String password;
    private String confirmPassword;
    private String phoneNumber;
}