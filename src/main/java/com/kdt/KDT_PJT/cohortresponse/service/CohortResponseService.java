package com.kdt.KDT_PJT.cohortresponse.service;

import com.kdt.KDT_PJT.cohortresponse.dto.CohortResponseDto;
import com.kdt.KDT_PJT.cohortresponse.entity.CohortResponse;
import com.kdt.KDT_PJT.cohortresponse.repository.CohortResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CohortResponseService {

    private final CohortResponseRepository repository;

    @Transactional
    public Long save(CohortResponseDto dto) {
        CohortResponse entity = CohortResponse.builder()
                .parentType(dto.getParentType())
                .parentSn(dto.getParentSn())
                .userSn(dto.getUserSn())
                .rspnsDt(dto.getRspnsDt())
                .rspnsCn(dto.getRspnsCn())
                .viewCnt(dto.getViewCnt())
                .delYn(dto.getDelYn() != null ? dto.getDelYn() : Boolean.FALSE)
                .formUuid(dto.getFormUuid())
                .build();
        return repository.save(entity).getRspnsSn();
    }

    @Transactional(readOnly = true)
    public CohortResponseDto get(Long id) {
        CohortResponse entity = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("응답이 존재하지 않습니다. ID = " + id));

        return toDto(entity);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CohortResponseDto> findByParentSn(Integer parentSn) {
        return repository.findByParentSn(parentSn).stream()
                .map(this::toDto)
                .toList();
    }

    private CohortResponseDto toDto(CohortResponse entity) {
        return CohortResponseDto.builder()
                .rspnsSn(entity.getRspnsSn())
                .parentType(entity.getParentType())
                .parentSn(entity.getParentSn())
                .userSn(entity.getUserSn())
                .rspnsDt(entity.getRspnsDt())
                .rspnsCn(entity.getRspnsCn())
                .viewCnt(entity.getViewCnt())
                .delYn(entity.getDelYn())
                .formUuid(entity.getFormUuid())
                .build();
    }
}
