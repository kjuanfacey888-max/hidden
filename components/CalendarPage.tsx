import React, { useState, useMemo, useEffect } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths,
  addDays, eachHourOfInterval, getDay, isSameDay, parseISO, setDate as setDayOfMonth, getDaysInMonth, addWeeks, subWeeks,
  differenceInMinutes, setHours, setMinutes, startOfDay, add, Duration, addMinutes
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon, PlusCircleIcon, SearchIcon, BellIcon, MoreHorizontalIcon } from './icons';
import type { CalendarEvent, AutomationRule, IncomeSource, AutomationMilestone, WalletAccount, Bill, CustomCalendarEvent, WalletTransaction, BudgetCategory, TradeEvent, StockDetails } from '../types';
import EventPopover from './EventPopover';

// Fix: Add 'custom' event type to the eventColors object and its type definition.
const eventColors: Record<Exclude<CalendarEvent['type'], 'transaction' | 'stock_buy' | 'stock_sell'>, { dot: string, bg: string, text: string, border: string }> = {
  goal: { dot: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-500' },
  milestone: { dot: 'bg-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-500' },
  bill: { dot: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-500' },
  income: { dot: 'bg-blue-500', bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-500' },
  custom: { dot: 'bg-gray-500', bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-500' },
};

const getEventDescription = (event: CalendarEvent, accounts: WalletAccount[]): string => {
    switch (event.type) {
        case 'goal':
            const goalData = event.data as AutomationRule;
            const account = accounts.find(a => a.id === goalData.destinationAccountId);
            return `Projected for ${account?.name || '...'}`;
        case 'milestone':
            const milestoneData = event.data as AutomationMilestone & { sourceGoalName?: string };
            return `For goal: '${milestoneData.sourceGoalName || '...'}'`;
        case 'bill':
            const billData = event.data as Bill;
            return `Amount due: $${billData.amount.toFixed(2)}`;
        case 'income':
            const incomeData = event.data as IncomeSource;
            return `Est. amount: $${incomeData.expectedAmount?.toLocaleString() || 'N/A'}`;
        case 'custom':
            const customData = event.data as CustomCalendarEvent;
            return customData.description || `On ${format(event.date, 'MMMM d')}`;
        case 'transaction':
             const txData = event.data as WalletTransaction;
             return `$${txData.amount.toFixed(2)} from ${txData.source || '...'}`;
        default:
            return format(event.date, 'MMMM d, yyyy');
    }
}

interface CalendarPageProps {
  rules: AutomationRule[];
  incomeSources: IncomeSource[];
  milestones: AutomationMilestone[];
  accounts: WalletAccount[];
  bills: Bill[];
  customEvents: CustomCalendarEvent[];
  onAddEvent: (defaultDate?: string) => void;
  allCategories: BudgetCategory[];
  tradeHistory: TradeEvent[];
  popularStocks: StockDetails[];
}

const calculateProjectionDate = (
    targetAmount: number,
    currentBalance: number,
    sourceTriggers: string[],
    percentage: number,
    allIncomeSources: IncomeSource[]
): Date | null => {
    const amountNeeded = Math.max(0, targetAmount - currentBalance);
    if (amountNeeded <= 0) return new Date(); // Already achieved

    const getMonthlyAmount = (source: IncomeSource): number => {
        const amount = source.expectedAmount || 0;
        if (amount <= 0) return 0;
        switch (source.depositFrequency) {
            case 'daily': return amount * 30.44;
            case 'weekly': return amount * 4.33;
            case 'bi-weekly': return amount * 2.167;
            case 'monthly': return amount;
            default: return 0;
        }
    };
    
    // This is a simplified calculation that doesn't handle deep chaining
    const directIncomeSources = sourceTriggers
        .map(id => allIncomeSources.find(s => s.id === id))
        .filter((s): s is IncomeSource => !!s);
    
    if (directIncomeSources.length === 0) {
        return null;
    }

    const totalMonthlyContribution = directIncomeSources.reduce((total, source) => {
        return total + (getMonthlyAmount(source) * (percentage / 100));
    }, 0);

    if (totalMonthlyContribution <= 0) return null;

    const monthsNeeded = amountNeeded / totalMonthlyContribution;
    return addMonths(new Date(), monthsNeeded);
};

const CalendarPage: React.FC<CalendarPageProps> = ({ rules, incomeSources, milestones, accounts, bills, customEvents, onAddEvent, allCategories, tradeHistory, popularStocks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeView, setActiveView] = useState<'Month' | 'Week' | 'Day'>('Month');
  const [activeEvent, setActiveEvent] = useState<CalendarEvent | null>(null);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number, left?: number, right?: number } | null>(null);

  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];

    const monthStart = startOfMonth(currentDate);
    const viewStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const viewEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 1 });

    // Process transactions from all accounts
    accounts.forEach(account => {
        account.history.forEach(tx => {
            if (tx.type === 'purchase' || tx.type === 'withdrawal') {
                const txDate = parseISO(tx.date);
                const category = allCategories.find(c => c.name === tx.category);
                const color = category ? category.color : '#A0AEC0'; // Default to gray

                 events.push({
                    id: tx.id,
                    date: txDate,
                    title: tx.description || tx.type,
                    type: 'transaction',
                    data: { ...tx, source: account.name }, // Add source account name for popover
                    startTime: format(txDate, 'HH:mm'),
                    endTime: format(addMinutes(txDate, 30), 'HH:mm'),
                    color: color,
                });
            }
        });
    });

    tradeHistory.forEach(trade => {
        const tradeDate = parseISO(trade.date);
        events.push({
            id: trade.id,
            date: tradeDate,
            title: `${trade.side.toUpperCase()} ${trade.symbol}`,
            type: trade.side === 'buy' ? 'stock_buy' : 'stock_sell',
            data: trade,
            startTime: format(tradeDate, 'HH:mm'),
            endTime: format(addMinutes(tradeDate, 30), 'HH:mm'),
        });
    });

    customEvents.forEach(e => events.push({ id: e.id, date: parseISO(e.date), title: e.title, type: 'custom', data: e, startTime: e.startTime, endTime: e.endTime, color: e.color }));

    bills.forEach(bill => {
        const dayOfMonth = parseInt(bill.dueDate.replace(/\D/g, ''), 10);
        if (!isNaN(dayOfMonth)) {
            [-1, 0, 1].forEach(monthOffset => {
                const targetMonth = addMonths(currentDate, monthOffset);
                if (dayOfMonth <= getDaysInMonth(targetMonth)) {
                    const date = setDayOfMonth(targetMonth, dayOfMonth);
                    if (date >= viewStart && date <= viewEnd) {
                        events.push({ id: `${bill.id}-${format(date, 'yyyy-MM')}`, date, title: bill.name, type: 'bill', data: bill, startTime: '09:00', endTime: '09:30' });
                    }
                }
            });
        }
    });

    incomeSources.forEach(source => {
        if (!source.depositFrequency || !source.expectedAmount || !source.nextDepositDate) return;

        const anchorDate = parseISO(source.nextDepositDate);
        if (isNaN(anchorDate.getTime())) return;

        let intervalOptions: Duration = {};
        switch(source.depositFrequency) {
            case 'weekly': intervalOptions = { weeks: 1 }; break;
            case 'bi-weekly': intervalOptions = { weeks: 2 }; break;
            case 'monthly': intervalOptions = { months: 1 }; break;
            case 'daily': intervalOptions = { days: 1 }; break;
        }
        
        if (Object.keys(intervalOptions).length === 0) return;

        let currentDateInLoop = anchorDate;
        
        if (currentDateInLoop > viewEnd) return;

        while(currentDateInLoop < viewStart) {
            currentDateInLoop = add(currentDateInLoop, intervalOptions);
        }

        while(currentDateInLoop <= viewEnd) {
            events.push({
                id: `${source.id}-${format(currentDateInLoop, 'yyyy-MM-dd')}`,
                date: currentDateInLoop,
                title: source.name,
                type: 'income',
                data: source,
                startTime: '09:00',
                endTime: '09:30'
            });
            currentDateInLoop = add(currentDateInLoop, intervalOptions);
        }
    });
    
    rules.forEach(rule => {
        let projectionDate = rule.dueDate ? parseISO(rule.dueDate) : null;

        if (!projectionDate) {
            const account = accounts.find(a => a.id === rule.destinationAccountId);
            if (account) {
                 projectionDate = calculateProjectionDate(rule.goal, account.balance, rule.sourceTriggers, rule.percentage, incomeSources);
            }
        }
        
        if (projectionDate) {
             events.push({
                id: `${rule.id}-due`, date: projectionDate, title: `${rule.name} Due`, type: 'goal', data: rule,
            });
        }
        if (rule.startDate) {
            events.push({
                id: `${rule.id}-start`, date: parseISO(rule.startDate), title: `${rule.name} Start`, type: 'goal', data: rule,
            });
        }
    });
    
    milestones.forEach(milestone => {
        let projectionDate = milestone.dueDate ? parseISO(milestone.dueDate) : null;

        if (!projectionDate) {
            const sourceRule = rules.find(r => r.id === milestone.sourceGoalId);
            if (sourceRule) {
                const account = accounts.find(a => a.id === sourceRule.destinationAccountId);
                if (account) {
                    const targetAmountForMilestone = sourceRule.goal * (milestone.triggerPercentage / 100);
                    projectionDate = calculateProjectionDate(targetAmountForMilestone, account.balance, sourceRule.sourceTriggers, sourceRule.percentage, incomeSources);
                }
            }
        }

        const sourceGoalName = rules.find(r => r.id === milestone.sourceGoalId)?.name || '...';
        const milestoneData = { ...milestone, sourceGoalName };

        if (projectionDate) {
            events.push({
                id: `${milestone.id}-due`, date: projectionDate, title: milestone.name, type: 'milestone', data: milestoneData,
            });
        }
        if (milestone.startDate) {
            events.push({
                id: `${milestone.id}-start`, date: parseISO(milestone.startDate), title: `${milestone.name} Start`, type: 'milestone', data: milestoneData,
            });
        }
    });

    return events.sort((a, b) => {
        if (a.date.getTime() !== b.date.getTime()) return a.date.getTime() - b.date.getTime();
        if (a.startTime && b.startTime) return a.startTime.localeCompare(b.startTime);
        if (a.startTime) return -1;
        if (b.startTime) return 1;
        return 0;
    });
  }, [rules, incomeSources, milestones, bills, customEvents, currentDate, accounts, allCategories, tradeHistory, popularStocks]);

  const handleEventMouseEnter = (event: CalendarEvent, e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const popoverWidth = 320; 
    if (window.innerWidth - rect.right > popoverWidth + 20) {
      setPopoverPosition({ top: rect.top, left: rect.right + 10, });
    } else {
      setPopoverPosition({ top: rect.top, right: window.innerWidth - rect.left + 10, });
    }
    setActiveEvent(event);
  };
  const handleEventMouseLeave = () => { setActiveEvent(null); setPopoverPosition(null); };

  const timeToRow = (time: string): number => {
      const [hour, minute] = time.split(':').map(Number);
      // Grid starts at 6am. Row 1: header, Row 2: all-day, Row 3: 6am.
      const minutesFromStart = (hour - 6) * 60 + minute;
      return (minutesFromStart / 30) + 3;
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return (
      <div className="grid grid-cols-7 flex-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => <div key={day} className="text-center font-semibold text-gray-500 text-sm py-2">{day}</div>)}
        {days.map(day => (
          <div key={day.toString()} className={`border-t border-r border-gray-200 p-2 flex flex-col ${!isSameMonth(day, monthStart) ? 'bg-gray-50 text-gray-400' : ''}`} onClick={() => onAddEvent(format(day, 'yyyy-MM-dd'))}>
            <span className={`font-semibold text-sm ${isToday(day) ? 'bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>{format(day, 'd')}</span>
            <div className="mt-1 space-y-1 overflow-y-auto">
              {calendarEvents.filter(e => isSameDay(e.date, day)).map(event => {
                 if (event.type === 'stock_buy' || event.type === 'stock_sell') {
                    const bgColor = event.type === 'stock_buy' ? 'bg-green-500' : 'bg-red-500';
                    return (
                        <div
                            key={event.id}
                            onMouseEnter={(e) => handleEventMouseEnter(event, e)}
                            onMouseLeave={handleEventMouseLeave}
                            className={`p-1 rounded text-xs font-semibold cursor-pointer text-white truncate ${bgColor}`}
                        >
                            {event.title}
                        </div>
                    );
                }
                if (event.type === 'transaction' && event.color) {
                    return (
                        <div
                            key={event.id}
                            onMouseEnter={(e) => handleEventMouseEnter(event, e)}
                            onMouseLeave={handleEventMouseLeave}
                            className="p-1 rounded text-xs font-semibold cursor-pointer text-white truncate"
                            style={{ backgroundColor: event.color }}
                        >
                            {event.title}
                        </div>
                    );
                }
                const colorClasses = eventColors[event.type as keyof typeof eventColors];
                return (
                    <div key={event.id} onMouseEnter={(e) => handleEventMouseEnter(event, e)} onMouseLeave={handleEventMouseLeave} className={`p-1 rounded text-xs font-semibold cursor-pointer ${colorClasses.bg} ${colorClasses.text} truncate`}>
                      {event.title}
                    </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderTimedView = (days: Date[]) => {
      const hours = eachHourOfInterval({ start: setHours(new Date(), 6), end: setHours(new Date(), 23) });
      const dayEvents = calendarEvents.filter(e => days.some(d => isSameDay(e.date, d)));
      const timedEvents = dayEvents.filter(e => e.startTime && e.endTime);
      const allDayEvents = dayEvents.filter(e => !e.startTime || !e.endTime);

      return (
          <div className={`${days.length === 1 ? 'time-grid-day' : 'time-grid'} flex-1 border-t border-gray-200 relative`}>
              {/* Headers */}
              <div className="row-start-1 col-start-1"></div>
              {days.map((day, i) => (
                  <div key={i} className={`row-start-1 col-start-${i + 2} text-center p-2 border-b`}>
                      <p className="text-sm text-gray-500">{format(day, 'EEE')}</p>
                      <p className={`font-bold text-lg ${isToday(day) ? 'text-purple-600' : ''}`}>{format(day, 'd')}</p>
                  </div>
              ))}

              {/* All-day section */}
              <div className={`row-start-2 col-start-1`}></div>
              {days.map((day, i) => (
                  <div key={i} className={`row-start-2 col-start-${i+2} border-r border-b p-1 space-y-1`}>
                      {allDayEvents.filter(e => isSameDay(e.date, day)).map(event => {
                           if (event.type === 'transaction' && event.color) {
                                return (
                                    <div
                                        key={event.id}
                                        onMouseEnter={(e) => handleEventMouseEnter(event, e)}
                                        onMouseLeave={handleEventMouseLeave}
                                        className="p-1 rounded text-xs font-semibold cursor-pointer text-white truncate"
                                        style={{ backgroundColor: event.color }}
                                    >
                                        {event.title}
                                    </div>
                                );
                            }
                            const colorClasses = eventColors[event.type as keyof typeof eventColors];
                            return (
                                <div key={event.id} onMouseEnter={(e) => handleEventMouseEnter(event, e)} onMouseLeave={handleEventMouseLeave} className={`p-1 rounded text-xs font-semibold cursor-pointer ${colorClasses.bg} ${colorClasses.text} truncate`}>
                                {event.title}
                                </div>
                            )
                      })}
                  </div>
              ))}

              {/* Time labels and grid lines */}
              {hours.map((hour, i) => (
                  <React.Fragment key={i}>
                      <div className={`row-start-${i * 2 + 3} col-start-1 text-right pr-2 text-xs text-gray-400 -translate-y-2`}>{format(hour, 'ha')}</div>
                      {days.map((day, j) => (
                          <div key={`${i}-${j}`} style={{ gridRow: i * 2 + 3, gridColumn: j + 2 }} className={`border-r border-b border-gray-200`}></div>
                      ))}
                      {days.map((day, j) => (
                          <div key={`${i}-${j}-half`} style={{ gridRow: i * 2 + 4, gridColumn: j + 2 }} className={`border-r border-b border-gray-200/50`}></div>
                      ))}
                  </React.Fragment>
              ))}

              {/* Timed Events */}
              {timedEvents.map(event => {
                  const dayIndex = days.findIndex(d => isSameDay(event.date, d));
                  if (dayIndex === -1) return null;

                  const startRow = timeToRow(event.startTime!);
                  const endRow = timeToRow(event.endTime!);
                  const duration = endRow - startRow;
                  const isTrade = event.type === 'stock_buy' || event.type === 'stock_sell';
                  const colorClasses = isTrade ? null : (event.type === 'transaction' ? null : eventColors[event.type as keyof typeof eventColors]);
                  const tradeColor = isTrade ? (event.type === 'stock_buy' ? '#22C55E' : '#EF4444') : null;
                  
                  return (
                      <div 
                          key={event.id}
                          onMouseEnter={(e) => handleEventMouseEnter(event, e)} 
                          onMouseLeave={handleEventMouseLeave}
                          className={`absolute p-2 rounded-lg border-l-4`}
                          style={{
                              gridColumn: dayIndex + 2,
                              gridRow: `${startRow} / span ${Math.max(1, duration)}`,
                              left: '0.5rem', right: '0.5rem',
                              backgroundColor: event.color ? event.color + '33' : (tradeColor ? tradeColor + '33' : (colorClasses ? `var(--tw-color-${colorClasses.bg})` : '')),
                              borderColor: event.color || tradeColor || (colorClasses ? `var(--tw-color-${colorClasses.border})` : ''),
                          }}
                      >
                          <p className={`font-bold text-sm ${event.color || tradeColor ? '' : (colorClasses ? colorClasses.text : '')}`} style={{color: event.color || tradeColor}}>{event.title}</p>
                          <p className={`text-xs ${event.color || tradeColor ? '' : (colorClasses ? colorClasses.text : '')}`} style={{color: event.color || tradeColor}}>{event.startTime} - {event.endTime}</p>
                      </div>
                  );
              })}
          </div>
      );
  };
  
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
    return renderTimedView(days);
  };
  
  const renderDayView = () => {
    return renderTimedView([currentDate]);
  }

  const upcomingEvents = calendarEvents.filter(e => e.date >= startOfDay(new Date())).slice(0, 5);

  return (
    <div className="h-full flex gap-8">
      {activeEvent && popoverPosition && <EventPopover event={activeEvent} position={popoverPosition} accounts={accounts} allCategories={allCategories} allEvents={calendarEvents} popularStocks={popularStocks} />}
      
      <aside className="w-80 shrink-0 flex flex-col">
          <h2 className="text-2xl font-bold mb-1">Upcoming events</h2>
          <p className="text-gray-500 mb-6">Don't miss scheduled events</p>
          <div className="space-y-3 flex-1 pr-2 -mr-2 overflow-y-auto">
              {upcomingEvents.map(event => (
                  <div key={event.id} onMouseEnter={(e) => handleEventMouseEnter(event, e)} onMouseLeave={handleEventMouseLeave} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md flex items-start justify-between transition-shadow">
                      <div>
                          <div className="flex items-center text-sm text-gray-500 font-medium">
                              <span className={`w-2 h-2 rounded-full mr-2 ${event.color ? '' : (eventColors[event.type as keyof typeof eventColors]?.dot || 'bg-gray-400')}`} style={{backgroundColor: event.color}}></span>
                              {event.startTime && event.endTime ? `${event.startTime} - ${event.endTime}` : (event.startTime ? format(setHours(setMinutes(new Date(), parseInt(event.startTime.split(':')[1])), parseInt(event.startTime.split(':')[0])), 'p') : format(event.date, 'p'))}
                          </div>
                          <p className="font-bold text-gray-800 mt-1">{event.title}</p>
                          <p className="text-sm text-gray-500">{getEventDescription(event, accounts)}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                          <MoreHorizontalIcon className="w-5 h-5" />
                      </button>
                  </div>
              ))}
          </div>
          <div className="mt-auto bg-blue-100 p-4 rounded-lg">
              <h3 className="font-bold text-blue-800">Conversion history</h3>
              <p className="text-sm text-blue-600">Week to week performance</p>
              <button className="mt-3 bg-white text-blue-800 font-bold py-2 px-4 rounded-lg text-sm w-full hover:bg-blue-50">See More</button>
          </div>
      </aside>
      
      <main className="flex-1 flex flex-col">
        <header className="flex justify-between items-center mb-6">
            <div className="flex items-center bg-gray-100 p-1 rounded-lg text-sm font-semibold">
              <button onClick={() => setActiveView('Month')} className={`px-4 py-2 rounded-md ${activeView === 'Month' ? 'bg-white shadow' : 'text-gray-500'}`}>Month</button>
              <button onClick={() => setActiveView('Week')} className={`px-4 py-2 rounded-md ${activeView === 'Week' ? 'bg-white shadow' : 'text-gray-500'}`}>Week</button>
              <button onClick={() => setActiveView('Day')} className={`px-4 py-2 rounded-md ${activeView === 'Day' ? 'bg-white shadow' : 'text-gray-500'}`}>Day</button>
            </div>
            <div className="flex items-center space-x-4">
              <h2 className="font-bold text-2xl text-gray-800">{format(currentDate, 'MMMM yyyy')}</h2>
              <button onClick={() => onAddEvent()} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><PlusCircleIcon className="w-6 h-6"/></button>
              <div className="flex items-center space-x-1">
                 <button onClick={() => setCurrentDate(p => activeView === 'Month' ? subMonths(p, 1) : (activeView === 'Week' ? subWeeks(p, 1) : addDays(p, -1)))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeftIcon className="w-5 h-5"/></button>
                 <button onClick={() => setCurrentDate(p => activeView === 'Month' ? addMonths(p, 1) : (activeView === 'Week' ? addWeeks(p, 1) : addDays(p, 1)))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRightIcon className="w-5 h-5"/></button>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-gray-500">
                <SearchIcon className="w-6 h-6"/>
                <BellIcon className="w-6 h-6"/>
                <img src="https://picsum.photos/id/237/200/200" alt="User" className="w-10 h-10 rounded-full" />
            </div>
        </header>

        <div className="flex-1 flex flex-col overflow-auto border border-gray-200 rounded-lg bg-white">
            {activeView === 'Month' && renderMonthView()}
            {activeView === 'Week' && renderWeekView()}
            {activeView === 'Day' && renderDayView()}
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;