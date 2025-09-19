package com.kdt.KDT_PJT.survey.ctl;

import com.kdt.KDT_PJT.survey.dto.RequestSurveyDto;
//import com.kdt.KDT_PJT.survey.service.SurveyService;
import com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto;
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
    @PostMapping("/post")
    public ResponseEntity<ResponseSurveyDto> createSurvey(@RequestBody RequestSurveyDto requestDto) {
        ResponseSurveyDto responseDto = surveyService.createSurvey(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    // 설문 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<ResponseSurveyDto> getSurvey(@PathVariable("id") Long id) {
        return ResponseEntity.ok(surveyService.getSurvey(id));
    }

    // 회사별 설문 목록 조회
    @GetMapping("/list/{coSn}")
    public ResponseEntity<List<ResponseSurveyDto>> getSurveyList(@PathVariable("coSn") Long coSn) {
        return ResponseEntity.ok(surveyService.getSurveyList(coSn));
    }

    // 설문 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateSurvey(@PathVariable("id") Long id,
                                               @RequestBody RequestSurveyDto requestDto) {
        surveyService.updateSurvey(id, requestDto);
        return ResponseEntity.ok("수정 성공");
    }

}
