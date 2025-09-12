package com.kdt.KDT_PJT.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
@Table(name = "TB_COMPANY")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CO_SN")
    private Long id;                 // 회사 PK

    @Column(name = "BRNO", nullable = false, length = 10, unique = true)
    private String brno;             // 사업자등록번호

    @Column(name = "CO_NM", nullable = false, length = 100)
    private String name;             // 회사명

    @Column(name = "ACTVTN_YN", nullable = false)
    private boolean active;          // 활성여부

    @CreatedDate  // 👈 저장 시 자동 세팅
    @Column(name = "CO_REG_DT", nullable = false, updatable = false)
    private LocalDateTime registeredAt;
}
