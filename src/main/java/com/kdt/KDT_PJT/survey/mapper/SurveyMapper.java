package com.kdt.KDT_PJT.survey.mapper;

import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.survey.dto.RequestSurveyDto;
import com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SurveyMapper {

    void insertSurvey(@Param("dto") RequestSurveyDto dto,
                      @Param("uuid") String uuid);


    ResponseSurveyDto findSurveyById(@Param("srvySn") Long srvySn);

    void increaseViewCnt(@Param("srvySn") Long srvySn);


    List<ResponseSurveyDto> findSurveyList(@Param("coSn") Long coSn,
                                                    @Param("cohortSn") Long cohortSn,
                                                    @Param("bbsType") BbsType bbsType);



    void updateSurveyOwner(@Param("srvySn") Long srvySn, @Param("dto") RequestSurveyDto dto);


    void updateSurveyByAdmin(@Param("srvySn") Long srvySn, @Param("dto") RequestSurveyDto dto);


    void softDeleteSurvey(@Param("srvySn") Long srvySn,
                          @Param("userSn") Long userSn);

    void softDeleteSurveyByAdmin(@Param("srvySn") Long srvySn);

}



