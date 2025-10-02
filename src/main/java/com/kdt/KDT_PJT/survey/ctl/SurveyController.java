package com.kdt.KDT_PJT.survey.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.survey.dto.RequestSurveyDto;
import com.kdt.KDT_PJT.survey.dto.ResponseSurveyDto;
import com.kdt.KDT_PJT.survey.service.SurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/survey")
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
    @GetMapping("/{srvySn}")
    public ResponseEntity<ResponseSurveyDto> getSurvey(@PathVariable Long srvySn) {
        return ResponseEntity.ok(surveyService.getSurvey(srvySn));
    }

    // 목록 조회
    @GetMapping("list/{coSn}")
    public ResponseEntity<List<ResponseSurveyDto>> getSurveyList(
            @PathVariable Long coSn,
            @RequestParam(value = "cohortSn", required = false) Long cohortSn,
            @RequestParam(value = "bbsType", required = false) BbsType bbsType
    ) {
        return ResponseEntity.ok(surveyService.getSurveyList(coSn, cohortSn, bbsType));
    }

    // 설문 수정
    @PutMapping("/{srvySn}")
    public ResponseEntity<String> updateSurvey(@PathVariable Long srvySn,
                                               @RequestBody RequestSurveyDto requestDto,
                                               @AuthenticationPrincipal AuthCustomUserDetails auth) {
        Long userSn = auth.getId();       // 유저 ID
        Long roleId = auth.getRoleType(); // 롤 타입 (숫자)
        surveyService.updateSurvey(srvySn, requestDto, userSn, roleId);
        return ResponseEntity.ok("수정 성공");
    }

}
