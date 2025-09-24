package com.kdt.KDT_PJT.bbs.ctl;

import com.kdt.KDT_PJT.bbs.dto.PostRequestDto;
import com.kdt.KDT_PJT.bbs.dto.PostResponseDto;
import com.kdt.KDT_PJT.bbs.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;


import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    // 게시글 등록
    @PostMapping
    public ResponseEntity<PostResponseDto> createPost(@RequestBody PostRequestDto requestDto,
                                                      Authentication auth) {
        PostResponseDto responseDto = postService.createPost(requestDto, auth);
        return ResponseEntity.ok(responseDto);
    }

    // 게시글 단건 조회
    @GetMapping("/{postSn}")
    public ResponseEntity<PostResponseDto> getPost(@PathVariable Long postSn,
                                                   Authentication auth) {
        PostResponseDto responseDto = postService.getPost(postSn, auth);
        return ResponseEntity.ok(responseDto);
    }

    // 게시글 목록 조회
    @GetMapping
    public ResponseEntity<List<PostResponseDto>> getPosts(Authentication auth) {
        List<PostResponseDto> posts = postService.getPosts(auth);
        return ResponseEntity.ok(posts);
    }

    // 게시글 수정
    @PutMapping("/{postSn}")
    public ResponseEntity<PostResponseDto> updatePost(@PathVariable Long postSn,
                                                      @RequestBody PostRequestDto requestDto,
                                                      Authentication auth) {
        requestDto.setPostSn(postSn); // pathVariable → DTO 반영
        PostResponseDto responseDto = postService.updatePost(requestDto, auth);
        return ResponseEntity.ok(responseDto);
    }

    // 게시글 삭제 (Soft Delete)
    @DeleteMapping("/{postSn}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postSn,
                                           Authentication auth) {
        postService.deletePost(postSn, auth);
        return ResponseEntity.noContent().build(); // HTTP 204
    }
}
