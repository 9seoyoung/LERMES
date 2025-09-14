package com.kdt.KDT_PJT.attend.dto;

import lombok.Getter;
import lombok.Setter;

/** 강사가 입력하는 평문 코드 + 옵션 TTL, 허용IP */
@Getter @Setter
public class CreateAttendCodeRequest {
    private String code;        // 반드시 입력(예: 6자리)
    private Integer ttlMinutes; // 5~15, 미입력 시 10
    private String allowedIp;   // 미입력 시 요청자의 공인IP 사용
}
