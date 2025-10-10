package com.kdt.KDT_PJT.companymem.ctl;

import com.kdt.KDT_PJT.auth.AuthCustomUserDetails;
import com.kdt.KDT_PJT.companymem.Dto.CompanyMemberDto;
import com.kdt.KDT_PJT.companymem.service.CompanyMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company-members")
@RequiredArgsConstructor
public class CompanyMemberController {

    private final CompanyMemberService companyMemberService;

    @GetMapping
    public ResponseEntity<List<CompanyMemberDto>> getMembersInSameCompany(
            @RequestParam("companySn") Long companySn) {

        List<CompanyMemberDto> members = companyMemberService.findByCompanySn(companySn);

        return ResponseEntity.ok(members);
    }


    @PostMapping
    public ResponseEntity<Long> create(@RequestBody CompanyMemberDto dto) {
        Long id = companyMemberService.save(dto);
        return ResponseEntity.ok(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody CompanyMemberDto dto) {
        companyMemberService.update(id, dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyMemberDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(companyMemberService.get(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        companyMemberService.delete(id);
        return ResponseEntity.ok().build();
    }
}
