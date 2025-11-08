import React from 'react';
import { format, parseISO, isSameDay } from 'date-fns';
import type { WalletAccount, AutomationRule, AutomationMilestone, Bill, IncomeSource, CustomCalendarEvent, CalendarEvent, WalletTransaction, BudgetCategory, TradeEvent, StockDetails } from '../types';
import { IconMap } from './icons';

interface EventPopoverProps {
    event: CalendarEvent | null;
    position: { top: number, left?: number, right?: number } | null;
    accounts: WalletAccount[];
    allCategories: BudgetCategory[];
    allEvents: CalendarEvent[];
    popularStocks: StockDetails[];
}

const eventColors: Record<Exclude<CalendarEvent['type'], 'transaction' | 'custom' | 'stock_buy' | 'stock_sell'>, { border: string, text: string, bg: string }> = {
  goal: { border: 'border-green-500', text: 'text-green-800', bg: 'bg-green-100' },
  milestone: { border: 'border-yellow-500', text: 'text-yellow-800', bg: 'bg-yellow-100' },
  bill: { border: 'border-red-500', text: 'text-red-800', bg: 'bg-red-100' },
  income: { border: 'border-blue-500', text: 'text-blue-800', bg: 'bg-blue-100' },
};

const EventPopover: React.FC<EventPopoverProps> = ({ event, position, accounts, allCategories, allEvents, popularStocks }) => {
    if (!event || !position) return null;

    const color = event.color ? null : eventColors[event.type as keyof typeof eventColors];
    const data = event.data as any;

    const renderContent = () => {
        switch (event.type) {
            case 'stock_buy':
            case 'stock_sell':
                const tradeData = event.data as TradeEvent;
                const stockInfo = popularStocks.find(s => s.symbol === tradeData.symbol);
                const totalValue = tradeData.qty * tradeData.price;
                const colorClass = event.type === 'stock_buy' ? 'text-green-600' : 'text-red-600';
                // Fix: Renamed 'Icon' to 'TradeIcon' to avoid redeclaration.
                const TradeIcon = stockInfo?.Icon || IconMap.StockIcon;
                
                return (
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-2">
                                {TradeIcon && <TradeIcon className="w-6 h-6 text-gray-600" />}
                                <div>
                                    <span className={`font-bold text-lg ${colorClass}`}>{event.type === 'stock_buy' ? 'Buy' : 'Sell'} {tradeData.symbol}</span>
                                    <p className="text-xs text-gray-500">{stockInfo?.name}</p>
                                </div>
                            </div>
                            <span className="font-bold text-lg text-gray-800">${totalValue.toFixed(2)}</span>
                        </div>
                        
                        {tradeData.isAiTrade && (
                            <div className="mt-2 text-xs font-semibold text-blue-600 bg-blue-50 p-2 rounded-md flex items-center space-x-2">
                                <IconMap.BotIcon className="w-4 h-4" />
                                <span>AI Trade Executed</span>
                            </div>
                        )}

                        <div className="mt-4 text-left text-sm text-gray-500 space-y-1 border-t pt-2">
                            <p>Shares: <span className="font-semibold text-gray-700">{tradeData.qty}</span></p>
                            <p>Price: <span className="font-semibold text-gray-700">${tradeData.price.toFixed(2)} / share</span></p>
                            <p>Time: <span className="font-semibold text-gray-700">{format(event.date, 'p')}</span></p>
                        </div>
                    </div>
                );
            case 'transaction':
                const txData = event.data as WalletTransaction;
                const category = allCategories.find(c => c.name === txData.category);
                // Fix: Renamed 'Icon' to 'CategoryIcon' to avoid redeclaration.
                const CategoryIcon = category?.Icon || IconMap.ShoppingBagIcon;

                return (
                    <div>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-2">
                                {CategoryIcon && <CategoryIcon className="w-6 h-6 text-gray-600" />}
                                <span className="font-bold text-lg text-gray-800">{txData.category || 'Transaction'}</span>
                            </div>
                            <span className="font-bold text-lg text-gray-800">${txData.amount.toFixed(2)}</span>
                        </div>
                        <div className="mt-4 text-left text-sm text-gray-500 space-y-1">
                            <p>
                                From: <span className="font-semibold text-gray-700">{txData.source}</span>
                            </p>
                            <p>
                                Time: <span className="font-semibold text-gray-700">{format(event.date, 'p')}</span>
                            </p>
                        </div>
                    </div>
                );
            case 'bill':
                const BillIcon = IconMap[data.iconName as keyof typeof IconMap];
                return (
                    <>
                        <div className="flex items-center space-x-2">
                            {BillIcon && <BillIcon className={`w-5 h-5 ${color?.text}`} />}
                            <span className={`font-semibold text-sm uppercase tracking-wider ${color?.text}`}>Bill Due</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 my-2">{data.name}</h3>
                        <p className="font-bold text-2xl text-gray-800">${data.amount.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">Due on the {data.dueDate} of the month.</p>
                    </>
                );
            case 'income':
                const incomeAccount = accounts.find(a => a.id === data.accountId);
                const IncomeIcon = IconMap[incomeAccount?.iconName || 'DollarSignIcon'];
                return (
                    <>
                        <div className="flex items-center space-x-2">
                            {IncomeIcon && <IncomeIcon className={`w-5 h-5 ${color?.text}`} />}
                            <span className={`font-semibold text-sm uppercase tracking-wider ${color?.text}`}>Projected Income</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 my-2">{data.name}</h3>
                        <p className="text-sm text-gray-500">
                            Est. <span className="font-bold text-gray-700">${data.expectedAmount?.toLocaleString() || 'N/A'}</span> deposit to <span className="font-bold text-gray-700">{incomeAccount?.name || '...'}</span>.
                        </p>
                        <p className="text-xs text-gray-500 capitalize mt-1">Frequency: {data.depositFrequency}</p>
                    </>
                );
            case 'goal':
                const goalAccount = accounts.find(a => a.id === data.destinationAccountId);
                const progress = (goalAccount && data.goal > 0) ? Math.min((goalAccount.balance / data.goal) * 100, 100) : 0;
                return (
                    <>
                        <div className="flex items-center space-x-2">
                            <IconMap.TrendingUpIcon className={`w-5 h-5 ${color?.text}`} />
                            <span className={`font-semibold text-sm uppercase tracking-wider ${color?.text}`}>Goal Projection</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 my-2">{data.name}</h3>
                        <p className="text-sm text-gray-500">
                            Projected completion on <span className="font-bold text-gray-700">{data.dueDate || format(event.date, 'MMMM d, yyyy')}</span>.
                        </p>
                        <div className="mt-3">
                            <div className="flex justify-between text-xs font-semibold text-gray-600">
                                <span>${goalAccount?.balance.toLocaleString() || '0'}</span>
                                <span>${data.goal.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                    </>
                );
            case 'milestone':
                 return (
                    <>
                        <div className="flex items-center space-x-2">
                            <IconMap.ZapIcon className={`w-5 h-5 ${color?.text}`} />
                            <span className={`font-semibold text-sm uppercase tracking-wider ${color?.text}`}>Milestone Projection</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 my-2">{data.name}</h3>
                        <p className="text-sm text-gray-500">
                            Projected for <span className="font-bold text-gray-700">{data.dueDate || format(event.date, 'MMMM d, yyyy')}</span>.
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Triggers at {data.triggerPercentage}% of '{data.sourceGoalName}'.
                        </p>
                         {data.advice && (
                            <div className={`mt-3 p-2 rounded-md text-xs ${color?.bg} ${color?.text}`}>
                                <p><span className="font-bold">AI Advice:</span> {data.advice}</p>
                            </div>
                        )}
                    </>
                 );
            case 'custom':
                 return (
                    <>
                         <div className="flex items-center space-x-2">
                             <div className="w-5 h-5 rounded-full" style={{ backgroundColor: data.color }}></div>
                             <span className="font-semibold text-sm uppercase tracking-wider text-gray-600">Event</span>
                         </div>
                         <h3 className="text-xl font-bold text-gray-800 my-2">{data.title}</h3>
                         <p className="text-sm text-gray-500">
                             Date: <span className="font-bold text-gray-700">{format(new Date(data.date), 'MMMM d, yyyy')}</span>
                         </p>
                         {data.startTime && (
                             <p className="text-sm text-gray-500">
                                 Time: <span className="font-bold text-gray-700">{data.startTime} - {data.endTime}</span>
                             </p>
                         )}
                         {data.description && (
                             <p className="text-sm text-gray-600 mt-2">{data.description}</p>
                         )}
                    </>
                 );
            default: return null;
        }
    }

    const style: React.CSSProperties = position.left 
        ? { top: position.top, left: position.left, transform: 'translateY(0)' }
        : { top: position.top, right: position.right, transform: 'translateY(0)' };
    
    const borderColor = 
        event.type === 'stock_buy' ? 'border-green-500' :
        event.type === 'stock_sell' ? 'border-red-500' :
        color?.border || 'border-gray-200';

    const popoverClasses = `bg-white text-gray-800 ${borderColor}`;
    
    const sizeClasses = (event.type === 'transaction' || event.type === 'stock_buy' || event.type === 'stock_sell')
        ? 'w-72'
        : 'w-80';

    return (
        <div style={style} className={`fixed z-30 rounded-2xl shadow-xl border p-4 animate-fade-in-fast ${popoverClasses} ${sizeClasses}`}>
            {renderContent()}
        </div>
    );
};

export default EventPopover;