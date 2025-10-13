package com.kdt.KDT_PJT.comment.mapper;

import com.kdt.KDT_PJT.comment.dto.CommentDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommentMapper {

    // 댓글 등록
    void insertComment(@Param("dto") CommentDto dto);

    // 게시글 기준 댓글 전체 조회
    List<CommentDto> findCommentsByPost(@Param("postSn") Long postSn);

    // 댓글 단건 조회
    CommentDto findCommentById(@Param("cmntSn") Long cmntSn);

    // 댓글 수정
    void updateComment(@Param("dto") CommentDto dto);

    // 댓글 삭제 (Soft Delete)
    void softDeleteComment(@Param("cmntSn") Long cmntSn,
                           @Param("userSn") Long userSn);
    List<CommentDto> findRepliesByParent(@Param("parentCmntSn") Long parentCmntSn);
}
