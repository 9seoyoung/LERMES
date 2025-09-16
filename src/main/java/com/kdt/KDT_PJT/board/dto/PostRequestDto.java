package com.kdt.KDT_PJT.board.dto;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostRequestDto {
    private Long bbsId;                 // 게시판 ID (FK)
    private String bbsTtl;             // 게시물 제목
    private String bbsCn;              // 게시물 내용
    private String bbsStartDate;
    ////    게시판 유형 선택(공지 / 자료실 / 설문 / FAQ / 문의 / 임시저장) not null
//    private String boardType;
//    private String title;
//    private LocalDate startDate;
//    private LocalDate endDate;
//    private String content;
////    공개범위 선택(권한별) not null
//    private int viibilityCode;
////    하위그룹(10기/11기/12기)
//    private int generationId
    private List<MultipartFile> files;  // 첨부파일들 (선택)
}

