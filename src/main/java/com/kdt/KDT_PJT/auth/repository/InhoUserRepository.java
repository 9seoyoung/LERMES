package com.kdt.KDT_PJT.auth.repository;

import com.kdt.KDT_PJT.auth.entity.InhoUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InhoUserRepository extends JpaRepository<InhoUserEntity, Long> {
    boolean existsByEmail(String email);

    Optional<InhoUserEntity> findByEmail(String username);
}
