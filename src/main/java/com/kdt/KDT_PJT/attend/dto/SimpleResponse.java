package com.kdt.KDT_PJT.attend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SimpleResponse {
    private final boolean ok;
    private final String message;
}
