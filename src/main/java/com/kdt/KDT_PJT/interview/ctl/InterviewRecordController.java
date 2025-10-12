package com.kdt.KDT_PJT.interview.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.file.service.FileService;
import com.kdt.KDT_PJT.interview.dto.InterviewRecordDetailResponseDTO;
import com.kdt.KDT_PJT.interview.dto.InterviewRecordListResponseDTO;
import com.kdt.KDT_PJT.interview.dto.InterviewRecordRequestDTO;
import com.kdt.KDT_PJT.interview.service.InterviewRecordService;
import com.kdt.KDT_PJT.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/interviewRecord")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class InterviewRecordController {

    private final InterviewService interviewService;
    private final InterviewRecordService interviewRecordService;
    private final FileService fileService;

    @PostMapping()
    public void createInterviewRecord(@AuthenticationPrincipal AuthCustomUserDetails me,
                                      @RequestBody InterviewRecordRequestDTO params){ //ResponseEntity<InterviewRecordDetailResponseDTO>
        interviewRecordService.createInterviewRecord(me,params);
    }

    @GetMapping() // /api/interviewRecord도 받고 /api/interviewRecord?cohortSn=100도 받음 (관리자는 반드시 cohortSn 필수)
    public List<InterviewRecordListResponseDTO> readInterviewRecord(@AuthenticationPrincipal AuthCustomUserDetails me,
                                                                    @RequestParam (required = false) Integer cohortSn){
        return interviewRecordService.readInterviewRecord(me,cohortSn);
    }

    @GetMapping("/{itvRecordSn}")
    public ResponseEntity<InterviewRecordDetailResponseDTO> readInterviewRecordDetail(@AuthenticationPrincipal AuthCustomUserDetails me,
                                                                                      @PathVariable Integer itvRecordSn){
        return ResponseEntity.ok(interviewRecordService.readInterviewRecordDetail(me,itvRecordSn));
    }

    @DeleteMapping("/{itvRecordSn}")
    public void deleteInterviewRecord(@PathVariable Integer itvRecordSn){
        interviewRecordService.deleteInterviewRecord(itvRecordSn);
    }

}
