package com.kdt.KDT_PJT.cohort.repository;


import com.kdt.KDT_PJT.cohort.entity.Cohort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CohortRepository extends JpaRepository<Cohort, Long> {

    List<Cohort> findByCoSn(Long coSn);
    Optional<Cohort> findById(Long id);

    @Query("SELECT c.cohortNm FROM Cohort c")
    List<String> findAllCohortTitles();
    // 추가 쿼리가 필요하면 작성
}
