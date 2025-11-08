import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, TooltipProps } from 'recharts';
import type { StockDetails } from '../types';
import { ArrowLeftIcon, ArrowDownIcon, ArrowUpIcon, IconMap } from './icons';

interface StockDetailPageProps {
    stock: StockDetails;
    onBack: () => void;
    onPlaceTrade: (symbol: string) => void;
}

const ChartTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-gray-800 p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-bold text-lg">${payload[0].value?.toFixed(2)}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      );
    }
    return null;
};

const StockDetailPage: React.FC<StockDetailPageProps> = ({ stock, onBack, onPlaceTrade }) => {
    const [timeframe, setTimeframe] = useState<'1W' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
    
    // Trade Panel State
    const [orderType, setOrderType] = useState('market');
    const [buyIn, setBuyIn] = useState('dollars');
    const [amount, setAmount] = useState('');

    const estimatedQuantity = useMemo(() => {
        const numAmount = parseFloat(amount);
        if (!numAmount || !stock.price) return 0;
        if (buyIn === 'dollars') {
            return (numAmount / stock.price).toFixed(5);
        }
        return numAmount; // if buying in shares
    }, [amount, buyIn, stock.price]);

    const chartData = useMemo(() => {
        // In a real app, this would fetch new data based on timeframe
        const data = stock.chartData;
        switch(timeframe) {
            case '1W': return data.slice(-7);
            case '1M': return data;
            case '3M': return data; // Mock, should be more data
            case '1Y': return data;
            case 'ALL': return data;
            default: return data;
        }
    }, [stock.chartData, timeframe]);
    
    const isPositive = stock.changePercent >= 0;

    return (
        <div className="h-full w-full bg-white p-8 flex flex-col overflow-y-auto">
            <header className="flex items-center mb-8">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 mr-4">
                    <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
                </button>
                <stock.Icon className="w-10 h-10 mr-4" />
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{stock.name} ({stock.symbol})</h1>
                    <div className="flex items-center space-x-2 text-lg">
                        <span className="font-bold">${stock.price.toFixed(2)}</span>
                        <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                            {isPositive ? '▲' : '▼'} {stock.changePercent.toFixed(2)}%
                        </span>
                        <span className="text-sm text-gray-500">Overnight</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-3 gap-8">
                {/* Main Content */}
                <main className="col-span-2 space-y-8">
                    {/* Chart */}
                    <section>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="stockChartGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={isPositive ? "#22C55E" : "#EF4444"} stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor={isPositive ? "#22C55E" : "#EF4444"} stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" hide />
                                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Area type="monotone" dataKey="value" stroke={isPositive ? "#22C55E" : "#EF4444"} strokeWidth={2} fill="url(#stockChartGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center space-x-2 mt-4">
                            {['1W', '1M', '3M', '1Y', 'ALL'].map(tf => (
                                <button key={tf} onClick={() => setTimeframe(tf as any)} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${timeframe === tf ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                                    {tf}
                                </button>
                            ))}
                        </div>
                    </section>
                    {/* About */}
                    <section>
                        <h2 className="text-xl font-bold mb-2">About</h2>
                        <p className="text-gray-600">{stock.about}</p>
                        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                            <div><p className="font-semibold text-gray-500">Employees</p><p className="font-bold">{stock.employees.toLocaleString()}</p></div>
                            <div><p className="font-semibold text-gray-500">Headquarters</p><p className="font-bold">{stock.headquarters}</p></div>
                            <div><p className="font-semibold text-gray-500">Founded</p><p className="font-bold">{stock.founded}</p></div>
                        </div>
                    </section>
                    {/* Key Statistics */}
                    <section>
                         <h2 className="text-xl font-bold mb-4">Key Statistics</h2>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            {Object.entries(stock.keyStatistics).map(([key, value]) => (
                                <div key={key} className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                    <span className="font-bold text-gray-800">
                                        {value === null ? '—' : (typeof value === 'number' && key.toLowerCase().includes('yield') ? `${value.toFixed(2)}%` : (typeof value === 'number' ? `$${(value / 1e6).toFixed(2)}M` : value))}
                                    </span>
                                </div>
                            ))}
                         </div>
                    </section>
                    {/* Analyst Ratings */}
                    <section>
                         <h2 className="text-xl font-bold mb-4">Analyst Ratings</h2>
                         <div className="flex gap-8 items-center">
                            <div className="w-32 h-32 relative">
                                <svg viewBox="0 0 36 36" className="w-full h-full"><circle cx="18" cy="18" r="15.915" fill="none" stroke="#e6e6e6" strokeWidth="3"></circle><circle cx="18" cy="18" r="15.915" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray={`${stock.analystRatings.buy}, 100`}></circle></svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <p className="text-3xl font-bold">{stock.analystRatings.buy.toFixed(0)}%</p>
                                    <p className="text-xs font-semibold text-gray-500">of 52 ratings</p>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center"><span className="w-16 font-semibold">Buy</span><div className="flex-1 bg-gray-200 h-2 rounded-full"><div className="bg-green-500 h-2 rounded-full" style={{width: `${stock.analystRatings.buy}%`}}></div></div><span className="w-12 text-right text-sm font-semibold">{stock.analystRatings.buy.toFixed(1)}%</span></div>
                                <div className="flex items-center"><span className="w-16 font-semibold">Hold</span><div className="flex-1 bg-gray-200 h-2 rounded-full"><div className="bg-gray-400 h-2 rounded-full" style={{width: `${stock.analystRatings.hold}%`}}></div></div><span className="w-12 text-right text-sm font-semibold">{stock.analystRatings.hold.toFixed(1)}%</span></div>
                                <div className="flex items-center"><span className="w-16 font-semibold">Sell</span><div className="flex-1 bg-gray-200 h-2 rounded-full"><div className="bg-red-500 h-2 rounded-full" style={{width: `${stock.analystRatings.sell}%`}}></div></div><span className="w-12 text-right text-sm font-semibold">{stock.analystRatings.sell.toFixed(1)}%</span></div>
                            </div>
                         </div>
                    </section>
                    {/* People Also Own */}
                    <section>
                        <h2 className="text-xl font-bold mb-4">People Also Own</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {stock.peopleAlsoOwn.map(s => (
                                <div key={s.symbol} className="p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center space-x-2"><s.Icon className="w-6 h-6" /><p className="font-bold">{s.symbol}</p></div>
                                    <p className="font-bold text-lg mt-2">${s.price.toFixed(2)}</p>
                                    <p className={`text-sm font-semibold ${s.changePercent >= 0 ? 'text-green-600' : 'text-red-500'}`}>{s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>

                {/* Right Sidebar (Trade Panel) */}
                <aside className="col-span-1">
                    <div className="sticky top-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold mb-4">Buy {stock.symbol}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center"><label className="font-semibold text-gray-600">Order type</label><select value={orderType} onChange={e => setOrderType(e.target.value)} className="bg-white border-2 border-gray-200 rounded-lg p-1 font-semibold"><option value="market">Market</option><option value="limit">Limit</option><option value="stop">Stop Loss</option></select></div>
                            <div className="flex justify-between items-center"><label className="font-semibold text-gray-600">Buy In</label><select value={buyIn} onChange={e => setBuyIn(e.target.value)} className="bg-white border-2 border-gray-200 rounded-lg p-1 font-semibold"><option value="dollars">Dollars</option><option value="shares">Shares</option></select></div>
                            <div>
                                <label className="font-semibold text-gray-600">Amount</label>
                                <div className="relative mt-1">
                                    {buyIn === 'dollars' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>}
                                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-7 p-2 border-2 border-gray-200 rounded-lg" />
                                </div>
                            </div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Estimated quantity</span><span className="font-semibold">{estimatedQuantity}</span></div>
                            <button onClick={() => onPlaceTrade(stock.symbol)} className="w-full bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition-all">Review Order</button>
                            <p className="text-center text-sm text-gray-500">$1.00 buying power available</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default StockDetailPage;