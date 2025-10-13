package com.kdt.KDT_PJT.comment.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.comment.dto.CommentDto;
import com.kdt.KDT_PJT.comment.mapper.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.kdt.KDT_PJT.bbs.enums.BbsRole;
import javax.xml.stream.events.Comment;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentMapper commentMapper;

    //댓글 등록
    @Transactional
    public CommentDto createComment(CommentDto dto) {
        commentMapper.insertComment(dto);
        return dto;
    }

    //게시글 댓글 조회
    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByPost(Long postSn) {
        return commentMapper.findCommentsByPost(postSn);
    }

    //댓글 수정
    @Transactional
    public CommentDto updateComment(CommentDto dto, AuthCustomUserDetails auth) {
        CommentDto existing = commentMapper.findCommentById(dto.getCmntSn());
        if (existing == null) {
            throw new IllegalArgumentException("존재하지 않는 댓글입니다.");
        }


        if (!Objects.equals(existing.getCmntWrtrSn(), auth.getId())) {
            throw new AccessDeniedException("본인이 작성한 댓글만 수정할 수 있습니다.");
        }

        dto.setCmntLastMdfcnDt(LocalDateTime.now());
        commentMapper.updateComment(dto);

        return commentMapper.findCommentById(dto.getCmntSn());
    }

    @Transactional
    public void deleteComment(Long cmntSn, AuthCustomUserDetails auth) {
        CommentDto existing = commentMapper.findCommentById(cmntSn);
        if (existing == null) {
            throw new IllegalArgumentException("존재하지 않는 댓글입니다.");
        }

        BbsRole role = resolveRole(auth);

        boolean isOwner = Objects.equals(existing.getCmntWrtrSn(), auth.getId());

        boolean isAdmin = role == BbsRole.SUPER_ADMIN
                || role == BbsRole.TENANT
                || role == BbsRole.EMPLOYEE;

        if (!(isOwner || isAdmin)) {
            throw new AccessDeniedException("댓글 삭제 권한이 없습니다.");
        }

        commentMapper.softDeleteComment(cmntSn, auth.getId());
    }

    // ✅ PostService와 동일한 역할 변환 메서드
    private BbsRole resolveRole(AuthCustomUserDetails auth) {
        if (auth == null || !auth.isEnabled()) {
            return BbsRole.VISITOR;
        }
        BbsRole role = BbsRole.fromCode(auth.getRoleType());
        //log.info("Resolved Role: {}, from roleType={}", role, auth.getRoleType());
        return role;
    }
}
