package com.kdt.KDT_PJT.cerfifi.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.calendar.dto.CalendarRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/certifi")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class certifiController {

//    @PostMapping
//    public ResponseEntity<> createCalendar(
//            @AuthenticationPrincipal AuthCustomUserDetails me,
//            @RequestBody CalendarRequestDTO req
//    ) {
//        ResponseEntity<>
//    }
}
