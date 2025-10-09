package com.kdt.KDT_PJT.adminBoardList.ctl;

import com.kdt.KDT_PJT.adminBoardList.dto.AdminBoardListDTO;
import com.kdt.KDT_PJT.adminBoardList.service.AdminBoardListService;
import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AdminBoardListController {

    private final AdminBoardListService adminBoardListService;

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','EMPLOYEE')")
    @GetMapping("/boardList/{cohortSn}")
    public ResponseEntity<List<AdminBoardListDTO>> getAdminBoardListByCohortSn(@AuthenticationPrincipal AuthCustomUserDetails me,
                                                                               @PathVariable Integer cohortSn){
//        Integer coSn = me.getCompanySn().intValue();


        return ResponseEntity.ok(adminBoardListService.getAdminBoardListByCohortSn(cohortSn));
    }
}
