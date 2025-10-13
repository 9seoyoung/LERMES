package com.kdt.KDT_PJT.bbsList.service;

import com.kdt.KDT_PJT.bbsList.dto.BbsListResponseDto;
import com.kdt.KDT_PJT.bbsList.mapper.BbsListMapper;
import com.kdt.KDT_PJT.survey.mapper.SurveyMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BbsListService {

    private final BbsListMapper bbsListMapper;

    public List<BbsListResponseDto> getBbsList(Long coSn, Long cohortSn, Long userSn) {
        return bbsListMapper.findBbsList(coSn, cohortSn, userSn);
    }
}
