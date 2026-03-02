import React from 'react';
import { usePortfolioContext } from '../context/PortfolioContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart as ChartIcon } from 'lucide-react';

export const PerformanceChart = React.memo(() => {
    const { history } = usePortfolioContext();

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="glass-dark p-3 rounded-lg border border-slate-700 shadow-xl">
                    <p className="text-slate-400 text-xs mb-1">{label}</p>
                    <p className="text-brandPrimary font-bold">${payload[0].value.toFixed(2)}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="mt-8 glass-dark rounded-3xl p-6 shadow-2xl h-96 flex flex-col relative w-full">
            <div className="flex items-center space-x-3 mb-6">
                <ChartIcon className="text-brandPrimary w-6 h-6" />
                <h2 className="text-xl font-semibold text-slate-100">Performance Over Time</h2>
                {history.length === 0 && (
                    <span className="text-sm text-slate-500 ml-auto animate-pulse">Waiting for live data...</span>
                )}
            </div>

            <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={history.length > 0 ? history : [{ time: '00:00:00', value: 0 }]} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="time" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `$${value}`}
                            domain={['dataMin - 100', 'dataMax + 100']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#38bdf8"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, fill: '#38bdf8', stroke: '#1e293b', strokeWidth: 2 }}
                            isAnimationActive={false} // Disable to avoid janky transitions on high frequency updates
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});
