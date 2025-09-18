package com.kdt.KDT_PJT.board.ctl;

import com.kdt.KDT_PJT.board.dto.PostRequestDto;
import com.kdt.KDT_PJT.board.service.BoardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @PostMapping(value = "/post")
    public PostRequestDto createBoard(@RequestBody PostRequestDto postRequestDto){
        boardService.createPost(postRequestDto);
        return postRequestDto; // DTO 자체를 반환 → JSON 응답
        }

}


//기수별로 그룹핑하고 그룹핑 된 기수 안에서 게시판 유형으로 필터링 그 결과를 목록 형태로 보여줘야함
//1차 기수 그룹핑 / 2차 유평 그룹핑 / 공개권한에 따라 사용자 권하별로 다르게 보여주기
//public enum SharingScope {
//    PUBLIC, MEMBER, ADMIN

// 파일 업로드 로직 디티오

//pblic class BoardController {
//
//    private final BoardService boardService;
//
//    @PostMapping(value = "/post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public PostRequestDto createBoard(@ModelAttribute PostRequestDto postRequestDto){
//        boardService.createPost(postRequestDto);
//        return postRequestDto; // DTO 자체를 반환 → JSON 응답
//    }
//
//}