package com.kdt.KDT_PJT.domain.board;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.type.NStringTypeHandler;
import org.springframework.context.annotation.Profile;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.awt.*;

@Slf4j
@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
@Profile("sample")
public class BoardController {

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Board createBoard(@ModelAttribute Board boardDto){
        if (boardDto.getFile() !=null){
            log.info ("파일명 : "+boardDto.getFile().getOriginalFilename());
        }
        return boardDto; // DTO 자체를 반환 → JSON 응답
        }

}
