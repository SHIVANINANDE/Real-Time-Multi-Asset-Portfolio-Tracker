package com.bank.portfolio.infrastructure.repository;

import com.bank.portfolio.domain.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PortfolioRepository extends JpaRepository<Portfolio, String> {
}
