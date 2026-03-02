import React from 'react';
import { Home, PieChart, TrendingUp, Settings, LogOut } from 'lucide-react';

export const Sidebar = React.memo(() => {
    return (
        <div className="w-64 h-full glass-dark flex flex-col items-center py-8 px-4 rounded-r-3xl">
            <div className="flex items-center space-x-3 mb-12 w-full px-4">
                <TrendingUp className="w-8 h-8 text-brandPrimary" />
                <span className="text-xl font-bold tracking-wider text-slate-100 uppercase">HFT Dash</span>
            </div>

            <nav className="flex-1 w-full space-y-4">
                <NavItem icon={<Home />} label="Overview" active />
                <NavItem icon={<PieChart />} label="Holdings" />
                <NavItem icon={<TrendingUp />} label="Performance" />
                <NavItem icon={<Settings />} label="Settings" />
            </nav>

            <div className="mt-auto w-full pt-4 border-t border-slate-700/50">
                <NavItem icon={<LogOut />} label="Logout" />
            </div>
        </div>
    );
});

const NavItem = ({ icon, label, active = false }) => {
    return (
        <div
            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300
        ${active ? 'bg-brandPrimary/20 text-brandPrimary shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'}
      `}
        >
            <div className="relative">
                {icon}
                {active && (
                    <div className="absolute inset-0 blur-md bg-brandPrimary opacity-50 rounded-full"></div>
                )}
            </div>
            <span className="font-medium">{label}</span>
        </div>
    );
};
