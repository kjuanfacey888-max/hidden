import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SearchIcon, BellIcon, BotIcon, IconMap } from './icons';
import type { StockDetails, AlpacaKeys, AlpacaData, AiTraderStrategy } from '../types';

const mockWishlist = [
    { symbol: 'ADB', name: 'Adobe', Icon: IconMap.AdobeIcon, price: 43.86, changePercent: 0.4 },
    { symbol: 'NFLX', name: 'Netflix', Icon: IconMap.NetflixIcon, price: 2095.89, changePercent: -0.3 },
];

const mockPortfolios = [
    { symbol: 'BTC', name: 'Bitcoin', Icon: IconMap.BitcoinIcon, totalShares: '2.5', totalReturn: '+0.86%', chartData: [{ name: '1', value: 400 }, { name: '2', value: 300 }, { name: '3', value: 450 }, { name: '4', value: 470 }, { name: '5', value: 500 }], color: '#F7931A' },
    { symbol: 'ETH', name: 'Ethereum', Icon: IconMap.EthereumIcon, totalShares: '15.2', totalReturn: '-0.10%', chartData: [{ name: '1', value: 300 }, { name: '2', value: 320 }, { name: '3', value: 310 }, { name: '4', value: 340 }, { name: '5', value: 350 }], color: '#627EEA' },
    { symbol: 'BNB', name: 'Binance Coin', Icon: IconMap.BNBIcon, totalShares: '50.8', totalReturn: '+1.20%', chartData: [{ name: '1', value: 200 }, { name: '2', value: 250 }, { name: '3', value: 230 }, { name: '4', value: 280 }, { name: '5', value: 300 }], color: '#F3BA2F' },
];

const MiniChart: React.FC<{ data: { name: string; value: number }[], color: string }> = ({ data, color }) => (
    <ResponsiveContainer width="100%" height={40}>
        <AreaChart data={data}>
            <defs><linearGradient id={`color-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={color} stopOpacity={0.4}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs>
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#color-${color.slice(1)})`} />
        </AreaChart>
    </ResponsiveContainer>
);

interface StocksPageProps {
  alpacaKeys: AlpacaKeys | null;
  onNavigate: (view: 'ai-chat' | 'settings' | 'stock-detail') => void;
  popularStocks: StockDetails[];
  onViewStockDetail: (stock: StockDetails) => void;
  onPlaceTrade: (symbol: string) => void;
  // New props for live data
  alpacaData: AlpacaData | null;
  isLoading: boolean;
  error: string | null;
  onAddFunds: (amount: number) => void;
  // New AI Trader Props
  onOpenAiTrader: () => void;
  activeAiStrategy: AiTraderStrategy | null;
}

