package com.kdt.KDT_PJT.companymem.service;

import com.kdt.KDT_PJT.auth.repository.UserRepository;
import com.kdt.KDT_PJT.companymem.Dto.CompanyMemberDto;
import com.kdt.KDT_PJT.companymem.entity.CompanyMember;
import com.kdt.KDT_PJT.companymem.repository.CompanyMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyMemberService {

    private final CompanyMemberRepository companyMemberRepository;

    private final UserRepository userRepository;

    @Transactional
    public Long save(CompanyMemberDto dto) {
        CompanyMember entity = CompanyMember.builder()
                .companySn(dto.getCompanySn())
                .userSn(dto.getUserSn())
                .userAuthrtSn(dto.getUserAuthrtSn())
                .orgStartDate(dto.getOrgStartDate())
                .orgEndDate(dto.getOrgEndDate())
                .build();

        return companyMemberRepository.save(entity).getCompanyMemberSn();
    }

    @Transactional
    public void update(Long id, CompanyMemberDto dto) {
        CompanyMember entity = companyMemberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 구성원 ID: " + id));

        entity.setCompanySn(dto.getCompanySn());
        entity.setUserSn(dto.getUserSn());
        entity.setUserAuthrtSn(dto.getUserAuthrtSn());
        entity.setOrgStartDate(dto.getOrgStartDate());
        entity.setOrgEndDate(dto.getOrgEndDate());
    }

    @Transactional(readOnly = true)
    public CompanyMemberDto get(Long id) {
        CompanyMember entity = companyMemberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 구성원 ID: " + id));

        return CompanyMemberDto.builder()
                .companyMemberSn(entity.getCompanyMemberSn())
                .companySn(entity.getCompanySn())
                .userSn(entity.getUserSn())
                .userAuthrtSn(entity.getUserAuthrtSn())
                .orgStartDate(entity.getOrgStartDate())
                .orgEndDate(entity.getOrgEndDate())
                .build();
    }

    @Transactional
    public void delete(Long id) {
        companyMemberRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CompanyMemberDto> findByCompanySn(Long companySn) {
        List<CompanyMember> members = companyMemberRepository.findByCompanySn(companySn);

        return members.stream().map(member -> {
            CompanyMemberDto.CompanyMemberDtoBuilder dtoBuilder = CompanyMemberDto.builder()
                    .companyMemberSn(member.getCompanyMemberSn())
                    .companySn(member.getCompanySn())
                    .userSn(member.getUserSn())
                    .userAuthrtSn(member.getUserAuthrtSn())
                    .orgStartDate(member.getOrgStartDate())
                    .orgEndDate(member.getOrgEndDate());

            userRepository.findById(member.getUserSn())
                    .ifPresent(user -> dtoBuilder.userName(user.getName()));

            return dtoBuilder.build();
        }).toList();
    }
    @Transactional
    public Long apply(CompanyMemberDto dto) {
        CompanyMember entity = CompanyMember.builder()
                .companySn(dto.getCompanySn())
                .userSn(dto.getUserSn())
                .userAuthrtSn(dto.getUserAuthrtSn())
                .applyDate(LocalDateTime.now())
                .orgStartDate(null)  // 아직 승인 안됨
                .build();

        return companyMemberRepository.save(entity).getCompanyMemberSn();
    }

    @Transactional
    public void approve(Long id) {
        CompanyMember entity = companyMemberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 구성원 ID: " + id));

        if (entity.getOrgStartDate() != null) {
            throw new IllegalStateException("이미 승인된 신청입니다.");
        }

        entity.setOrgStartDate(LocalDateTime.now());  // 승인 시 소속 시작일 셋팅

        companyMemberRepository.save(entity);
    }

    @Transactional
    public void cancel(Long id) {
        CompanyMember entity = companyMemberRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 구성원 ID: " + id));

        if (entity.getOrgStartDate() != null) {
            throw new IllegalStateException("이미 승인된 신청입니다.");
        }

        companyMemberRepository.delete(entity);  // 승인 전 신청 취소는 삭제 처리
    }


}
