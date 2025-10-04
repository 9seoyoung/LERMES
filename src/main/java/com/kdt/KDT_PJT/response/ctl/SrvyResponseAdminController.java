package com.kdt.KDT_PJT.response.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.response.dto.SrvyResponseResponseDto;
import com.kdt.KDT_PJT.response.service.SrvyResponseAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/surveys/{srvySn}/responses")
public class SrvyResponseAdminController {

    private final SrvyResponseAdminService srvyResponseAdminService;

    @GetMapping
    public ResponseEntity<List<SrvyResponseResponseDto>> getSurveyResponses(
            @PathVariable Long srvySn,
            @RequestParam(required = false) Long coSn,       // 회사 필터
            @RequestParam(required = false) Long cohortSn,   // 코호트 필터
            @AuthenticationPrincipal AuthCustomUserDetails auth) {

        Long userSn = auth.getId();
        Long roleId = auth.getRoleType();
        Long authCoSn = auth.getCompanySn();
        Long authCohortSn = auth.getCohortSn();

        List<SrvyResponseResponseDto> result =
                srvyResponseAdminService.getSurveyResponses(srvySn, roleId, userSn, coSn, cohortSn, authCoSn, authCohortSn);

        return ResponseEntity.ok(result);
    }
}
