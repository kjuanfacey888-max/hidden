import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeftIcon, ChevronDownIcon, CameraIcon, MoreHorizontalIcon, BellIcon, ExportIcon, PlusCircleIcon, ChevronRightIcon } from './icons';
import BudgetDial from './BudgetDial';
import SpendingChart from './SpendingChart';
import type { BudgetCategory, DashboardTracker, View } from '../types';

interface MainDashboardProps {
  onAddGoalClick: () => void;
  onScanReceiptClick: () => void;
  allCategories: BudgetCategory[];
  // New props for tracker carousel
  activeTracker: DashboardTracker;
  activeTrackerValue: number;
  onTrackerTargetChange: (newTarget: number) => void;
  onNextTracker: () => void;
  onPrevTracker: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  // New props for header buttons
  onOpenNotifications: () => void;
  onExportData: () => void;
  onNavigate: (view: View) => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({ 
  onAddGoalClick, onScanReceiptClick, allCategories,
  activeTracker, activeTrackerValue, onTrackerTargetChange,
  onNextTracker, onPrevTracker, canGoNext, canGoPrev,
  onOpenNotifications, onExportData, onNavigate
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
            setIsMoreMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-start mb-12">
        <div>
          <div className="flex items-center text-gray-400 mb-1">
            <ChevronLeftIcon className="w-6 h-6" />
            <span className="font-semibold text-lg ml-2">Monthly</span>
            <ChevronDownIcon className="w-5 h-5 ml-1" />
          </div>
          <h1 className="text-5xl font-bold text-[#1A202C]">Spending Overview</h1>
        </div>
        <div className="flex items-center space-x-8 text-gray-500">
           <button
            onClick={onAddGoalClick}
            className="flex items-center space-x-2 bg-purple-600 text-white font-bold py-3 px-5 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/40"
          >
            <PlusCircleIcon className="w-6 h-6" />
            <span>Create Goal</span>
          </button>
           <div className="flex items-center space-x-2">
            <span className="font-semibold text-xs">AI Optimization</span>
            <label htmlFor="ai-toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" id="ai-toggle" className="sr-only" />
                <div className="block bg-gray-200 w-10 h-6 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
              </div>
            </label>
          </div>
          <button onClick={onOpenNotifications} className="relative text-gray-400 hover:text-purple-600 transition-colors">
            <BellIcon className="w-6 h-6 text-red-500 animate-pulse" />
             <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white/70"></div>
          </button>
          <button
            onClick={onScanReceiptClick}
            className="text-gray-400 hover:text-purple-600 transition-colors"
            title="Scan Receipt"
          >
            <CameraIcon className="w-6 h-6" />
          </button>
          <button onClick={onExportData} className="text-gray-400 hover:text-gray-600">
             <ExportIcon className="w-6 h-6"/>
          </button>
          <div className="relative" ref={moreMenuRef}>
            <button onClick={() => setIsMoreMenuOpen(p => !p)} className="text-gray-400 hover:text-gray-600">
              <MoreHorizontalIcon className="w-6 h-6"/>
            </button>
            {isMoreMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-20 p-2 animate-fade-in-fast">
                <a href="#" className="block w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700">Print Report</a>
                <a href="#" className="block w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700">Help Center</a>
                <button onClick={() => { onNavigate('settings'); setIsMoreMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700">Settings</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center mb-8 relative">
        {canGoPrev && (
          <button onClick={onPrevTracker} className="absolute left-0 z-20 p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
            <ChevronLeftIcon className="w-8 h-8 text-gray-500" />
          </button>
        )}
        <div className="w-full">
            <BudgetDial 
                title={activeTracker.title}
                currentValue={activeTrackerValue}
                target={activeTracker.target}
                onTargetChange={onTrackerTargetChange}
                type={activeTracker.type}
            />
        </div>
        {canGoNext && (
          <button onClick={onNextTracker} className="absolute right-0 z-20 p-2 bg-white/50 rounded-full hover:bg-white transition-colors">
            <ChevronRightIcon className="w-8 h-8 text-gray-500" />
          </button>
        )}
      </div>

      <div className="mt-auto">
        <h2 className="text-sm font-bold text-gray-400 tracking-wider uppercase mb-4">Last 15 days</h2>
        <div className="h-72">
          <SpendingChart allCategories={allCategories} />
        </div>
      </div>
       <style>{`
        #ai-toggle:checked ~ .dot {
            transform: translateX(100%);
            background-color: #8B5CF6;
        }
        #ai-toggle:checked ~ .block {
            background-color: #C4B5FD;
        }
    `}</style>
    </div>
  );
};

export default MainDashboard;