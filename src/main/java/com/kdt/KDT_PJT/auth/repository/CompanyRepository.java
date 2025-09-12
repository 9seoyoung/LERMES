// com.kdt.KDT_PJT.auth.repository.CompanyRepository
package com.kdt.KDT_PJT.auth.repository;

import com.kdt.KDT_PJT.auth.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    boolean existsByBrno(String brno);
}
