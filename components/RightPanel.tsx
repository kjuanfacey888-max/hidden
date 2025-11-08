import React, { useState, useRef, useEffect } from 'react';
import type { BudgetCategory, Device, Bill, WalletAccount } from '../types';
import { CreditCardIcon, SavingsIcon, BillsIcon, ChevronDownIcon, ZapIcon, WifiIcon, PlusCircleIcon, BillIconMap, PinIcon, SyncIcon, IconMap } from './icons';

interface RightPanelProps {
    shortcuts: BudgetCategory[];
    onCategoryClick: (category: BudgetCategory) => void;
    reviewCount: number;
    onReviewClick: () => void;
    bills: Bill[];
    onAddBill: () => void;
    onEditBill: (bill: Bill) => void;
    isPinned: boolean;
    onPinToggle: () => void;
    accounts: WalletAccount[];
    onAddAccount: () => void;
    onNavigateToWallet: () => void;
    onNavigateToCredit: () => void;
    onNavigateToTax: () => void;
}

const devicesData: Device[] = [
  // { name: 'Checking', Icon: CreditCardIcon }, // This is now the dropdown trigger
  { name: 'Savings', Icon: SavingsIcon },
  { name: 'Bills', Icon: BillsIcon },
];

const PanelHeader: React.FC<{ title: string; onPinToggle?: () => void; isPinned?: boolean; }> = ({ title, onPinToggle, isPinned }) => (
    <div className="flex items-center justify-between text-xs font-bold text-gray-400 tracking-wider uppercase">
      <span>{title}</span>
      <div className="flex items-center space-x-2">
          {onPinToggle && (
              <button
                  onClick={onPinToggle}
                  className={`p-1 rounded-full transition-colors ${isPinned ? 'text-purple-600 bg-purple-100' : 'text-gray-400 hover:bg-gray-100'}`}
                  title={isPinned ? 'Unpin Panel' : 'Pin Panel'}
              >
                  <PinIcon className="w-4 h-4" filled={isPinned} />
              </button>
          )}
          <ChevronDownIcon className="w-4 h-4" />
      </div>
    </div>
  );

const PacingIndicator: React.FC<{ pacing: 'good' | 'warning' | 'danger' }> = ({ pacing }) => {
    const color = {
        good: 'bg-green-400',
        warning: 'bg-yellow-400',
        danger: 'bg-red-400'
    }[pacing];
    return <div className={`w-2 h-2 rounded-full ${color} animate-pulse`}></div>
}

const ShortcutCard: React.FC<{ shortcut: BudgetCategory, onClick: () => void }> = ({ shortcut, onClick }) => (
  <div onClick={onClick} className="flex items-center p-4 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white mr-4`} style={{ backgroundColor: shortcut.color }}>
      <shortcut.Icon className="w-7 h-7" />
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between">
         <p className="font-bold text-gray-800">{shortcut.name}</p>
         <PacingIndicator pacing={shortcut.pacing} />
      </div>
      <p className="text-sm text-gray-500">${shortcut.spent.toFixed(2)}</p>
    </div>
  </div>
);

const ReviewCategoriesButton: React.FC<{ count: number; onClick: () => void }> = ({ count, onClick }) => (
    <div onClick={onClick} className="flex items-center p-4 text-gray-500 cursor-pointer group">
        <div className="relative w-14 h-14 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 mr-4 group-hover:bg-gray-100 transition-colors">
        AI
        {count > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full text-white text-xs flex items-center justify-center border-2 border-white animate-pulse">
            {count}
          </div>
        )}
        </div>
        <p className="font-semibold">Review AI Categories</p>
    </div>
);

