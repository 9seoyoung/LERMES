package com.kdt.KDT_PJT.domain.board;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;

@Getter
//@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Board {
    private Long id;
//    게시판 유형 선택(공지 / 자료실 / 설문 / FAQ / 문의 / 임시저장) not null
    private String boardType;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String content;
//    공개범위 선택(권한별) not null
    private int visibilityCode;
//    하위그룹(10기/11기/12기)
    private int generationId;
//    file
    private MultipartFile file;
}
