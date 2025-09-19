package com.kdt.KDT_PJT.cohort.repository;


import com.kdt.KDT_PJT.cohort.entity.Cohort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CohortRepository extends JpaRepository<Cohort, Long> {

    List<Cohort> findByCoSn(Long coSn);
    Optional<Cohort> findById(Long id);
    // 추가 쿼리가 필요하면 작성
}
