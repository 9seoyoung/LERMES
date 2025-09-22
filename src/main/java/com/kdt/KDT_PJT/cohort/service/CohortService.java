package com.kdt.KDT_PJT.cohort.service;


//import com.kdt.KDT_PJT.cohort.dto.CohortListDto;
import com.kdt.KDT_PJT.cohort.dto.CohortDto;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.mapper.CohortConverter;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CohortService {

    private final CohortRepository cohortRepository;

    public CohortService(CohortRepository cohortRepository) {
        this.cohortRepository = cohortRepository;
    }

    public List<Cohort> findAll() {
        return cohortRepository.findAll();
    }

    public Optional<Cohort> findById(Long id) {
        return cohortRepository.findById(id);
    }

    public List<Cohort> findByCoSn(Long coSn) {return cohortRepository.findByCoSn(coSn);}

//    public List<CohortListDto> findNamesByCoSn(Long coSn) {
//        return cohortRepository.findByCoSn(coSn).stream()
//                .map(cohort -> {
//                    CohortListDto dto = new CohortListDto();
//                    dto.setCohortNm(cohort.getCohortNm());
//                    return dto;
//                })
//                .toList();
//    }


    public Cohort save(Cohort cohort) {
        return cohortRepository.save(cohort);
    }

    public void deleteById(Long id) {
        cohortRepository.deleteById(id);
    }

    public void createCohort(CohortDto dto) {
        // DTO -> Entity 변환
        Cohort entity = CohortConverter.toEntity(dto);

        cohortRepository.save(entity); // DB 저장 등 작업

        // 이후 필요한 처리
    }

    public CohortDto getCohortDto(Long cohortSn) {
        // Entity 조회
        Cohort entity = /* repository.findById(cohortSn).orElse(null) */ null;

        // Entity -> DTO 변환
        return CohortConverter.toDto(entity);
    }

    public List<String> getAllCohortTitles() {
        return cohortRepository.findAllCohortTitles();
    }

}
