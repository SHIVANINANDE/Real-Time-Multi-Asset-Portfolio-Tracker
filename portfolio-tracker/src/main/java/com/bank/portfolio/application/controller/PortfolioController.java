package com.bank.portfolio.application.controller;

import com.bank.portfolio.domain.entity.Portfolio;
import com.bank.portfolio.infrastructure.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/portfolios")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioRepository portfolioRepository;

    /**
     * Method-level Security: @PreAuthorize
     * Ensures that the requested path variable {userId} exactly matches the
     * username
     * inside the authenticated JWT token context OR if the user is an ADMIN.
     */
    @GetMapping("/{userId}")
    @PreAuthorize("#userId == authentication.name or hasRole('ADMIN')")
    public ResponseEntity<Portfolio> getPortfolio(@PathVariable String userId) {
        return portfolioRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
