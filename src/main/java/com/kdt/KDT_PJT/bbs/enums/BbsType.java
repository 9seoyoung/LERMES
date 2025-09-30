package com.kdt.KDT_PJT.bbs.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum BbsType {
    NOTICE("공지"),               /*작성+수정 : 테넌트, 직원 / 열람권한: 전체공개*/
    CLASS_MATERIAL("자료실"),     /*작성+수정+열람 : cohort_sn을 가진 강사, 수강생*/
    FAQ("FAQ"),                  /*작성+수정 : 테넌트, 직원 / 열람권한 : cohort_sn을 가진 강사, 수강생*/
    QNA("문의"),
    SURVEY("설문조사");                 /*작성+수정+열람 : 테넌트, 직원, cohort_sn을 가진 강사, 수강생*/


    private final String description;

    // JSON 직렬화 시 한글(description)으로 반환
    @JsonValue
    public String getDescription() {
        return description;
    }

    // JSON 역직렬화 시 한글(description) 기준으로 매핑
    @JsonCreator
    public static BbsType fromDescription(String description) {
        for (BbsType type : BbsType.values()) {
            if (type.getDescription().equals(description)) {
                return type;
            }
        }
        throw new IllegalArgumentException("없는 게시판 유형입니다.: " + description);
    }
}