import React, { useState, useEffect, useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, TooltipProps } from 'recharts';
import { ChevronDownIcon, ShoppingBagIcon, TransactionIconMap } from './icons';
import { WalletTransaction, BudgetCategory } from '../types';

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-purple-600 text-white p-2 rounded-lg shadow-lg">
          <p className="text-sm">{label}</p>
          <p className="font-bold">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
};

interface SpendingChartPanelProps {
    history: WalletTransaction[];
    transactions: WalletTransaction[];
    allCategories: BudgetCategory[];
}

type Timeframe = 'Month' | 'Week' | 'Day';

const SpendingChartPanel: React.FC<SpendingChartPanelProps> = ({ history, transactions, allCategories }) => {
    const [selectedCategory, setSelectedCategory] = useState('All Spending');
    const [timeframe, setTimeframe] = useState<Timeframe>('Month');

    const chartData = useMemo(() => {
        const filteredTransactions = transactions
            .filter(t => t.type === 'purchase')
            .filter(t => selectedCategory === 'All Spending' || t.category === selectedCategory);

        const getDateKey = (date: Date): string => {
            const year = date.getFullYear();
            if (timeframe === 'Day') {
                return date.toISOString().split('T')[0]; // YYYY-MM-DD
            }
            if (timeframe === 'Week') {
                const startOfWeek = new Date(date);
                startOfWeek.setDate(date.getDate() - date.getDay());
                return startOfWeek.toISOString().split('T')[0];
            }
            // Month
            return `${year}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        };

        const grouped = filteredTransactions.reduce((acc, t) => {
            const key = getDateKey(new Date(t.date));
            if (!acc[key]) {
                acc[key] = 0;
            }
            acc[key] += t.amount;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(grouped)
            .map(([date, amount]) => ({ date, amount }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            
    }, [transactions, selectedCategory, timeframe]);
    
    const selectedCategoryIcon = allCategories.find(c => c.name === selectedCategory)?.Icon || ShoppingBagIcon;
    const Icon = selectedCategoryIcon;
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
                       <Icon className="w-6 h-6" />
                    </div>
                    <div className="relative">
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="font-bold text-xl appearance-none bg-transparent pr-8 focus:outline-none cursor-pointer"
                        >
                            <option value="All Spending">All Spending</option>
                            {allCategories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                        <ChevronDownIcon className="w-5 h-5 absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>
            
            <div className="flex justify-around text-sm font-semibold text-gray-500 border-b mb-6">
                <button onClick={() => setTimeframe('Month')} className={`py-2 transition-colors ${timeframe === 'Month' ? 'text-blue-500 border-b-2 border-blue-500' : 'hover:text-blue-500'}`}>Month</button>
                <button onClick={() => setTimeframe('Week')} className={`py-2 transition-colors ${timeframe === 'Week' ? 'text-blue-500 border-b-2 border-blue-500' : 'hover:text-blue-500'}`}>Week</button>
                <button onClick={() => setTimeframe('Day')} className={`py-2 transition-colors ${timeframe === 'Day' ? 'text-blue-500 border-b-2 border-blue-500' : 'hover:text-blue-500'}`}>Day</button>
            </div>

            <div className="h-64 w-full">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis 
                                dataKey="date" 
                                tickLine={false} 
                                axisLine={false} 
                                tick={{fill: '#9CA3AF', fontSize: 12}} 
                                tickFormatter={(tick) => {
                                    const date = new Date(tick);
                                    if (timeframe === 'Day') return date.toLocaleDateString('en-US', { day: '2-digit' });
                                    return date.toLocaleDateString('en-US', { month: 'short' });
                                }}
                            />
                            <YAxis hide={true} domain={['dataMin - 10', 'dataMax + 20']} />
                            <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: 'none' }} />
                            <Area type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={3} fill="url(#colorSpending)" />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <p>No spending data for this period or category.</p>
                    </div>
                )}
            </div>
            
            <div className="mt-auto pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">History</h3>
                    <a href="#" className="text-sm font-semibold text-gray-500 hover:text-gray-800">See all</a>
                </div>
                <div className="space-y-3">
                    {history.length > 0 ? history.map((item, index) => {
                        const Icon = item.category ? allCategories.find(c => c.name === item.category)?.Icon || ShoppingBagIcon : ShoppingBagIcon;
                        return (
                            <div key={index} className="flex items-center p-2">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-4 text-blue-500">
                                    <Icon className="w-5 h-5"/>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold">{item.description}</p>
                                    <p className="text-xs text-gray-400">{new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <p className="font-bold">{item.type === 'deposit' ? `+` : `-`}${item.amount.toFixed(2)}</p>
                            </div>
                        )
                    }) : (
                        <div className="text-center text-gray-400 py-4">
                            <p>No recent history to show.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpendingChartPanel;