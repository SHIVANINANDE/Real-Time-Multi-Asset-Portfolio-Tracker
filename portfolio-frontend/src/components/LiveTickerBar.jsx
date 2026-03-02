import React, { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

const MOCK_TICKERS = [
    { symbol: 'AAPL', current: 150.00, direction: 'up' },
    { symbol: 'BTC', current: 45000.0, direction: 'up' },
    { symbol: 'TSLA', current: 200.25, direction: 'down' },
    { symbol: 'GOOGL', current: 2800.50, direction: 'up' },
    { symbol: 'AMZN', current: 3300.00, direction: 'down' },
];

export const LiveTickerBar = React.memo(() => {
    // Simulating live feed ticks
    const [tickers, setTickers] = useState(MOCK_TICKERS);

    useEffect(() => {
        const i = setInterval(() => {
            setTickers(prev => prev.map(t => {
                if (Math.random() > 0.8) {
                    const delta = (Math.random() - 0.5) * (t.current * 0.005);
                    return {
                        ...t,
                        current: t.current + delta,
                        direction: delta > 0 ? 'up' : 'down'
                    };
                }
                return t;
            }));
        }, 1000);
        return () => clearInterval(i);
    }, []);

    return (
        <div className="w-full h-12 glass border-b border-white/5 flex items-center overflow-hidden">
            <div className="flex items-center space-x-2 px-4 border-r border-white/10 shrink-0 h-full bg-slate-800/50">
                <Zap className="w-4 h-4 text-brandPrimary animate-pulse" />
                <span className="text-xs font-bold tracking-widest uppercase text-slate-300">Live Feed</span>
            </div>
            <div className="flex-1 overflow-hidden relative group">
                <div className="flex items-center space-x-8 px-8 animate-[marquee_20s_linear_infinite] group-hover:pause">
                    {tickers.map((t, idx) => (
                        <div key={idx} className="flex items-center space-x-2 shrink-0">
                            <span className="font-semibold text-slate-300">{t.symbol}</span>
                            <span className={`font-bold ${t.direction === 'up' ? 'text-success' : 'text-danger'}`}>
                                ${t.current.toFixed(2)}
                            </span>
                        </div>
                    ))}
                    {/* Duplicate for seamless loop */}
                    {tickers.map((t, idx) => (
                        <div key={idx + '_dup'} className="flex items-center space-x-2 shrink-0">
                            <span className="font-semibold text-slate-300">{t.symbol}</span>
                            <span className={`font-bold ${t.direction === 'up' ? 'text-success' : 'text-danger'}`}>
                                ${t.current.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tailwind marquee config missing by default, let's just use CSS or rely on normal layout if missing */}
        </div>
    );
});
