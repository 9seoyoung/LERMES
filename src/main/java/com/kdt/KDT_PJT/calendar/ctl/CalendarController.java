package com.kdt.KDT_PJT.calendar.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.calendar.dto.CalendarDetailResponseDTO;
import com.kdt.KDT_PJT.calendar.dto.CalendarListResponseDTO;
import com.kdt.KDT_PJT.calendar.dto.CalendarRequestDTO;
import com.kdt.KDT_PJT.calendar.dto.CalendarSimpleResponseDTO;
import com.kdt.KDT_PJT.calendar.service.CalendarService;
import com.kdt.KDT_PJT.cmmn.map.CmmnMap;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/calendar")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CalendarController {
    private final CalendarService calendarService;

//
//    @PostMapping("/")
//    public CalendarRequestDTO
    //TODO AuthCustomUserDetails me 받아서 서비스에서 분기(관리자인지, 유저(학생,교사)인지 판단)
    // me.getRoleType() 하면 로그인된 유저의 roleType 반환됨
    // 값이 3 이하이면 관리자니까 해당 그걸로 넘어감
    // +) @PreAuthorize("hasRole('INSTRUCTOR')") 이거 쓰면 500번대 예외임. 예외 핸들러 만들어서 그 예외 받아서 메시지 보내는거 하면됨
    // @PreAuthorize("hasAnyRole('INSTRUCTOR', 'STUDENT')") 지금 세션의 권한이 이거중에 하나인지 여러개중의 하나 아니면 에러 띄울수있음
    // AttendExceptionHandler.java 참고하기

    @PostMapping
    public ResponseEntity<CalendarDetailResponseDTO> createCalendar(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @RequestBody CalendarRequestDTO req
    ) {
        // 개인/공식 분기 및 권한 체크는 서비스에서 처리
        CalendarDetailResponseDTO resp = calendarService.createCalendar(me, req);
        return ResponseEntity.ok(resp);
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<CalendarDetailResponseDTO> getCalendar() {
//        return ResponseEntity.ok();
//    }
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','EMPLOYEE','INSTRUCTOR','STUDENT')")
    @GetMapping(params = {"year", "month"})         //기간 파라미터 있는 경우 YYYYMMDD
    public ResponseEntity<List<CalendarSimpleResponseDTO>> getCalendarByRange(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @RequestParam(required = false) Integer cohortSn, // 직원등급 이상이면 기수번호 특정해서 요청해야함
            @RequestParam Integer year,
            @RequestParam Integer month,
            @RequestParam(required = false) Integer day,
            @RequestParam(required = false) Boolean isPrivate
            // null: 전체, true: 개인, false: 공식
    ){
        Integer roleType = me.getRoleType().intValue();
        if(roleType == 4 || roleType == 5){     // 강사 or 학생
            cohortSn = me.getCohortSn().intValue(); //자신의 기수를 넣음 이 기수로 긁어올거임
        }

        // 2. DTO 생성 및 공통 필드 세팅
        CalendarSimpleResponseDTO params = CalendarSimpleResponseDTO.builder()
                .cohortSn(cohortSn)
                .userSn(me.getId().intValue())
                .prvtYn(isPrivate != null ? (isPrivate ? (byte) 1 : (byte) 0) : null)
                .build();

        // 3. DATETIME 검색 범위 계산 및 설정 로직
        LocalDateTime searchStartDate;
        LocalDateTime searchEndDate;

        if (day != null){ //일별 검색 메서드 실행
            // 검색용 값) 해당 일자의 시작시각, 익일 00:00:00 제작
            LocalDate targetDay = LocalDate.of(year, month, day);

            // [start, end) : 해당일 00:00:00 ~ 다음날 00:00:00 직전
            LocalDateTime startInclusive = targetDay.atStartOfDay();
            LocalDateTime endExclusive   = targetDay.plusDays(1).atStartOfDay();
            System.out.println("일 단위 함수 실행");
            System.out.println("startInclusive = " + startInclusive);
            System.out.println("endExclusive = " + endExclusive);

            //검색 값 DTO에 실어줌
            params.setSearchStartDate(startInclusive);  // 해당 값 이상
            params.setSearchEndDate(endExclusive);      // 해당 값 미만

            List<CalendarSimpleResponseDTO> response = calendarService.getCalendarForDay(params);
            return ResponseEntity.ok(response);

        } else {          //월별 검색 메서드 실행
            // 검색용 값 ) 해당 월의 시작, 익월 00:00:00 제작
            YearMonth ym = YearMonth.of(year, month);

            // [start, end) : 해당월 1일 00:00:00 ~ 다음달 1일 00:00:00 직전
            LocalDateTime startInclusive = ym.atDay(1).atStartOfDay();
            LocalDateTime endExclusive   = ym.plusMonths(1).atDay(1).atStartOfDay();
            System.out.println("월 단위 조회 함수 실행");
            System.out.println("startInclusive = " + startInclusive);
            System.out.println("endExclusive = " + endExclusive);

            //검색 값 DTO에 실어줌
            params.setSearchStartDate(startInclusive);
            params.setSearchEndDate(endExclusive);

            List<CalendarSimpleResponseDTO> response = calendarService.getCalendarForMonth(params);
            return ResponseEntity.ok(response);
        }
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','TENANT_ADMIN','EMPLOYEE','INSTRUCTOR','STUDENT')")
    @GetMapping(params = {"!year", "!month", "!day"})//기간 파라미터 없는 경우 TODO 얘 해야함. 기간없이 리스트로 반환해주는거, 그리고 본문까지 확인 가능한 detail보기 컨트롤러도 만들어야함.
    public ResponseEntity<List<CalendarListResponseDTO>> getCalendarListAll(
            @AuthenticationPrincipal AuthCustomUserDetails me,
            @RequestParam(required = false) Integer cohortSn, // 직원등급 이상이면 특정해서 요청해야함
            @RequestParam(required = false) Boolean isPrivate
            // null: 전체, true: 개인, false: 공식
    ){
        // 강사 학생은 코호트번호 가져옴
        Integer roleType = me.getRoleType().intValue();
        if(roleType == 4 || roleType == 5){     // 강사 or 학생
            cohortSn = me.getCohortSn().intValue(); //자신의 기수를 넣음 이 기수로 긁어올거임
        }

        // 검색용 DTO 생성
        CalendarSimpleResponseDTO params = CalendarSimpleResponseDTO.builder()
                .cohortSn(cohortSn)
                .userSn(me.getId().intValue())
                .prvtYn(isPrivate != null ? (isPrivate ? (byte) 1 : (byte) 0) : null)
                .build();

        System.out.println("cohortSn = " + cohortSn);

//        if(params.getCohortSn() == null){ //기수번호 없다면 (안실어서 보냇거나 기수번호 뽑았는데 없거나)
//            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기수 번호 갖고 오이소");
//        }
        // 기수에서 말고 그냥 내 개인 리스트 조회 할수도있으니까 없애기

        return ResponseEntity.ok(calendarService.getCalendarList(params));
    }

    /*
    * 일정 상세보기, 조회수 +1 하면서 일정 받아옴
    * 권한체크는 안하겠음 추후 접근권한 비교 로직 추가 필요*/
    @GetMapping("/{calSn}")
    public ResponseEntity<CalendarDetailResponseDTO> getCalendarDetailByCalSn(@PathVariable Integer calSn){
        return ResponseEntity.ok(calendarService.getCalendarDetailByCalSn(calSn));
    }
}
