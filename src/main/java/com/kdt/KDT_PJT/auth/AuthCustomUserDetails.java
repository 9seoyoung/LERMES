package com.kdt.KDT_PJT.auth;

import com.kdt.KDT_PJT.auth.entity.InhoUserEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * InhoUserEntity → Spring Security UserDetails 어댑터
 */
public class AuthCustomUserDetails implements UserDetails {

    private final Long id;
    private final String email;
    private final String password;
    private final String authority; // ROLE_ 접두사 포함
    private final boolean enabled;
    private final Long cohortId;

    public AuthCustomUserDetails(InhoUserEntity user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.authority = "ROLE_" + user.getRoleType().name();
        this.enabled = user.isEnabled();
        this.cohortId = user.getCohortId();
    }

    // ===== 추가 정보 getter =====
    public Long getId() { return id; }
    public Long getCohortId() { return cohortId; }

    // ===== UserDetails 구현 =====
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.authority));
    }

    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return email; } // username = email

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; } // 별도 필드 없음
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return enabled; }
}
