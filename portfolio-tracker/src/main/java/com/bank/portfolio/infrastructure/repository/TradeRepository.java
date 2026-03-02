package com.bank.portfolio.infrastructure.repository;

import com.bank.portfolio.domain.entity.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TradeRepository extends JpaRepository<Trade, String> {

    /**
     * Aggregates total holding quantity per user for a specific asset.
     * Returns a list of Object array where [0] is userId (String) and [1] is total
     * quantity (BigDecimal)
     */
    @Query("SELECT t.userId, SUM(t.quantity) FROM Trade t WHERE t.assetId = :assetId GROUP BY t.userId")
    List<Object[]> findUserHoldingsByAssetId(@Param("assetId") String assetId);

    // Fallback if needed explicitly
    List<Trade> findByAssetId(String assetId);
}
