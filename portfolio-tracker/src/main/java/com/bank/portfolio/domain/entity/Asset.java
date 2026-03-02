package com.bank.portfolio.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "assets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Asset {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "ticker", nullable = false, unique = true)
    private String ticker;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private AssetType type;

    @Column(name = "name", nullable = false)
    private String name;

    public enum AssetType {
        STOCK, CRYPTO
    }
}
