package com.kdt.KDT_PJT.cohortmem.repository;

import com.kdt.KDT_PJT.cohortmem.entity.CohortMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CohortMemberRepository extends JpaRepository<CohortMember, Long> {
    // 커스텀 메서드 추가 가능
    List<CohortMember> findByCohortSn(Long cohortSn);

    boolean existsByUserSnAndCohortSn(Long userSn, Long cohortSn);

}
