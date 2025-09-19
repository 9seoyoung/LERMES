package com.kdt.KDT_PJT.cohortmem.service;

import com.kdt.KDT_PJT.auth.entity.User;
import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.cohort.entity.Cohort;
import com.kdt.KDT_PJT.cohort.repository.CohortRepository;
import com.kdt.KDT_PJT.cohortmem.dto.CohortMemberDto;
import com.kdt.KDT_PJT.cohortmem.entity.CohortMember;
import com.kdt.KDT_PJT.cohortmem.repository.CohortMemberRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CohortMemberService {

    private final CohortMemberRepository cohortMemberRepository;
    private final CohortRepository cohortRepository;
    private final UserRepository userRepository;

    public CohortMemberService(CohortMemberRepository cohortMemberRepository, CohortRepository cohortRepository, UserRepository userRepository) {
        this.cohortMemberRepository = cohortMemberRepository;
        this.cohortRepository = cohortRepository;
        this.userRepository = userRepository;
    }

    public List<CohortMemberDto> getApplicantsByCohortSn(Long cohortSn) {
        List<CohortMember> members = cohortMemberRepository.findByCohortSn(cohortSn);

        return members.stream().map(member -> {
            CohortMemberDto dto = new CohortMemberDto();
            dto.setName(member.getUser().getName());
            dto.setPhone(member.getUser().getUserTelno());
            dto.setEmail(member.getUser().getEmail());
            dto.setCohortName(member.getCohort().getCohortNm());  // 기수 이름
            dto.setCrclmName(member.getCohort().getCrclmNm());    // 과정 이름
            dto.setAprwStts(member.getAprvDt() != null);          // 승인여부 true/false
            return dto;
        }).collect(Collectors.toList());
    }

    public void applyForCohort(Long userSn, Long cohortSn) {
        // 중복 신청 방지
        if (cohortMemberRepository.existsByUserSnAndCohortSn(userSn, cohortSn)) {
            throw new RuntimeException("이미 신청한 사용자입니다.");
        }

        User user = userRepository.findById(userSn)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        Cohort cohort = cohortRepository.findById(cohortSn)
                .orElseThrow(() -> new RuntimeException("코호트를 찾을 수 없습니다."));

        CohortMember member = new CohortMember();
        member.setUser(user);
        member.setCohort(cohort);
        member.setAprvDt(null); // 아직 승인되지 않음

        cohortMemberRepository.save(member);
    }



}
