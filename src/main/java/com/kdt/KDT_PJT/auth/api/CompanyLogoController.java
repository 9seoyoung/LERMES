package com.kdt.KDT_PJT.auth.api;

import com.kdt.KDT_PJT.auth.entity.Company;
import com.kdt.KDT_PJT.auth.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
public class CompanyLogoController {

    private final CompanyRepository companyRepository;

    // 회사 스몰 로고 갱신
    @PostMapping("/{companyId}/logo/small")
    public ResponseEntity<Map<String, Object>> updateSmallLogo(
            @PathVariable Long companyId,
            @RequestParam(value = "fileSn", required = false) Long fileSn
    ) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("회사 없음: " + companyId));

        // fileSn이 null이면 로고 삭제
        company.setSmallLogoFileSn(fileSn);
        companyRepository.save(company);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "fileSn", fileSn
        ));
    }

    // 회사 조회 (로고 표시용)
    @GetMapping("/{companyId}")
    public ResponseEntity<Company> getCompany(@PathVariable Long companyId) {
        return companyRepository.findById(companyId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 회사 스몰 로고 삭제
    @DeleteMapping("/{companyId}/logo/small")
    public ResponseEntity<Map<String, Object>> deleteSmallLogo(@PathVariable Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("회사 없음: " + companyId));

        company.setSmallLogoFileSn(null); // 로고 SN 제거
        companyRepository.save(company);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "message", "스몰 로고 삭제 완료"
        ));
    }

    // 회사 빅 로고 갱신
    @PostMapping("/{companyId}/logo/big")
    public ResponseEntity<Map<String, Object>> updateBigLogo(
            @PathVariable Long companyId,
            @RequestParam(value = "fileSn", required = false) Long fileSn
    ) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("회사 없음: " + companyId));

        company.setBigLogoFileSn(fileSn);
        companyRepository.save(company);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "fileSn", fileSn
        ));
    }

    // 회사 빅 로고 삭제
    @DeleteMapping("/{companyId}/logo/big")
    public ResponseEntity<Map<String, Object>> deleteBigLogo(@PathVariable Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("회사 없음: " + companyId));

        company.setBigLogoFileSn(null);
        companyRepository.save(company);

        return ResponseEntity.ok(Map.of(
                "ok", true,
                "message", "빅 로고 삭제 완료"
        ));
    }
}