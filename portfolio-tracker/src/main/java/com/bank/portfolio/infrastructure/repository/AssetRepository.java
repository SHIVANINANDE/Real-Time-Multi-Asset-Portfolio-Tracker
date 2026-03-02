package com.bank.portfolio.infrastructure.repository;

import com.bank.portfolio.domain.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, String> {
    Optional<Asset> findByTicker(String ticker);
}
