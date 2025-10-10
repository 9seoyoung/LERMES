package com.kdt.KDT_PJT.response.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.response.dto.SrvyRequestResponseDto;
import com.kdt.KDT_PJT.response.dto.SrvyResponseResponseDto;
import com.kdt.KDT_PJT.response.service.SrvyResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/srvy-responses")
@RequiredArgsConstructor
public class SrvyResponseController {

    //등록, 수정, 삭제 리스트 조회까지만 있음 단건조회는 따로 만들었음 
    private final SrvyResponseService srvyResponseService;

    //등록 및 수정
    @PostMapping
    public ResponseEntity<SrvyResponseResponseDto> createSrvyResponse(
            @RequestBody SrvyRequestResponseDto requestDto,
            @AuthenticationPrincipal AuthCustomUserDetails auth) {

        Long userSn = auth.getId();
        requestDto.setUserSn(userSn);

        SrvyResponseResponseDto saved = srvyResponseService.createResponse(requestDto);
        return ResponseEntity.ok(saved);
    }

     //설문 응답 리스트 조회
     // 관리자: 전체 유저 응답
     // 수강생: 본인 응답만

    @GetMapping("/{srvySn}/list")
    public ResponseEntity<List<SrvyResponseResponseDto>> getSrvyResponses(
            @PathVariable Long srvySn,
            @AuthenticationPrincipal AuthCustomUserDetails auth) {

        Long userSn = auth.getId();
        Long roleId = auth.getRoleType();

        List<SrvyResponseResponseDto> responses =
                srvyResponseService.getResponses(srvySn, roleId, userSn);

        return ResponseEntity.ok(responses);
    }

    //응답 삭제 (Soft Delete)
    //설문 마감 전까지만 삭제 가능
    //관리자 및 본인만 가능

    @DeleteMapping("/{responseSn}")
    public ResponseEntity<Void> deleteSrvyResponse(
            @PathVariable Long responseSn,
            @AuthenticationPrincipal AuthCustomUserDetails auth) {

        Long userSn = auth.getId();
        Long roleId = auth.getRoleType();

        srvyResponseService.deleteResponse(responseSn, userSn, roleId);
        return ResponseEntity.noContent().build();
    }
}
