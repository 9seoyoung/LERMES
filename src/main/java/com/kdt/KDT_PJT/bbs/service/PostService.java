package com.kdt.KDT_PJT.bbs.service;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.bbs.dto.PostRequestDto;
import com.kdt.KDT_PJT.bbs.dto.PostResponseDto;
import com.kdt.KDT_PJT.bbs.enums.BbsScope;
import com.kdt.KDT_PJT.bbs.enums.BbsType;
import com.kdt.KDT_PJT.bbs.enums.BbsRole;
import com.kdt.KDT_PJT.bbs.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.Objects;

@Slf4j
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

        // 작성일자
        LocalDateTime now = LocalDateTime.now();
        requestDto.setPostFrstWrtDt(now);
        requestDto.setPostLastMdfcnDt(now);

        String uuid = UUID.randomUUID().toString();
        postMapper.insertPost(requestDto, uuid);
        return postMapper.findById(requestDto.getPostSn());
    }

    // 🔹 공통 권한 체크 로직 (분리 전 로직 유지)
    private boolean canAccessPost(PostResponseDto post,
                                  AuthCustomUserDetails auth,
                                  Long filterCohortSn, String filterBbsType) {
        BbsRole role = resolveRole(auth);
        BbsType type = post.getBbsType();
        BbsScope scope = post.getBbsScope();

        // 1. bbsType 필터
        if (filterBbsType != null) {
            try {
                BbsType filterType = BbsType.valueOf(filterBbsType.toUpperCase());
                if (!type.equals(filterType)) return false;
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("잘못된 게시판 유형(영문): " + filterBbsType);
            }
        }

        // 2. Role 권한 체크
        if (!role.canRead(type)) return false;

        if (type == BbsType.QNA) {
            if (role == BbsRole.GENERAL) {
                return Objects.equals(post.getPostWrtrSn(), auth.getId());
            }
            if (role == BbsRole.TENANT || role == BbsRole.EMPLOYEE
                    || role == BbsRole.SUPER_ADMIN || role == BbsRole.INSTRUCTOR) {
                return true;
            }
        }

        // 3. Scope 권한 체크
        if (scope == BbsScope.PUBLIC) {
            if (type == BbsType.NOTICE) {
                return true; // 공지 + PUBLIC → Visitor도 열람 가능
            }
            return auth != null && auth.isEnabled();
        }
        if (auth == null || !auth.isEnabled()) return false;

        log.info("check role={}, post.coSn={}, auth.coSn={}, post.cohortSn={}, auth.cohortSn={}",
                role, post.getCoSn(), auth.getCompanySn(), post.getCohortSn(), auth.getCohortSn());

        return switch (scope) {
            case PRIVATE -> Objects.equals(post.getPostWrtrSn(), auth.getId());
            case COMPANY -> Objects.equals(post.getCoSn(), auth.getCompanySn());
            case COHORT -> {
                if (role == BbsRole.SUPER_ADMIN || role == BbsRole.TENANT || role == BbsRole.EMPLOYEE) {
                    yield Objects.equals(post.getCoSn(), auth.getCompanySn())
                            && (filterCohortSn == null || post.getCohortSn().equals(filterCohortSn));
                } else if (role == BbsRole.INSTRUCTOR || role == BbsRole.STUDENT) {
                    // 강사와 학생은 같은 로직: 같은 회사 && 같은 코호트면 조회 허용
                    yield Objects.equals(post.getCoSn(), auth.getCompanySn())
                            && Objects.equals(post.getCohortSn(), auth.getCohortSn());
                } else yield false;

            }
            default -> false;
        };
    }

    // 🔹 단건 조회 전용 권한 체크 메서드 (신규 추가)
    private boolean canAccessPostForSingle(PostResponseDto post, AuthCustomUserDetails auth) {
        return canAccessPost(post, auth, auth.getCohortSn(), post.getBbsType().name());
    }

    // 🔹 리스트 조회 전용 권한 체크 메서드 (신규 추가)
    private boolean canAccessPostForList(PostResponseDto post,
                                         AuthCustomUserDetails auth,
                                         Long filterCohortSn,
                                         String filterBbsType) {
        return canAccessPost(post, auth, filterCohortSn, filterBbsType);
    }

    // 수정/삭제 권한 체크
    private boolean canModifyPost(PostResponseDto post, AuthCustomUserDetails auth) {
        BbsRole role = resolveRole(auth);

        if (role == BbsRole.SUPER_ADMIN || role == BbsRole.TENANT) {
            return true;
        }
        return  Objects.equals(post.getPostWrtrSn(), auth.getId());
    }

    // 게시글 목록 조회
    public List<PostResponseDto> getPosts(AuthCustomUserDetails auth, Long filterCohortSn, String filterBbsType) {
        BbsRole role = resolveRole(auth);

        Long companySn = auth.getCompanySn();
        if (role == BbsRole.SUPER_ADMIN) {
            companySn = null;
        }

        List<PostResponseDto> posts = postMapper.findByFilters(companySn, filterCohortSn, filterBbsType);

        return posts.stream()
                .filter(post -> canAccessPostForList(post, auth, filterCohortSn, filterBbsType))
                .toList();
    }

    // 게시글 단건 조회
    @Transactional
    public PostResponseDto getPost(Long postSn, AuthCustomUserDetails auth) {
        // 1. 조회수 먼저 증가
        postMapper.increaseViewCnt(postSn);

        // 2. 글 상세 가져오기
        PostResponseDto post = postMapper.findById(postSn);

        if (post == null) {
            throw new NoSuchElementException("게시글 없음: postSn=" + postSn);
        }

        // 3. 권한 체크
        if (!canAccessPostForSingle(post, auth)) {
            throw new AccessDeniedException("조회 권한 없음");
        }

        // 4. 최신 조회수 포함된 데이터 리턴
        return post;
    }

    // 게시글 수정
    public PostResponseDto updatePost(PostRequestDto requestDto, AuthCustomUserDetails auth) {
        PostResponseDto existing = postMapper.findById(requestDto.getPostSn());

        if (!canModifyPost(existing, auth)) {
            throw new AccessDeniedException("수정 권한 없음");
        }

        requestDto.setPostLastMdfcnDt(LocalDateTime.now());
        postMapper.updatePost(requestDto);
        return postMapper.findById(requestDto.getPostSn());
    }

    // 게시글 삭제 (Soft Delete)
    public void deletePost(Long postSn, AuthCustomUserDetails auth) {
        PostResponseDto existing = postMapper.findById(postSn);

        if (!canModifyPost(existing, auth)) {
            throw new AccessDeniedException("삭제 권한 없음");
        }

        postMapper.softDelete(postSn);
    }

    private BbsRole resolveRole(AuthCustomUserDetails auth) {
        if (auth == null || !auth.isEnabled()) {
            return BbsRole.VISITOR;
        }
        BbsRole role = BbsRole.fromCode(auth.getRoleType());
        log.info("Resolved Role: {}, from roleType={}", role, auth.getRoleType());
        return role;
    }
}
