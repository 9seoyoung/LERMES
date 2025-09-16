package com.kdt.KDT_PJT.board;

import com.kdt.KDT_PJT.board.Board;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Board createBoard(@ModelAttribute Board boardDto){
        if (boardDto.getFile() !=null){
            log.info ("파일명 : "+boardDto.getFile().getOriginalFilename());
        }
        return boardDto; // DTO 자체를 반환 → JSON 응답
        }

}
