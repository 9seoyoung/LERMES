package com.kdt.KDT_PJT.cohortresponse.repository;

import com.kdt.KDT_PJT.cohortmem.entity.CohortMember;
import com.kdt.KDT_PJT.cohortresponse.entity.CohortResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CohortResponseRepository extends JpaRepository<CohortResponse, Long> {
    List<CohortResponse> findByParentSn(Integer parentSn);
}
