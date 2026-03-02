CREATE TABLE IF NOT EXISTS assets (
    id VARCHAR(50) PRIMARY KEY,
    ticker VARCHAR(20) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolios (
    user_id VARCHAR(50) PRIMARY KEY,
    total_value DECIMAL(19, 4) NOT NULL,
    last_updated TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS trades (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    asset_id VARCHAR(50) NOT NULL,
    quantity DECIMAL(19, 8) NOT NULL,
    price DECIMAL(19, 4) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    CONSTRAINT fk_trade_asset FOREIGN KEY (asset_id) REFERENCES assets(id),
    CONSTRAINT fk_trade_portfolio FOREIGN KEY (user_id) REFERENCES portfolios(user_id) ON DELETE CASCADE
);

-- Indexes for performance on frequently queried columns
CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);
CREATE INDEX IF NOT EXISTS idx_trades_asset_id ON trades(asset_id);
CREATE INDEX IF NOT EXISTS idx_trades_user_asset_id ON trades(user_id, asset_id);
