package com.kdt.KDT_PJT.cohortresponse.service;

import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.cohort.dto.CohortDto;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import com.kdt.KDT_PJT.cohortresponse.dto.CohortResponseDetailDto;
import com.kdt.KDT_PJT.cohortresponse.dto.CohortResponseDto;
import com.kdt.KDT_PJT.cohortresponse.entity.CohortResponse;
import com.kdt.KDT_PJT.cohortresponse.repository.CohortResponseRepository;
import com.kdt.KDT_PJT.user.Dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CohortResponseService {

    private final CohortResponseRepository repository;
    private final CohortRepository cohortRepository;
    private final UserRepository userRepository;

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
    public CohortResponseDetailDto get(Long responseId) {
        // 1. 응답 데이터 조회
        CohortResponse response = repository.findById(responseId)
                .orElseThrow(() -> new IllegalArgumentException("응답이 존재하지 않습니다. ID = " + responseId));


        // 2. 모집 설문 JSON (surveyForm) 초기화
        String surveyForm = null;

        if ("COHORT".equals(response.getParentType())) {
            // 이제 Optional 사용
            Cohort cohort = cohortRepository.findById(response.getParentSn().longValue())
                    .orElseThrow(() -> new IllegalArgumentException("모집이 존재하지 않습니다. ID = " + response.getParentSn()));
            surveyForm = cohort.getCrclmCn();
        }


        // 3. 사용자 정보 조회
        User user = userRepository.findById(response.getUserSn().longValue())
                .orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다. ID = " + response.getUserSn()));

        UserDto userDto = UserDto.fromEntity(user);

        // 4. DTO 빌드 후 리턴
        return CohortResponseDetailDto.builder()
                .responseJson(response.getRspnsCn())
                .surveyForm(surveyForm)
                .userInfo(userDto)
                .build();
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
