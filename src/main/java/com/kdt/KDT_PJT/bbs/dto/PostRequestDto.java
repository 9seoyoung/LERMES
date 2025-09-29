package com.kdt.KDT_PJT.bbs.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kdt.KDT_PJT.bbs.enums.BbsScope;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostRequestDto {
    private Long postSn;        // 게시물 일련번호 (PK, 수정/삭제 시 필요)
    private String bbsNm;       // 게시판 이름/유형
    @JsonProperty("title")
    private String postTtl;     // 게시물 제목
    @JsonProperty("content")
    private String postCn;      // 게시물 내용
    @JsonProperty("userSn")
    private Long postWrtrSn;    // 작성자 일련번호 (세션에서 꺼내서 넣을 수도 있음)
    @JsonProperty("coSn")
    private Long coSn;          // 회사 일련번호 (FK)
    @JsonProperty("cohortSn")
    private Long cohortSn;      // 기수/과정 일련번호 (FK)
    @JsonProperty("type")
    private BbsType bbsType;     // 게시판 유형 (공지, 자료실, FAQ, 문의, 임시저장)
    @JsonProperty("scope")
    private BbsScope bbsScope;    // 공개 범위 (전체, 회사, 기수, 비공개)
    private LocalDateTime postFrstWrtDt;
    private LocalDateTime postLastMdfcnDt;

}


/** 프론트에서 보내는 정보
 *     id: postId.current, // 폼ID
 *     userSn: user.USER_SN, // 유저 SN
 *     title: "", //제목
 *     content: "", // 내용 => 설문조사는 JSON으로 담김
 *     type: "", // 게시글 유형
 *     scope: "", // 공개범위
 *     detailScope: "", //세부 공개 범위
 *     detailScopeNm: "", //세부 공개 범위 이름
 *     surveyStart: "",     // 설문조사
 *     surveyEnd: "",   // 설문조사
 *     files: files // 파일 배열
 *
 * */