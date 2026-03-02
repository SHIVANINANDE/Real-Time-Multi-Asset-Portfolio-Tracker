package com.bank.portfolio.application.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketPriceUpdate {
    private String ticker;
    private BigDecimal currentPrice;
}
