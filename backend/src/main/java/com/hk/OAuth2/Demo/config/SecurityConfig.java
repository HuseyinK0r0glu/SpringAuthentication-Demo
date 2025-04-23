package com.hk.OAuth2.Demo.config;

import com.hk.OAuth2.Demo.jwt.JWTAuthenticationFilter;
import com.hk.OAuth2.Demo.service.CustomUserDetailService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailService customUserDetailService;
    private final JWTAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CustomUserDetailService customUserDetailService, JWTAuthenticationFilter jwtAuthenticationFilter) {
        this.customUserDetailService = customUserDetailService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorizeRequests -> {
                            authorizeRequests.requestMatchers("/",
                                    "/api/auth/**",
                                    "/api/auth/verify",
                                    "/error",
                                    "/actuator/health",
                                    "/actuator/metrics" ,
                                    "/profile_pictures/**").permitAll();
                            // Preflight CORS check
                            // when we send a request from the frontend the browser sends a preflight request using HTTP OPTIONS method.
                            // This request asks the server for permission to proceed.
                            authorizeRequests.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();
                            authorizeRequests.anyRequest().authenticated();
                        })
                        .userDetailsService(customUserDetailService)
                        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                        // after log in redirect to front end
                        .oauth2Login(oauth2 -> oauth2.defaultSuccessUrl("http://localhost:3000/loading" , true))
                        .csrf(AbstractHttpConfigurer::disable);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(customUserDetailService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(daoAuthenticationProvider);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