const StocksPage: React.FC<StocksPageProps> = ({ alpacaKeys, onNavigate, popularStocks, onViewStockDetail, onPlaceTrade, alpacaData, isLoading, error, onAddFunds, onOpenAiTrader, activeAiStrategy }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [addFundsAmount, setAddFundsAmount] = useState('');

    const filteredStocks = useMemo(() => {
        if (!searchQuery) return popularStocks;
        const lowercasedQuery = searchQuery.toLowerCase();
        return popularStocks.filter(stock => 
            stock.symbol.toLowerCase().includes(lowercasedQuery) || 
            stock.name.toLowerCase().includes(lowercasedQuery)
        );
    }, [popularStocks, searchQuery]);

    const handleAddFunds = () => {
        const amount = parseFloat(addFundsAmount);
        if (!isNaN(amount) && amount > 0) {
            onAddFunds(amount);
            setAddFundsAmount('');
        }
    };

    if (!alpacaKeys) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold text-gray-800">Connect Your Brokerage</h2>
                <p className="text-gray-600 mt-2 max-w-md">Please go to the settings page to enter your Alpaca API keys to view and manage your live portfolio.</p>
                <button
                    onClick={() => onNavigate('settings')}
                    className="mt-6 bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all"
                >
                    Go to Settings
                </button>
            </div>
        );
    }
    
    if (isLoading) {
         return <div className="flex flex-col items-center justify-center h-full"><svg className="animate-spin h-10 w-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="mt-4 font-semibold text-gray-600">Connecting to your portfolio...</p></div>;
    }

    if (error) {
        return <div className="flex flex-col items-center justify-center h-full text-center"><p className="text-red-500 font-semibold">{error}</p><button onClick={() => onNavigate('settings')} className="mt-4 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Check API Keys</button></div>;
    }

    if (!alpacaData) {
        return <div className="flex items-center justify-center h-full">No portfolio data available.</div>;
    }

    const { account, history } = alpacaData;
    const portfolioValue = parseFloat(account.portfolio_value);
    const weeklyChange = portfolioValue - (history.equity[history.equity.length - 7] || parseFloat(account.last_equity));
    const isPositive = weeklyChange >= 0;
    const portfolioChartData = history.timestamp.map((ts, i) => ({ name: new Date(ts * 1000).toLocaleDateString(), value: history.equity[i] || 0 })).slice(-30);


    return (
        <div className="h-full w-full bg-white p-8 flex gap-8">
            <div className="flex-1 flex flex-col gap-8 overflow-y-auto pr-4 -mr-4">
                 {activeAiStrategy && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                        <p className="font-bold text-blue-800">AI Trader is Active</p>
                        <p className="text-sm text-blue-600">{activeAiStrategy.strategyType} with ${activeAiStrategy.investmentAmount.toLocaleString()} at {activeAiStrategy.riskTolerance}% risk.</p>
                    </div>
                )}
                <section>
                    <p className="text-gray-500 font-semibold">Current value</p>
                    <div className="flex items-end gap-4">
                        <h2 className="text-4xl font-bold text-gray-800">${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                        <p className={`font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                           {isPositive ? '+' : '-'}${Math.abs(weeklyChange).toFixed(2)} this week
                        </p>
                        <div className="flex-1 h-12">
                            <MiniChart data={portfolioChartData} color={isPositive ? '#22C55E' : '#EF4444'} />
                        </div>
                    </div>
                    <div className="mt-6 relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search symbol or company name"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </section>
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Investment Portfolios</h3>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">&lt;</button>
                            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200">&gt;</button>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {mockPortfolios.map(p => (
                            <div key={p.symbol} className="bg-gray-50/80 p-4 rounded-xl border border-gray-200">
                                <div className="flex items-center gap-3">
                                    <p.Icon className="w-8 h-8" />
                                    <p className="font-bold text-lg">{p.symbol}</p>
                                </div>
                                <div className="h-10 my-2">
                                    <MiniChart data={p.chartData} color={p.color} />
                                </div>
                                <div className="text-xs text-gray-500 flex justify-between"><span>Total Shares</span><span>{p.totalShares}</span></div>
                                <div className="text-xs text-gray-500 flex justify-between"><span>Total Return</span><span className={p.totalReturn.startsWith('+') ? 'text-green-500 font-semibold' : 'text-red-500 font-semibold'}>{p.totalReturn}</span></div>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Popular Stocks</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-500">This Week</span>
                            <button className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 8v5m5-5v8m5-11v11"/></svg>
                                Filter
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-400 px-4 py-2">
                            <div className="col-span-3">Advertisers</div>
                            <div className="col-span-2">Market Cap</div>
                            <div className="col-span-2">Volume</div>
                            <div className="col-span-3 text-center">Chart</div>
                            <div className="col-span-2 text-right">Trade</div>
                        </div>
                        <div className="space-y-2">
                            {filteredStocks.map(stock => (
                                <div key={stock.symbol} onClick={() => onViewStockDetail(stock)} className="grid grid-cols-12 gap-4 items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50/80 cursor-pointer">
                                    <div className="col-span-3 flex items-center gap-3">
                                        <stock.Icon className="w-8 h-8" />
                                        <div>
                                            <p className="font-bold text-gray-800">{stock.symbol}</p>
                                            <p className="text-xs text-gray-500 truncate">{stock.name}</p>
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="font-semibold text-gray-700">${(stock.marketCap / 1e9).toFixed(2)}B</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="font-semibold text-gray-700">${(stock.volume / 1e6).toFixed(2)}M</p>
                                    </div>
                                    <div className="col-span-3 h-10">
                                        <MiniChart data={stock.chartData} color={stock.changePercent >= 0 ? '#22C55E' : '#EF4444'} />
                                    </div>
                                    <div className="col-span-2 flex justify-end">
                                        <button onClick={(e) => { e.stopPropagation(); onPlaceTrade(stock.symbol); }} className="font-bold bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">Buy</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <aside className="w-80 shrink-0 flex flex-col gap-6">
                <button onClick={onOpenAiTrader} className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border-2 border-transparent hover:border-purple-200">
                    <div className="font-bold text-purple-800">AI Trader</div>
                    <BotIcon className="w-6 h-6 text-purple-600" />
                </button>
                <div className="bg-gray-50/80 p-6 rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center"><h4 className="font-bold text-gray-800">Add Money</h4><span className="text-xs font-bold text-gray-400 cursor-pointer">-</span></div>
                    <input 
                        type="number"
                        value={addFundsAmount}
                        onChange={e => setAddFundsAmount(e.target.value)}
                        placeholder="$0.00"
                        className="text-4xl font-bold my-2 bg-transparent w-full focus:outline-none"
                    />
                    <p className="text-xs text-gray-400">${parseFloat(account.cash).toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                    <div className="flex items-center gap-3 mt-4"><div className="w-8 h-6 rounded-sm bg-gray-300"></div><p className="font-semibold">US Dollar</p></div>
                    <button 
                        onClick={handleAddFunds}
                        disabled={!addFundsAmount || parseFloat(addFundsAmount) <= 0}
                        className="w-full mt-4 py-3 bg-gray-800 text-white font-bold rounded-lg hover:bg-black disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
                    >
                        Confirm
                    </button>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
                    <div className="flex justify-between items-center"><h4 className="font-bold text-purple-800">Setting a price alert</h4><BellIcon className="w-8 h-8 text-purple-400" /></div>
                    <p className="text-sm text-purple-700 my-2">Set a price alert to get notified when your target price is reached!</p>
                    <button className="bg-white text-purple-800 font-bold py-2 px-4 rounded-lg">Add</button>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 flex-1">
                    <div className="flex justify-between items-center mb-4"><h4 className="font-bold text-gray-800">Wishlist</h4><a href="#" className="text-sm font-semibold text-purple-600">See all</a></div>
                    <div className="space-y-3">
                        {mockWishlist.map(stock => (
                            <div key={stock.symbol} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <stock.Icon className="w-8 h-8" />
                                    <div>
                                        <p className="font-bold text-gray-800">{stock.symbol}</p>
                                        <p className="text-xs text-gray-500">{stock.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">${stock.price.toFixed(2)}</p>
                                    <p className={`text-xs font-semibold ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>{stock.changePercent.toFixed(1)}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default StocksPage;