package com.kdt.KDT_PJT.bbs.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.bbs.dto.PostRequestDto;
import com.kdt.KDT_PJT.bbs.dto.PostResponseDto;
import com.kdt.KDT_PJT.bbs.enums.BbsScope;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.bbs.enums.BbsRole;
import com.kdt.KDT_PJT.bbs.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostMapper postMapper;

    // 게시글 등록
    public PostResponseDto createPost(PostRequestDto requestDto, AuthCustomUserDetails auth) {
        BbsRole role = resolveRole(auth);
        BbsType type = requestDto.getBbsType();

        if (!role.canCreate(type)) {
            throw new AccessDeniedException("작성 권한 없음");
        }
//      작성일자
        LocalDateTime now = LocalDateTime.now();
        requestDto.setPostFrstWrtDt(now);
        requestDto.setPostLastMdfcnDt(now);

        String uuid = UUID.randomUUID().toString();
        postMapper.insertPost(requestDto, uuid);
        return postMapper.findById(requestDto.getPostSn());
    }

    // 게시글 단건 조회
    public PostResponseDto getPost(Long postSn, AuthCustomUserDetails auth) {
        PostResponseDto post = postMapper.findById(postSn);

        if (!canAccessPost(post, auth, null, null)) {
            throw new AccessDeniedException("조회 권한 없음");
        }
        return post;
    }

    // 게시글 목록 조회
    public List<PostResponseDto> getPosts(AuthCustomUserDetails auth, Long filterCohortSn, String filterBbsType) {
        List<PostResponseDto> posts = postMapper.findAll(); // 또는 findAllByCohort
        return posts.stream()
                .filter(post -> canAccessPost(post, auth, filterCohortSn, filterBbsType))
                .toList();
    }


    // 게시글 수정
    public PostResponseDto updatePost(PostRequestDto requestDto, AuthCustomUserDetails auth) {
        PostResponseDto existing = postMapper.findById(requestDto.getPostSn());

        if (!canAccessPost(existing, auth, null, null)) { // 권한/Scope 체크 통일
            throw new AccessDeniedException("수정 권한 없음");
        }

        requestDto.setPostLastMdfcnDt(LocalDateTime.now());

        postMapper.updatePost(requestDto);
        return postMapper.findById(requestDto.getPostSn());
    }

    // 게시글 삭제 (Soft Delete)
    public void deletePost(Long postSn, AuthCustomUserDetails auth) {
        PostResponseDto existing = postMapper.findById(postSn);
        BbsRole role = resolveRole(auth);
        BbsType type = existing.getBbsType();
        BbsScope scope = existing.getBbsScope();

        // PRIVATE → 본인만
        if (scope == BbsScope.PRIVATE) {
            if (!existing.getPostWrtrSn().equals(auth.getId())) {
                throw new AccessDeniedException("비공개 글은 본인만 삭제 가능");
            }
        }
        // 공지/FAQ/자료실/QNA → 관리자 or 작성자 본인
        else if (type == BbsType.CLASS_MATERIAL || type == BbsType.QNA
                || type == BbsType.NOTICE || type == BbsType.FAQ) {
            if (!(role == BbsRole.SUPER_ADMIN || role == BbsRole.TENANT || role == BbsRole.EMPLOYEE)) {
                if (!existing.getPostWrtrSn().equals(auth.getId())) {
                    throw new AccessDeniedException("본인만 삭제 가능");
                }
            }
        }
        // 그 외 → 본인만
        else {
            if (!existing.getPostWrtrSn().equals(auth.getId())) {
                throw new AccessDeniedException("본인만 삭제 가능");
            }
        }

        postMapper.softDelete(postSn);
    }

    // 공통 권한 + Scope 체크
    private boolean canAccessPost(PostResponseDto post, AuthCustomUserDetails auth,
                                  Long filterCohortSn, String filterBbsType) {

        BbsRole role = resolveRole(auth);
        BbsType type = post.getBbsType();
        BbsScope scope = post.getBbsScope();

        // 1. bbsType 필터
        if (filterBbsType != null) {
            try {
                BbsType filterType = BbsType.valueOf(filterBbsType.toUpperCase()); //
                if (!type.equals(filterType)) return false;
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("잘못된 게시판 유형(영문): " + filterBbsType);
            }
        }

        // 2. Role 권한 체크
        if (!role.canRead(type)) return false;

        if (type == BbsType.QNA) {
            if (role == BbsRole.GENERAL) {
                return post.getPostWrtrSn().equals(auth.getId()); // General은 자기 글만
            }
            if (role == BbsRole.TENANT || role == BbsRole.EMPLOYEE || role == BbsRole.SUPER_ADMIN) {
                return true; // 관리자/직원/슈퍼어드민은 모든 QNA 열람 가능
            }
        }

        // 3. Scope 권한 체크
        if (scope == BbsScope.PUBLIC) {
            if (type == BbsType.NOTICE) {
                return true; //  공지 + PUBLIC → Visitor도 열람 가능
            }
            return auth != null && auth.isEnabled(); // FAQ/자료실/QnA는 로그인 필요
        }
        if (auth == null || !auth.isEnabled()) return false;


        return switch (scope) {
            case PRIVATE -> post.getPostWrtrSn().equals(auth.getId());
            case COMPANY -> post.getCoSn().equals(auth.getCompanySn());
            case COHORT -> {
                if (role == BbsRole.SUPER_ADMIN || role == BbsRole.TENANT || role == BbsRole.EMPLOYEE) {
                    yield post.getCoSn().equals(auth.getCompanySn())
                            && (filterCohortSn == null || post.getCohortSn().equals(filterCohortSn));
                } else {
                    yield post.getCoSn().equals(auth.getCompanySn())
                            && post.getCohortSn().equals(auth.getCohortSn());
                }
            }
            default -> false;
        };
    }

    private BbsRole resolveRole(AuthCustomUserDetails auth) {
        if (auth == null || !auth.isEnabled()) {
            return BbsRole.VISITOR;
        }
        return BbsRole.fromCode(auth.getRoleType());
    }
}
