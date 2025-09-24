package com.kdt.KDT_PJT.bbs.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.bbs.dto.PostRequestDto;
import com.kdt.KDT_PJT.bbs.dto.PostResponseDto;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.bbs.enums.BbsRole;
import com.kdt.KDT_PJT.bbs.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;

    // 게시글 등록
    public PostResponseDto createPost(PostRequestDto requestDto, Authentication auth) {
        BbsRole role = resolveRole(auth);  //
        BbsType type = BbsType.fromDescription(requestDto.getBbsType());

        if (!role.canCreate(type)) {
            throw new AccessDeniedException("작성 권한 없음");
        }

        // UUID 생성
        String uuid = UUID.randomUUID().toString();

        // DB에 저장 (UUID 포함)
        postMapper.insertPost(requestDto, uuid);

        return postMapper.findById(requestDto.getPostSn());
    }

    // 게시글 단건 조회
    public PostResponseDto getPost(Long postSn, Authentication auth) {
        BbsRole role = resolveRole(auth);
        PostResponseDto post = postMapper.findById(postSn);
        BbsType type = BbsType.fromDescription(post.getBbsType());

        if (!role.canRead(type)) {
            throw new AccessDeniedException("조회 권한 없음");
        }

        // PRIVATE 본인 여부
        if (type == BbsType.PRIVATE) {
            AuthCustomUserDetails user = (AuthCustomUserDetails) auth.getPrincipal();
            if (!post.getPostWrtrSn().equals(user.getUserSn())) {
                throw new AccessDeniedException("비공개 글은 본인만 조회 가능");
            }
        }

        return post;
    }

    // 게시글 목록 조회
    public List<PostResponseDto> getPosts(Authentication auth) {
        BbsRole role = resolveRole(auth);
        List<PostResponseDto> posts = postMapper.findAll();

        // 권한 필터링
        return posts.stream()
                .filter(post -> {
                    BbsType type = BbsType.fromDescription(post.getBbsType());
                    if (!role.canRead(type)) return false;

                    if (type == BbsType.PRIVATE) {
                        if (!(auth.getPrincipal() instanceof AuthCustomUserDetails user)) return false;
                        return post.getPostWrtrSn().equals(user.getUserSn());
                    }
                    return true;
                })
                .toList();
    }

    // 게시글 수정
    public PostResponseDto updatePost(PostRequestDto requestDto, Authentication auth) {
        BbsRole role = resolveRole(auth);
        PostResponseDto existing = postMapper.findById(requestDto.getPostSn());
        BbsType type = BbsType.fromDescription(existing.getBbsType());

        if (!role.canUpdate(type)) {
            throw new AccessDeniedException("수정 권한 없음");
        }

        if (type == BbsType.PRIVATE) {
            AuthCustomUserDetails user = (AuthCustomUserDetails) auth.getPrincipal();
            if (!existing.getPostWrtrSn().equals(user.getUserSn())) {
                throw new AccessDeniedException("본인만 수정 가능");
            }
        }

        postMapper.updatePost(requestDto);
        return postMapper.findById(requestDto.getPostSn());
    }

    // 게시글 삭제 (Soft Delete)
    public void deletePost(Long postSn, Authentication auth) {
        BbsRole role = resolveRole(auth);
        PostResponseDto existing = postMapper.findById(postSn);
        BbsType type = BbsType.fromDescription(existing.getBbsType());

        if (!role.canDelete(type)) {
            throw new AccessDeniedException("삭제 권한 없음");
        }

        if (type == BbsType.PRIVATE) {
            AuthCustomUserDetails user = (AuthCustomUserDetails) auth.getPrincipal();
            if (!existing.getPostWrtrSn().equals(user.getUserSn())) {
                throw new AccessDeniedException("본인만 삭제 가능");
            }
        }

        postMapper.softDelete(postSn);
    }

    // 현재 사용자 Role 확인
    private BbsRole resolveRole(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return BbsRole.VISITOR;
        }
        if (auth.getPrincipal() instanceof AuthCustomUserDetails user) {
            return BbsRole.valueOf(user.getRole().name());
        }
        return BbsRole.VISITOR;
    }
}
