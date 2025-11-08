import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import type { DailySpendingData, ChartTransaction, BudgetCategory } from '../types';
import { TransactionIconMap } from './icons';

interface SpendingChartProps {
    allCategories: BudgetCategory[];
}

const generateMockData = (categories: BudgetCategory[]): DailySpendingData[] => {
  const data: DailySpendingData[] = [];
  const categoryIconMap: { [key: string]: keyof typeof TransactionIconMap } = { 'Groceries': 'GroceriesIcon', 'Gas / Fuel': 'CarIcon', 'Restaurants': 'CoffeeIcon', 'Shopping': 'ShoppingBagIcon', 'Internet': 'ZapIcon' };
  const usableCategories = categories.filter(c => categoryIconMap[c.name]);
  
  // Return empty if no usable categories to prevent errors
  if (usableCategories.length === 0) {
      for (let i = 14; i >= 0; i--) {
          const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
          data.push({ date, total: 0, transactions: [] });
      }
      return data;
  }

  for (let i = 14; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    let numTransactions = Math.floor(Math.random() * 4);
    // Guarantee at least one zero-spending day for visual testing
    if (i === 10) {
        numTransactions = 0;
    }

    let total = 0;
    const transactions: ChartTransaction[] = [];
    for (let j = 0; j < numTransactions; j++) {
      const amount = Math.random() * 60 + 5;
      total += amount;
      const templateCat = usableCategories[(i + j) % usableCategories.length];
      transactions.push({ id: `${i}-${j}`, description: templateCat.name, amount, category: templateCat.name, iconName: categoryIconMap[templateCat.name] });
    }
    data.push({ date, total, transactions });
  }
  return data;
};

const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data: DailySpendingData = payload[0].payload.fullData;
    if (!data) return null;
    return (
      <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 w-64 animate-fade-in-fast">
        <p className="font-bold text-base mb-2">{format(parseISO(data.date), 'EEEE, MMM d')}</p>
        <p className="text-sm text-gray-600 mb-2">Total Spent: <span className="font-bold text-gray-900">${data.total.toFixed(2)}</span></p>
        {data.transactions.length > 0 ? (
          <div className="space-y-2 border-t border-gray-200 pt-2 max-h-40 overflow-y-auto">
            {data.transactions.map(tx => {
              const Icon = TransactionIconMap[tx.iconName];
              return (
                <div key={tx.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                    <span>{tx.category}</span>
                  </div>
                  <span className="font-semibold">${tx.amount.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        ) : (
             <p className="text-sm text-gray-500 border-t pt-2 mt-2">No spending on this day.</p>
        )}
      </div>
    );
  }
  return null;
};

const CustomBar = (props: any) => {
    const { x, y, width, height, value, fill, maxBarHeight } = props;

    // The bottom of any bar is always y + height.
    const bottomY = y + height;

    // Background bar has a fixed height and is aligned to the bottom.
    const bgHeight = maxBarHeight;
    const bgY = bottomY - bgHeight;

    const barHeight = height; // Can be 0 for zero-spending days.
    const circleY = y;

    const circleRadius = 18;
    const circleGlowRadius = 22;

    return (
        <g style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))' }}>
            {/* Background Bar */}
            <rect 
                x={x} 
                y={bgY} 
                width={width} 
                height={bgHeight} 
                fill={fill} 
                opacity={0.15} 
                rx={width / 2} 
                ry={width / 2}
            />
            {/* Foreground Bar */}
            {barHeight > 0 && (
                <rect 
                    x={x} 
                    y={y} 
                    width={width} 
                    height={barHeight} 
                    fill={fill} 
                    rx={width / 2} 
                    ry={width / 2}
                />
            )}
            {/* Value Circle */}
            <circle cx={x + width / 2} cy={circleY} r={circleGlowRadius} fill={fill} opacity={0.3} />
            <circle cx={x + width / 2} cy={circleY} r={circleRadius} fill="white" />
            <text x={x + width / 2} y={circleY} textAnchor="middle" dy=".3em" fill="#333" fontSize="12" fontWeight="bold">
                {Math.round(value)}
            </text>
        </g>
    );
};

const SpendingChart: React.FC<SpendingChartProps> = ({ allCategories }) => {
  const rawData = useMemo(() => generateMockData(allCategories), [allCategories]);

  const barColors = ["#818cf8", "#60a5fa", "#38bdf8", "#22d3ee", "#6ee7b7", "#a78bfa"];

  const { processedData, maxDailyTotal } = useMemo(() => {
    const data = rawData.map(day => ({
        date: day.date,
        total: day.total,
        fullData: day,
    }));
    const maxTotal = Math.max(...rawData.map(d => d.total));
    // Set max to actual max so tallest bar is at the top of its range.
    return { processedData: data, maxDailyTotal: maxTotal > 0 ? maxTotal : 100 };
  }, [rawData]);

  const maxBarHeight = 150; // A fixed pixel height for the background bars.
  // Add a negative lower bound to the domain to raise the baseline, giving room for the '0' circle.
  const yDomainMin = -(maxDailyTotal * 0.2); 

  return (
    <div className="h-full w-full flex flex-col">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={processedData} margin={{ top: 30, right: 10, left: -20, bottom: 0 }} barCategoryGap="35%">
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 16, fontWeight: '600' }} 
            tickFormatter={(dateStr) => format(parseISO(dateStr), 'd')} 
            interval="preserveStartEnd" 
          />
          <YAxis hide={true} domain={[yDomainMin, maxDailyTotal]} />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={false} 
            animationDuration={150} 
          />
          <Bar dataKey="total" shape={(props: any) => <CustomBar {...props} maxBarHeight={maxBarHeight} />}>
            {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;