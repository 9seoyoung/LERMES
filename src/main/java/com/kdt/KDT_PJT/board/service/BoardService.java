package com.kdt.KDT_PJT.board.service;

import com.kdt.KDT_PJT.board.dto.PostRequestDto;
import com.kdt.KDT_PJT.board.mapper.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper boardMapper;
//    private final FileMapper fileMapper;

    @Transactional
    public void createPost(PostRequestDto postRequestDto){
//        파일처리 / 날짜 유효성 검사 / 권한 체크 등 로직 추가

        boardMapper.insertPost(postRequestDto);
    }
}
