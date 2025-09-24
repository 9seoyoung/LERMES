package com.kdt.KDT_PJT.response.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Getter;

@Getter
public enum ParentType {
    BBS("설문 조사"),
    COHORT("모집 공고");

    private final String displayName;

    ParentType(String displayName){
        this.displayName=displayName;
    }
    @JsonCreator
    public static ParentType fromDisplayName(String name) {
        if (name == null) {
            throw new IllegalArgumentException("없는 유형입니다.");
        }
        for (ParentType type : values()) {
            if (type.displayName.equals(name)) {
                return type;
            }
        }
        throw new IllegalArgumentException("없는 ResponseType:"+name);
    }
    @JsonValue
    public String getDisplayName(){
        return displayName;
    }
}
