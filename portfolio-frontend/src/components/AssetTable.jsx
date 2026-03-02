import React, { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';

// For Phase 2 demonstration, we'll mock some initial assets
// and update their current price when Kafka streams it via WebSocket.
// In a real scenario, the portfolio service could also push asset-level updates
// or this component would listen to a generalized market-price topic.
const MOCK_ASSETS = [
    { id: '1', ticker: 'AAPL', quantity: 50, avgBuyPrice: 145.00, currentPrice: 150.00 },
    { id: '2', ticker: 'BTC', quantity: 0.5, avgBuyPrice: 42000.0, currentPrice: 45000.0 },
    { id: '3', ticker: 'TSLA', quantity: 200, avgBuyPrice: 180.50, currentPrice: 200.25 },
];

export const AssetTable = React.memo(() => {
    const [assets, setAssets] = useState(MOCK_ASSETS);

    // In a real environment, you'd subscribe to an asset price topic or
    // receive an expanded payload from the portfolio websocket containing individual asset updates.
    // We'll simulate receiving periodic price updates that cause the rows to flash.
    useEffect(() => {
        const interval = setInterval(() => {
            setAssets((prev) =>
                prev.map((asset) => {
                    // Random 20% chance to update a stock price every 2 seconds
                    if (Math.random() > 0.8) {
                        const delta = (Math.random() - 0.5) * (asset.currentPrice * 0.01);
                        return {
                            ...asset,
                            currentPrice: asset.currentPrice + delta,
                            flashDirection: delta > 0 ? 'up' : 'down'
                        };
                    }
                    return { ...asset, flashDirection: null };
                })
            );
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-8 glass-dark rounded-3xl p-6 shadow-2xl overflow-hidden relative">
            <div className="flex items-center space-x-3 mb-6">
                <Activity className="text-brandPrimary w-6 h-6" />
                <h2 className="text-xl font-semibold">Live Holdings</h2>
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-darkBorder text-slate-400 text-sm uppercase tracking-wider">
                            <th className="py-4 px-4 font-semibold">Asset Ticker</th>
                            <th className="py-4 px-4 font-semibold text-right">Quantity</th>
                            <th className="py-4 px-4 font-semibold text-right">Avg. Buy Price</th>
                            <th className="py-4 px-4 font-semibold text-right">Current Price (Live)</th>
                            <th className="py-4 px-4 font-semibold text-right">Total Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset) => (
                            <AssetRow key={asset.id} asset={asset} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

const AssetRow = React.memo(({ asset }) => {
    const [flashClass, setFlashClass] = useState('');
    const prevPriceRef = useRef(asset.currentPrice);

    useEffect(() => {
        if (asset.currentPrice !== prevPriceRef.current && asset.flashDirection) {
            // Trigger animation
            setFlashClass(asset.flashDirection === 'up' ? 'animate-flash-green' : 'animate-flash-red');

            const timer = setTimeout(() => {
                setFlashClass('');
            }, 1000); // match Tailwind duration

            prevPriceRef.current = asset.currentPrice;
            return () => clearTimeout(timer);
        }
    }, [asset.currentPrice, asset.flashDirection]);

    const totalValue = asset.quantity * asset.currentPrice;

    return (
        <tr className={`border-b border-darkBorder/50 hover:bg-white/5 transition-colors ${flashClass}`}>
            <td className="py-4 px-4 font-bold text-slate-200">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-brandPrimary border border-slate-700">
                        {asset.ticker.charAt(0)}
                    </div>
                    <span>{asset.ticker}</span>
                </div>
            </td>
            <td className="py-4 px-4 text-right text-slate-300 font-medium">{asset.quantity}</td>
            <td className="py-4 px-4 text-right text-slate-300">${asset.avgBuyPrice.toFixed(2)}</td>
            <td className="py-4 px-4 text-right font-bold text-slate-100">
                ${asset.currentPrice.toFixed(2)}
            </td>
            <td className="py-4 px-4 text-right font-bold text-brandPrimary">
                ${totalValue.toFixed(2)}
            </td>
        </tr>
    );
});
