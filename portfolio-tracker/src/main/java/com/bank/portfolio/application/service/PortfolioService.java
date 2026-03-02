package com.bank.portfolio.application.service;

import com.bank.portfolio.application.dto.MarketPriceUpdate;
import com.bank.portfolio.domain.entity.Asset;
import com.bank.portfolio.infrastructure.repository.AssetRepository;
import com.bank.portfolio.infrastructure.repository.PortfolioRepository;
import com.bank.portfolio.infrastructure.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
@RequiredArgsConstructor
public class PortfolioService {

    private final TradeRepository tradeRepository;
    private final PortfolioRepository portfolioRepository;
    private final AssetRepository assetRepository;

    // STOMP messaging template to push real-time updates to connected clients
    private final SimpMessagingTemplate messagingTemplate;

    // In-memory cache to store the latest processed price for rapid delta
    // calculation
    private final Map<String, BigDecimal> latestPriceCache = new ConcurrentHashMap<>();

    /**
     * Listens to the market-price-updates topic.
     * Delegates to an @Async method so the Kafka consumer thread is freed quickly,
     * maximizing throughput.
     */
    @KafkaListener(topics = "market-price-updates", groupId = "portfolio-group", containerFactory = "kafkaListenerContainerFactory")
    public void onMarketPriceUpdate(MarketPriceUpdate update) {
        log.debug("Received price update from Kafka: {}", update);
        processPriceUpdate(update);
    }

    @Async
    @Transactional
    public void processPriceUpdate(MarketPriceUpdate update) {
        String ticker = update.getTicker();
        BigDecimal newPrice = update.getCurrentPrice();

        Optional<Asset> assetOpt = assetRepository.findByTicker(ticker);
        if (assetOpt.isEmpty()) {
            log.warn("Ignored update: Asset not found for ticker: {}", ticker);
            return;
        }

        Asset asset = assetOpt.get();
        BigDecimal oldPrice = latestPriceCache.getOrDefault(ticker, BigDecimal.ZERO);

        // If price hasn't changed, ignore to avoid unnecessary DB updates
        if (oldPrice.compareTo(newPrice) == 0) {
            return;
        }

        BigDecimal priceDelta = newPrice.subtract(oldPrice);
        latestPriceCache.put(ticker, newPrice); // Update cache

        /**
         * Fetch all user positions for the specific asset.
         * Using an aggregate query here instead of fetching raw Trade entities directly
         * reduces memory load significantly for a high-throughput system.
         */
        List<Object[]> userHoldings = tradeRepository.findUserHoldingsByAssetId(asset.getId());

        for (Object[] row : userHoldings) {
            String userId = (String) row[0];
            BigDecimal quantity = (BigDecimal) row[1];

            if (quantity == null || quantity.compareTo(BigDecimal.ZERO) == 0)
                continue;

            BigDecimal valueChange = priceDelta.multiply(quantity);

            // Fetch and update user's portfolio value
            portfolioRepository.findById(userId).ifPresent(portfolio -> {
                BigDecimal updatedValue = portfolio.getTotalValue().add(valueChange);
                portfolio.setTotalValue(updatedValue);
                portfolio.setLastUpdated(LocalDateTime.now());

                // Save to Postgres
                portfolioRepository.save(portfolio);

                // Push real-time update via WebSocket
                messagingTemplate.convertAndSend("/topic/portfolio/" + userId, portfolio);
                log.debug("Pushed portfolio update for user {}: new value {}", userId, updatedValue);
            });
        }
    }
}
