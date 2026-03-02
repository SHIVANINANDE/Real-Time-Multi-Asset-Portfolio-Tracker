import React, { createContext, useContext, useState, useMemo } from 'react';
import { usePortfolioSocket } from '../hooks/usePortfolioSocket';

const PortfolioContext = createContext(null);

export const PortfolioProvider = ({ children, userId }) => {
    // Use the socket hook to get live data
    const { portfolioData, connectionState, reconnect } = usePortfolioSocket(userId);

    // Note: For Phase 1 we just get portfolio updates. To make a rich dashboard, 
    // you might also want to maintain mock/live asset list or historic values here.

    const [history, setHistory] = useState([]);

    // Append new portfolio values to history for chart
    React.useEffect(() => {
        if (portfolioData && portfolioData.totalValue !== undefined) {
            setHistory(prev => {
                // Keep last 30 data points to prevent memory bloat
                const newHistory = [...prev, {
                    time: new Date(portfolioData.lastUpdated).toLocaleTimeString('en-US', { hour12: false }),
                    value: parseFloat(portfolioData.totalValue)
                }];
                return newHistory.slice(-30);
            });
        }
    }, [portfolioData]);

    // Only recompute context value when exact dependencies change
    const contextValue = useMemo(() => ({
        userId,
        portfolioData,
        history,
        connectionState,
        reconnect,
    }), [userId, portfolioData, history, connectionState, reconnect]);

    return (
        <PortfolioContext.Provider value={contextValue}>
            {children}
        </PortfolioContext.Provider>
    );
};

export const usePortfolioContext = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolioContext must be used within a PortfolioProvider');
    }
    return context;
};
