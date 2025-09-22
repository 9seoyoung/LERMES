package com.kdt.KDT_PJT.cohort.ctl;


// import com.kdt.KDT_PJT.cohort.dto.CohortListDto;
import com.kdt.KDT_PJT.cohort.dto.CohortDto;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.mapper.CohortConverter;
import com.kdt.KDT_PJT.cohort.service.CohortService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cohorts")
public class CohortController {

    private final CohortService cohortService;

    public CohortController(CohortService cohortService) {
        this.cohortService = cohortService;
    }

    // 전체 조회
    @GetMapping
    public List<Cohort> getAllCohorts() {
        return cohortService.findAll();
    }

    // 단건 조회
    @GetMapping("/{id}")
    public ResponseEntity<Cohort> getCohortById(@PathVariable Long id) {
        return cohortService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    //회사 조회
    @GetMapping("/company/{coSn}")
    public ResponseEntity<List<Cohort>> getCohortsByCompanyId(@PathVariable Long coSn) {
        List<Cohort> cohorts = cohortService.findByCoSn(coSn);
        if (cohorts.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(cohorts);
    }

    // @GetMapping("/company/{coSn}/names")
    // public ResponseEntity<List<CohortListDto>> getCohortNamesByCompanyId(@PathVariable Long coSn) {
    //     List<CohortListDto> names = cohortService.findNamesByCoSn(coSn);
    //     if (names.isEmpty()) {
    //         return ResponseEntity.noContent().build();
    //     }
    //     return ResponseEntity.ok(names);
    // }



    // 생성
    @PostMapping("/setgroup")
    public ResponseEntity<Cohort> createCohort(@RequestBody CohortDto dto) {
        Cohort entity = CohortConverter.toEntity(dto);
        Cohort saved = cohortService.save(entity);
        return ResponseEntity.ok(saved);
    }

    // 수정
    @PutMapping("/{id}")
    public ResponseEntity<Cohort> updateCohort(@PathVariable Long id, @RequestBody Cohort cohort) {
        return cohortService.findById(id)
                .map(existing -> {
                    // 업데이트 할 필드 설정 (id 제외)
                    existing.setCrclmNm(cohort.getCrclmNm());
//                    existing.setCrclmCn(cohort.getCrclmCn());
                    existing.setCoSn(cohort.getCoSn());
                    existing.setRecruitBgngDt(cohort.getRecruitBgngDt());
                    existing.setRecruitEndDt(cohort.getRecruitEndDt());
                    existing.setCrclmBgngYmd(cohort.getCrclmBgngYmd());
                    existing.setCrclmEndYmd(cohort.getCrclmEndYmd());
                    existing.setCohortSttsNm(cohort.getCohortSttsNm());
                    existing.setCohortCate(cohort.getCohortCate());

                    Cohort updated = cohortService.save(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCohort(@PathVariable Long id) {
        if (!cohortService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        cohortService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/titles")
    public ResponseEntity<List<String>> getAllCohortTitles() {
        List<String> titles = cohortService.getAllCohortTitles();
        if (titles.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(titles);
    }

}

