package com.kdt.KDT_PJT.attend.repository;

import com.kdt.KDT_PJT.attend.entity.Attend;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface AttendRepository extends JpaRepository<Attend, Long> {
    Optional<Attend> findByUserSnAndInoutYnAndAttendTmBetween(
            Long userSn, boolean inoutYn,
            LocalDateTime start, LocalDateTime end
    );
}