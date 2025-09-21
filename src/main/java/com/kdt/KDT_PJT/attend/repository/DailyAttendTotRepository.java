package com.kdt.KDT_PJT.attend.repository;

import com.kdt.KDT_PJT.attend.entity.DailyAttendTot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyAttendTotRepository extends JpaRepository<DailyAttendTot, Long> {
    boolean existsByDateAndUserSn(LocalDate date, Long userSn);

    Optional<DailyAttendTot> findByUserSnAndCohortSnAndDate(Long userSn, Long cohortSn, LocalDate date);

}
