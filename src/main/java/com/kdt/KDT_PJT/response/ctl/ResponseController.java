package com.kdt.KDT_PJT.response.ctl;

import com.kdt.KDT_PJT.response.dto.RequestResponseDto;
import com.kdt.KDT_PJT.response.dto.ResponseResponseDto;
import com.kdt.KDT_PJT.response.service.ResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/responses")
@RequiredArgsConstructor
public class ResponseController {

    private final ResponseService responseService;

    // 등록
    @PostMapping
    public String createResponse(@RequestBody RequestResponseDto dto) {
        responseService.createResponse(dto);
        return "등록 성공";
    }

    // 단건 조회
    @GetMapping("/{rspnsSn}")
    public ResponseResponseDto getResponse(@PathVariable Long rspnsSn) {
        return responseService.getResponse(rspnsSn);
    }

    // 부모 기준 리스트 조회
    @GetMapping
    public List<ResponseResponseDto> getResponsesByParent(@RequestParam Long parentSn,
                                                          @RequestParam String parentType) {
        return responseService.getResponsesByParent(parentSn, parentType);
    }
}
