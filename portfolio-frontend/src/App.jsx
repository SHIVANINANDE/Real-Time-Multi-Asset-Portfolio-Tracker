import React from 'react';
import { PortfolioProvider } from './context/PortfolioContext';
import { Sidebar } from './components/Sidebar';
import { LiveTickerBar } from './components/LiveTickerBar';
import { Overview } from './components/Overview';
import { AssetTable } from './components/AssetTable';
import { PerformanceChart } from './components/PerformanceChart';

const DashboardContent = () => {
  return (
    <div className="flex h-screen w-full bg-[#0b101e] overflow-hidden font-sans text-slate-200">
      {/* Left Sidebar */}
      <div className="h-full pr-6 z-10 shrink-0 hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Ticker at absolute top */}
        <div className="mb-4 pr-6 shrink-0 mt-6 lg:mt-0 pt-6">
          <LiveTickerBar />
        </div>

        {/* Scrollable Main Views */}
        <main className="flex-1 overflow-y-auto pr-6 pb-6 mt-4">
          <div className="max-w-7xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Portfolio Dashboard</h1>

            {/* Top Metrics Row */}
            <Overview />

            {/* Graphs & Detailed Data */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full mt-6">
              <PerformanceChart />
              <AssetTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  // Using user 'u1' to match existing user mock or default behavior you might expect.
  return (
    <PortfolioProvider userId="u1">
      <DashboardContent />
    </PortfolioProvider>
  );
}

export default App;
