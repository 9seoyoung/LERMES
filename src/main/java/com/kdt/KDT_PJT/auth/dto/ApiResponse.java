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
    private Object data; // 시간일때 코드 유효 시간(초), url일때 url 경로
}
