package com.kdt.KDT_PJT.cohort.repository;


import com.kdt.KDT_PJT.cohort.entity.Cohort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CohortRepository extends JpaRepository<Cohort, Long> {
    // 추가 쿼리가 필요하면 작성
}
