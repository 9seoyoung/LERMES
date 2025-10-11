package com.kdt.KDT_PJT.bbsList.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.bbsList.dto.BbsListResponseDto;
import com.kdt.KDT_PJT.bbsList.service.BbsListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bbs/all")
@RequiredArgsConstructor
public class BbsListController {

    private final BbsListService bbsListService;

    //bbs+survey list
    @GetMapping("/list")
    public ResponseEntity<List<BbsListResponseDto>> getAllBbsList(@AuthenticationPrincipal AuthCustomUserDetails auth)

    {
        Long coSn=null;
        Long cohortSn=null;
        Long userSn=null;

        if (auth !=null){
            coSn=auth.getCompanySn();
            cohortSn=auth.getCohortSn();
            userSn=auth.getId();
        }
        List<BbsListResponseDto>List = bbsListService.getBbsList(coSn, cohortSn, userSn);
        return ResponseEntity.ok(List);
    }

}
