package com.kdt.KDT_PJT.auth.repository;

import com.kdt.KDT_PJT.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);

    Optional<User> findByEmail(String username);

    Optional<List<User>> findByCohortSn(Long cohortSn);

    List<User> findByEnabledTrueAndCohortSnIsNotNull();
    List<User> findByEnabledTrueAndCompanySnIsNotNullAndCohortSnIsNotNull();

    @Override
    List<User> findAll();

}