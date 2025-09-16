package com.kdt.KDT_PJT.board.ctl;

import com.kdt.KDT_PJT.board.dto.PostRequestDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    @PostMapping(value = "/create")
    public PostRequestDto createBoard(@ModelAttribute PostRequestDto postRequestDto){

        return postRequestDto; // DTO 자체를 반환 → JSON 응답
        }

}
