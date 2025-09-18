package com.kdt.KDT_PJT.board.mapper;

import com.kdt.KDT_PJT.board.dto.PostRequestDto;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
@Mapper
public interface BoardMapper {
    void insertPost(PostRequestDto postRequestDto);

}
