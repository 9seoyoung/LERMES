package com.kdt.KDT_PJT.response.service;

import com.kdt.KDT_PJT.response.dto.RequestResponseDto;
import com.kdt.KDT_PJT.response.dto.ResponseResponseDto;
import com.kdt.KDT_PJT.response.mapper.ResponseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResponseService {
    private final ResponseMapper responseMapper;

    public void createResponse(RequestResponseDto dto) {
        responseMapper.insertResponse(dto);
    }

    public ResponseResponseDto getResponse(Long rspnsSn) {
        return responseMapper.findResponseById(rspnsSn);
    }

    public List<ResponseResponseDto> getResponsesByParent(Long parentSn, String parentType) {
        return responseMapper.findResponsesByParent(parentSn, parentType);
    }

}