const DeviceCard: React.FC<{ device: Device; onClick?: () => void }> = ({ device, onClick }) => (
    <div onClick={onClick} className="relative bg-white w-24 h-24 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 text-purple-600">
        <device.Icon className="w-10 h-10"/>
        {device.name === 'Savings' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"></div>}
         {device.name === 'Savings' && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>}
    </div>
);

const DynamicSavingsTransfer: React.FC = () => (
    <div className="bg-green-100 border-2 border-dashed border-green-300 text-green-700 w-24 h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-green-200 transition-colors p-1 text-center">
        <span className="text-xs font-bold">Transfer</span>
        <span className="text-lg font-extrabold">$84</span>
        <span className="text-xs font-bold">to Savings</span>
    </div>
);

const UpcomingBillCard: React.FC<{bill: Bill, onClick: () => void}> = ({bill, onClick}) => {
    const Icon = BillIconMap[bill.iconName as keyof typeof BillIconMap];
    return (
        <div onClick={onClick} className="flex items-center p-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-purple-500 mr-4">
                {Icon && <Icon className="w-6 h-6" />}
            </div>
            <div>
                <p className="font-bold text-gray-700">{bill.name}</p>
                <p className="text-sm text-gray-500 flex items-center space-x-1.5">
                    <span className="font-semibold text-red-500">${bill.amount.toFixed(2)}</span>
                    <span>due on {bill.dueDate}</span>
                    {bill.recurring && <SyncIcon className="w-3.5 h-3.5 text-gray-400" title="Recurring bill" />}
                </p>
            </div>
        </div>
    );
}

const RightPanel: React.FC<RightPanelProps> = ({ shortcuts, onCategoryClick, reviewCount, onReviewClick, bills, onAddBill, onEditBill, isPinned, onPinToggle, accounts, onAddAccount, onNavigateToWallet, onNavigateToCredit, onNavigateToTax }) => {
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
            setAccountMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [accountMenuRef]);

  return (
    <aside className="w-96 bg-white p-10 shrink-0 hidden lg:block overflow-y-auto">
      <div className="space-y-12">
        <section>
          <PanelHeader title="Shortcuts" isPinned={isPinned} onPinToggle={onPinToggle} />
          <div className="mt-4 space-y-3">
            {shortcuts.map(s => <ShortcutCard key={s.id} shortcut={s} onClick={() => onCategoryClick(s)} />)}
            <ReviewCategoriesButton count={reviewCount} onClick={onReviewClick} />
          </div>
        </section>

        <section>
          <PanelHeader title="Accounts" />
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="relative" ref={accountMenuRef}>
              <div
                onClick={() => setAccountMenuOpen(p => !p)}
                className="relative bg-white w-24 h-24 rounded-2xl flex items-center justify-center shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 text-purple-600"
              >
                <CreditCardIcon className="w-10 h-10" />
              </div>
              {isAccountMenuOpen && (
                <div className="absolute top-full mt-2 w-72 bg-white rounded-lg shadow-xl border z-20 p-2 animate-fade-in-fast -left-12">
                  <p className="text-xs font-semibold text-gray-400 uppercase px-2 pt-1 pb-2">Your Accounts</p>
                  <div className="max-h-60 overflow-y-auto">
                    {accounts.map(account => {
                      const Icon = IconMap[account.iconName];
                      return (
                        <button key={account.id} onClick={() => { onNavigateToWallet(); setAccountMenuOpen(false); }} className="w-full text-left p-2 rounded-md hover:bg-gray-100 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {Icon && <Icon className="w-5 h-5 text-gray-600" />}
                            <span className="font-semibold text-gray-700">{account.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="border-t my-2"></div>
                  <button onClick={() => { onAddAccount(); setAccountMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700">Add New Account</button>
                  <button onClick={() => { onNavigateToWallet(); setAccountMenuOpen(false); }} className="w-full text-left font-semibold p-2 rounded-md hover:bg-gray-100 text-gray-700">Manage All Accounts</button>
                </div>
              )}
            </div>

            {devicesData.map(d => (
              <DeviceCard 
                key={d.name} 
                device={d}
                onClick={
                  d.name === 'Savings' ? onNavigateToCredit :
                  d.name === 'Bills' ? onNavigateToTax : undefined
                }
              />
            ))}
            <DynamicSavingsTransfer />
          </div>
        </section>
        
        <section>
          <PanelHeader title="Upcoming Bills" />
          <div className="mt-4 space-y-2">
             {bills.map(b => <UpcomingBillCard key={b.id} bill={b} onClick={() => onEditBill(b)} />)}
             <div onClick={onAddBill} className="flex items-center p-4 text-gray-500 cursor-pointer group">
                <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 mr-4 group-hover:bg-gray-100 transition-colors">
                    <PlusCircleIcon className="w-6 h-6" />
                </div>
                <p className="font-semibold">Add Bill</p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};

export default RightPanel;