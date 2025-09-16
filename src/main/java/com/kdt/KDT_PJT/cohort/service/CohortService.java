package com.kdt.KDT_PJT.cohort.service;


import com.kdt.KDT_PJT.cohort.entity.Cohort;
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

    public Cohort save(Cohort cohort) {
        return cohortRepository.save(cohort);
    }

    public void deleteById(Long id) {
        cohortRepository.deleteById(id);
    }
}
