import React, { useMemo } from 'react';
import { usePortfolioContext } from '../context/PortfolioContext';
import { ArrowUpRight, ArrowDownRight, Wallet, Activity } from 'lucide-react';

export const Overview = React.memo(() => {
    const { portfolioData, connectionState } = usePortfolioContext();

    const totalValueStr = useMemo(() => {
        if (!portfolioData || !portfolioData.totalValue) return "0.00";
        // Formatting with commas
        return Number(portfolioData.totalValue).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }, [portfolioData]);

    // For visual purposes, setting static percentages
    const percentChange = 1.24;
    const isUp = percentChange >= 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Total Value Card */}
            <div className="glass-dark rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-brandPrimary/10 rounded-full blur-2xl group-hover:bg-brandPrimary/20 transition-all"></div>
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 shadow-md">
                        <Wallet className="w-5 h-5 text-brandPrimary" />
                    </div>
                    <h3 className="text-slate-400 font-medium">Total Balance</h3>
                </div>
                <div className="flex items-end space-x-3">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">
                        ${totalValueStr}
                    </h1>
                </div>
            </div>

            {/* 24h Change Card */}
            <div className="glass-dark rounded-3xl p-6 shadow-xl">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 shadow-md">
                        <Activity className="w-5 h-5 text-slate-300" />
                    </div>
                    <h3 className="text-slate-400 font-medium">24h Change</h3>
                </div>
                <div className="flex items-center space-x-3 mt-1">
                    <h1 className={`text-4xl font-extrabold tracking-tight ${isUp ? 'text-success' : 'text-danger'}`}>
                        {isUp ? '+' : ''}{percentChange}%
                    </h1>
                    {isUp ? (
                        <ArrowUpRight className="w-6 h-6 text-success" />
                    ) : (
                        <ArrowDownRight className="w-6 h-6 text-danger" />
                    )}
                </div>
            </div>

            {/* Connection / Status Card */}
            <div className="glass-dark rounded-3xl p-6 shadow-xl flex flex-col justify-center">
                <h3 className="text-slate-400 font-medium mb-2">Network Status</h3>
                <div className="flex items-center space-x-3 mt-2">
                    <div className="relative flex h-4 w-4">
                        {connectionState === 'Connected' && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-4 w-4 ${connectionState === 'Connected' ? 'bg-success' :
                                connectionState === 'Connecting' ? 'bg-yellow-400' : 'bg-danger'
                            }`}></span>
                    </div>
                    <span className="text-slate-200 font-bold text-lg">{connectionState}</span>
                </div>
                <div className="mt-4">
                    <span className="text-xs text-slate-500">Live WebSockets (STOMP/SockJS) Configured over Kafka Market Data</span>
                </div>
            </div>

        </div>
    );
});
