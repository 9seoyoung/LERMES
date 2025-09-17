package com.kdt.KDT_PJT.board.dto;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//public class PostRequestDto {
//    private Long bbsId;                 // 게시판 ID (FK)
//    private String bbsTtl;              // 게시물 제목
//    private String bbsCn;               // 게시물 내용
//    @DateTimeFormat(pattern = "yyyy-MM-dd")
//    private LocalDate bbsStartDate;
//    @DateTimeFormat(pattern = "yyyy-MM-dd")
//    private LocalDate bbsEndDate;
//    ////    게시판 유형 선택(공지 / 자료실 / 설문 / FAQ / 문의 / 임시저장) not null
//    private String bbsType;
//////    공개범위 선택(권한별) not null
//    private String bbsSharingScope;
//////    하위그룹 (10기/11기/12기)
//    private Long cohortSn;
//    private List<MultipartFile> files;  // 첨부파일들 (선택)
//}

public class PostRequestDto {
    private String bbsNm;      // 게시판 이름 (DB는 SN이 아니라 NM)
    private String bbsTtl;     // 게시물 제목
    private String bbsCn;      // 게시물 내용
    private Long postWrtrSn;   // 작성자 ID
    private Long coSn;         // 회사 ID
    private Long cohortSn;     // 기수
}