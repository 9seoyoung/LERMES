package com.kdt.KDT_PJT.auth.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {
    private boolean ok;
    private String message;
    private Integer ttlSeconds; // 코드 유효 시간(초), 필요 없으면 null
}
