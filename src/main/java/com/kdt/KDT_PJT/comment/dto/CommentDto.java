package com.kdt.KDT_PJT.comment.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto {

    private Long cmntSn;                 // 댓글 일련번호 (PK)
    private Long postSn;                 // 게시물 일련번호 (FK)
    private String cmntCn;                  // 댓글 내용
    private Long cmntWrtrSn;                // 댓글 작성자 일련번호 (FK)
    private LocalDateTime cmntFrstWrtDt;    // 댓글 최초 작성일시
    private LocalDateTime cmntLastMdfcnDt;  // 댓글 최종 수정일시
    private Boolean delYn;                  // 삭제 여부 (0=false, 1=true)
    private Long parentCmntSn;           // 대댓글 / NULL이면 원댓글
}
