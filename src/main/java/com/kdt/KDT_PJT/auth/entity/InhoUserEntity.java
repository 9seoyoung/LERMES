package com.kdt.KDT_PJT.auth.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "inho_user_entity")
public class InhoUserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_sn")
    private Long id;

    // 이름
    @Column(name = "name", nullable = false)
    private String name;

    // 이메일
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    // PW
    @Column(name = "pw", nullable = false)
    private String password;

    // 권한 번호(= 6개 중 하나). DB엔 문자열로 저장
    @Enumerated(EnumType.STRING)
    @Column(name = "role_type", nullable = false)
    private UserRoleType roleType;

    // 활성여부
    @Column(name = "enabled", nullable = false)
    private boolean enabled;

    // 기수 번호(FK) - nullable
    @Column(name = "cohort_id")
    private Long cohortId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private EnrollmentStatus status;
}
