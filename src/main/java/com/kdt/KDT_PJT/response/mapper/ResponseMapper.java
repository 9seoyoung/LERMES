package com.kdt.KDT_PJT.response.mapper;

import com.kdt.KDT_PJT.response.dto.RequestResponseDto;
import com.kdt.KDT_PJT.response.dto.ResponseResponseDto;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ResponseMapper {

    int insertResponse(RequestResponseDto dto);

    ResponseResponseDto findResponseById(Long rspnsSn);

    List<ResponseResponseDto> findResponsesByParent(Long parentSn, String parentType);
}
