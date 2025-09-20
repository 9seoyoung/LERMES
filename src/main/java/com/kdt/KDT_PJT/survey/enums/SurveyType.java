package com.kdt.KDT_PJT.survey.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum SurveyType { BBS("설문");      // 게시판

    private final String displayName;

    SurveyType(String displayName) {
        this.displayName = displayName;
    }

    // 프론트 -> 서버 (요청 JSON → Enum)
    @JsonCreator
    public static SurveyType fromDisplayName(String name) {
        if (name == null) {  // null 방어 로직 추가
            throw new IllegalArgumentException("설문 유형이 없습니다.");
        }

        for (SurveyType type : values()) {
            if (type.displayName.equals(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown SurveyType: " + name);
    }

    // 서버 -> 프론트 (Enum → 응답 JSON)
    @JsonValue
    public String getDisplayName() {
        return displayName;
    }
}
