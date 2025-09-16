package com.kdt.KDT_PJT.calendar.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.calendar.dto.CalendarRequestDTO;
import com.kdt.KDT_PJT.file.dto.UploadResultDTO;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CalendarController {

//
//    @PostMapping("/")
//    public CalendarRequestDTO
    //TODO AuthCustomUserDetails me 받아서 서비스에서 분기(관리자인지, 유저(학생,교사)인지 판단)
    // me.getRoleType() 하면 로그인된 유저의 roleType 반환됨
    // 값이 3 이하이면 관리자니까 해당 그걸로 넘어감
    // +) @PreAuthorize("hasRole('INSTRUCTOR')") 이거 쓰면 500번대 예외임. 예외 핸들러 만들어서 그 예외 받아서 메시지 보내는거 하면됨
    // @PreAuthorize("hasAnyRole('INSTRUCTOR', 'STUDENT')") 지금 세션의 권한이 이거중에 하나인지 여러개중의 하나 아니면 에러 띄울수있음
    // AttendExceptionHandler.java 참고하기
}
