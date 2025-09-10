package com.kdt.KDT_PJT.auth.config;

import com.kdt.KDT_PJT.auth.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;

    // 비밀번호 인코더
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // DaoAuthenticationProvider: UserDetailsService + PasswordEncoder 연결
    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider p = new DaoAuthenticationProvider();
        p.setUserDetailsService(customUserDetailsService);
        p.setPasswordEncoder(passwordEncoder());
        return p;
    }

    // AuthenticationManager (커스텀 JSON 로그인 필터 등에서 필요)
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // CORS (React 프론트에서 withCredentials:true 사용)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOriginPatterns(List.of("http://localhost:*", "http://127.0.0.1:*"));
        cors.setAllowedMethods(List.of("GET","POST","PUT","PATCH","DELETE","OPTIONS"));
        cors.setAllowedHeaders(List.of("Content-Type","X-CSRF-TOKEN","Authorization"));
        cors.setAllowCredentials(true); // 쿠키 전달
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // 세션 기반
                .sessionManagement(sm -> sm
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                // CORS
                .cors(Customizer.withDefaults())

                // CSRF: 브라우저/쿠키 기반이면 활성화 권장.
                // 다만 회원가입/로그인 등은 예외 처리(프론트에서 CSRF 토큰 세팅 전에도 호출 가능하도록)
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .ignoringRequestMatchers("/auth/**")
                )

                // 인가 규칙
                .authorizeHttpRequests(auth -> auth
                        // 공개 엔드포인트
                        .requestMatchers(
                                "/", "/health", "/public/**",
                                "/auth/email/code", "/auth/signup", "/auth/login", "/auth/logout"
                        ).permitAll()

                        // 권한별 예시 매핑 (원하면 경로 조정)
                        .requestMatchers("/super/**").hasRole("SUPER_ADMIN")
                        .requestMatchers("/tenant/**").hasAnyRole("TENANT_ADMIN","SUPER_ADMIN")
                        .requestMatchers("/instructor/**").hasAnyRole("INSTRUCTOR","TENANT_ADMIN","SUPER_ADMIN")
                        .requestMatchers("/employee/**").hasAnyRole("EMPLOYEE","TENANT_ADMIN","SUPER_ADMIN")
                        .requestMatchers("/student/**").hasAnyRole("STUDENT","TENANT_ADMIN","INSTRUCTOR","EMPLOYEE","SUPER_ADMIN")

                        // 그 외는 인증 필요
                        .anyRequest().authenticated()
                )

                // 폼 로그인 사용 안 함 (React에서 JSON 로그인 사용할 예정)
                .formLogin(form -> form.disable())

                // 로그아웃 (세션/쿠키 정리)
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .deleteCookies("JSESSIONID")
                        .clearAuthentication(true)
                        .invalidateHttpSession(true)
                        .permitAll()
                )

                // 동시 세션 제한 & 세션 고정 보호
                .sessionManagement(sm -> sm
                        .maximumSessions(1)
                        .maxSessionsPreventsLogin(true)
                )
                .sessionManagement(sm -> sm
                        .sessionFixation(sessionFixation -> sessionFixation.changeSessionId())
                )

                // DaoAuthenticationProvider 등록
                .authenticationProvider(authProvider());

        // JSON 로그인 필터는 다음 단계에서 추가 (POST /auth/login {email,password})
        // 커스텀 필터를 UsernamePasswordAuthenticationFilter 앞에 추가하면 됨.

        return http.build();
    }
}
