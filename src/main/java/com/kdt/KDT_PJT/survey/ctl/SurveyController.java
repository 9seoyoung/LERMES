package com.kdt.KDT_PJT.survey.ctl;

import com.kdt.KDT_PJT.cmmn.dao.CmmnDao;
import com.kdt.KDT_PJT.survey.dto.SurveyDto;
//import com.kdt.KDT_PJT.survey.service.SurveyService;
import com.kdt.KDT_PJT.survey.service.SurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/survey")
@RequiredArgsConstructor
public class SurveyController {

    private final SurveyService surveyService;

    // 설문 등록
//    @PostMapping("/post")
//    public ResponseEntity<String> createSurvey(@RequestBody SurveyDto surveyDto) {
//        surveyService.createSurvey(surveyDto);
//        return ResponseEntity.ok("등록 성공");
//    }
    @PostMapping(value = "/post")
    public SurveyDto createSurvey(@RequestBody SurveyDto surveyDto) {
        surveyService.createSurvey(surveyDto);  // DB 저장 시도
        return surveyDto; // DTO 그대로 반환 → JSON 응답
    }

    // 설문 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<SurveyDto> getSurvey(@PathVariable("id") Long id) {
        return ResponseEntity.ok(surveyService.getSurvey(id));
    }


    // 회사별 설문 목록 조회
    @GetMapping("/list/{coSn}")
    public ResponseEntity<List<SurveyDto>> getSurveyList(@PathVariable("coSn") Long coSn) {
        return ResponseEntity.ok(surveyService.getSurveyList(coSn));
    }
}
