package com.kdt.KDT_PJT.cohort.mapper;

import com.kdt.KDT_PJT.cohort.dto.CohortDto;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.entity.QuestionType;
//상준이 등장
public class CohortConverter {

    public static Cohort toEntity(CohortDto dto) {
        if (dto == null) return null;

        Cohort entity = new Cohort();

        // entity.setCohortSn(null); // id(UUID)와 cohortSn(Long) 타입 불일치, 보통 DB 생성 시 할당

        entity.setCohortNm(dto.getTitle());
        entity.setCrclmNm(dto.getGroupName());
        String content = dto.getContent();
        if (content == null || content.trim().isEmpty()) {
            entity.setCrclmCn("{}");
        } else {
            entity.setCrclmCn(content);
        }
        entity.setCoSn(dto.getUserSn());
        entity.setRecruitBgngDt(dto.getSurveyStart());
        entity.setRecruitEndDt(dto.getSurveyEnd());
        entity.setCrclmBgngYmd(dto.getStartDate());
        entity.setCrclmEndYmd(dto.getEndDate());
        entity.setCohortSttsNm(dto.getScope());

        // String -> Enum 변환
        if (dto.getType() != null) {
            try {
                entity.setCohortCate(QuestionType.valueOf(dto.getType()));
            } catch (IllegalArgumentException e) {
                entity.setCohortCate(null);
            }
        }

        entity.setAttendStartTm(dto.getClassStart());
        entity.setAttendEndTm(dto.getClassEnd());

        return entity;
    }

    public static CohortDto toDto(Cohort entity) {
        if (entity == null) return null;

        CohortDto dto = new CohortDto();

        // dto.setId(null); // UUID 값은 별도 로직 필요

        dto.setTitle(entity.getCohortNm());
        dto.setGroupName(entity.getCrclmNm());
        dto.setContent(entity.getCrclmCn());
        dto.setUserSn(entity.getCoSn());
        dto.setSurveyStart(entity.getRecruitBgngDt());
        dto.setSurveyEnd(entity.getRecruitEndDt());
        dto.setStartDate(entity.getCrclmBgngYmd());
        dto.setEndDate(entity.getCrclmEndYmd());
        dto.setScope(entity.getCohortSttsNm());

        // Enum -> Stringt 변환
        dto.setType(entity.getCohortCate() == null ? null : entity.getCohortCate().name());

        dto.setClassStart(entity.getAttendStartTm());
        dto.setClassEnd(entity.getAttendEndTm());

        return dto;
    }
}
