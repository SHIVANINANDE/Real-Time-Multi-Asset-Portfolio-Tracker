package com.bank.portfolio.infrastructure.config;

import com.bank.portfolio.infrastructure.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // CRITICAL: Enables method-level security such as @PreAuthorize for Owner-based
                      // access control
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Allow WebSocket handshakes unconditionally for this setup
                        .requestMatchers("/ws-portfolio/**").permitAll()
                        // Require Auth setup for endpoints
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        // Expose Actuator endpoints for Prometheus monitoring globally or behind
                        // private subnet
                        .requestMatchers("/actuator/**").permitAll()
                        // All other endpoints require authentication
                        .anyRequest().authenticated())
                // Ensure session is stateless to adhere to scalable microservice architecture
                // best-practices
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Insert custom JWT filter before standard Spring auth filter to intercept
                // tokens
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
