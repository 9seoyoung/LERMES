package com.kdt.KDT_PJT.bbs.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostRequestDto {
    private Long postSn;        // 게시물 일련번호 (PK, 수정/삭제 시 필요)
    private String bbsNm;       // 게시판 이름/유형
    private String postTtl;     // 게시물 제목
    private String postCn;      // 게시물 내용
    private Long postWrtrSn;    // 작성자 일련번호 (세션에서 꺼내서 넣을 수도 있음)
    private Long coSn;          // 회사 일련번호 (FK)
    private Long cohortSn;      // 기수/과정 일련번호 (FK)
    private String bbsType;     // 게시판 유형 (공지, 자료실, FAQ, 문의, 임시저장)
    private String bbsScope;    // 공개 범위 (전체, 회사, 기수, 비공개)

}
