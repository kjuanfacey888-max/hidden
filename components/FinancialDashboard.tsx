import React, { useMemo, useState, useRef, useEffect } from 'react';
import { WalletTransaction, BudgetCategory, WalletAccount } from '../types';
import { SearchIcon, MoreHorizontalIcon, SyncIcon, ChevronDownIcon, ArrowUpIcon, ArrowDownIcon, PlusCircleIcon, IconMap } from './icons';
import SpendingChartPanel from './SpendingChartPanel';

interface FinancialDashboardProps {
  accounts: WalletAccount[];
  transactions: WalletTransaction[];
  onAddCard: () => void;
  onSyncTransactions: () => void;
  isSyncing: boolean;
  allCategories: BudgetCategory[];
  onAddAccount: () => void;
  onViewReceipt: (receiptImage: string) => void;
  selectedAccountId: string | null;
  onSelectAccount: (accountId: string) => void;
  onEditAccount: (account: WalletAccount) => void;
  onDepositToAccount: (accountId: string) => void;
}

const AccountCard: React.FC<{ 
    account: WalletAccount; 
    isSelected: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDeposit: () => void;
}> = ({ account, isSelected, onSelect, onEdit, onDeposit }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const Icon = IconMap[account.iconName];
    const gradients = {
        blue: 'bg-gradient-to-br from-blue-500 to-cyan-400',
        pink: 'bg-gradient-to-br from-pink-500 to-red-400',
        green: 'bg-gradient-to-br from-green-500 to-teal-400',
        purple: 'bg-gradient-to-br from-purple-500 to-indigo-400',
        orange: 'bg-gradient-to-br from-orange-500 to-amber-400',
    };
    const gradient = gradients[account.color as keyof typeof gradients] || gradients.blue;

    return (
        <div 
            className="relative w-72 h-44 shrink-0 cursor-pointer group"
            onClick={onSelect}
        >
            {/* The purple base that appears on selection */}
            <div className={`absolute inset-0 bg-purple-400 rounded-2xl transition-transform duration-300 ${isSelected ? 'translate-y-2' : 'translate-y-1 group-hover:translate-y-1.5'}`}></div>

            {/* The main card */}
            <div 
                className={`absolute inset-0 rounded-2xl p-6 flex flex-col justify-between text-white transition-transform duration-300 ${gradient} shadow-md ${isSelected ? '-translate-y-0 shadow-xl' : '-translate-y-1 group-hover:-translate-y-2'}`}
            >
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{account.name}</h3>
                    <div className="relative" ref={menuRef}>
                        <button onClick={(e) => { e.stopPropagation(); setIsMenuOpen(p => !p); }} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors z-10 relative">
                            <MoreHorizontalIcon className="w-5 h-5" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl z-20 p-2 animate-fade-in-fast">
                                <button onClick={(e) => { e.stopPropagation(); onDeposit(); setIsMenuOpen(false); }} className="w-full text-left p-2 rounded-md hover:bg-gray-100 font-semibold">Deposit Funds</button>
                                <button onClick={(e) => { e.stopPropagation(); onEdit(); setIsMenuOpen(false); }} className="w-full text-left p-2 rounded-md hover:bg-gray-100 font-semibold">Edit Account</button>
                                <button className="w-full text-left p-2 rounded-md hover:bg-gray-100 font-semibold">Withdraw Funds</button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-left w-full">
                    <p className="text-sm opacity-80">Current Balance</p>
                    <p className="text-3xl font-bold">${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    );
};


const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ accounts, transactions, onAddCard, onSyncTransactions, isSyncing, allCategories, onAddAccount, onViewReceipt, selectedAccountId, onSelectAccount, onEditAccount, onDepositToAccount }) => {
  const { displayedTransactions, transactionTitle } = useMemo(() => {
        if (!selectedAccountId) {
            const all = accounts.flatMap(acc => acc.history.map(tx => ({...tx, source: acc.name }))).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return { displayedTransactions: all, transactionTitle: 'All Accounts' };
        }
        const account = accounts.find(a => a.id === selectedAccountId);
        return { displayedTransactions: account?.history ?? [], transactionTitle: account?.name ?? '...' };
    }, [accounts, selectedAccountId]);

  return (
    <div className="h-full flex flex-col bg-white rounded-2xl p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Hello, Rakib</h1>
          <p className="text-gray-500">Welcome back</p>
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={onSyncTransactions}
            disabled={isSyncing}
            className="flex items-center space-x-2 text-purple-600 font-semibold text-sm px-4 py-2 rounded-lg border-2 border-purple-200 hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {isSyncing ? (
              <SyncIcon className="w-5 h-5 animate-spin" />
            ) : (
              <SyncIcon className="w-5 h-5" />
            )}
            <span>{isSyncing ? 'Syncing...' : 'Sync New Transactions'}</span>
          </button>
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <img src="https://i.pravatar.cc/40?u=rakib" alt="User" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-bold">Rakib Kowshar</p>
              <p className="text-xs text-gray-500">UI/UX Designer</p>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        <main className="lg:col-span-2 flex flex-col overflow-y-auto pr-4 -mr-4">
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">My Accounts</h2>
              <div className="space-x-4">
                <button onClick={onAddAccount} className="text-purple-600 font-semibold text-sm">Add Account</button>
              </div>
            </div>
            <div className="flex space-x-6 overflow-x-auto mt-2 pb-4 -mx-8 px-8">
                {accounts.map(account => (
                    <AccountCard 
                        key={account.id} 
                        account={account}
                        isSelected={selectedAccountId === account.id}
                        onSelect={() => onSelectAccount(account.id)}
                        onEdit={() => onEditAccount(account)}
                        onDeposit={() => onDepositToAccount(account.id)}
                    />
                ))}
            </div>
          </section>

          <section className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Transaction History</h2>
              <h3 className="font-semibold text-purple-700">{transactionTitle}</h3>
            </div>
            {displayedTransactions.length > 0 ? (
                <div className="space-y-3">
                {displayedTransactions.map(tx => {
                    const isDeposit = tx.type === 'deposit';
                    return (
                    <div key={tx.id} className="flex items-center p-3 hover:bg-gray-50 rounded-lg">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${isDeposit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {isDeposit ? <ArrowUpIcon className="w-6 h-6"/> : <ArrowDownIcon className="w-6 h-6"/>}
                        </div>
                        <p className="flex-1 font-semibold capitalize">{tx.description || tx.type} {!selectedAccountId && tx.source && <span className="text-xs text-gray-400 font-normal ml-2">({tx.source})</span>}</p>
                        <p className="text-gray-500 mr-8">{new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        {tx.type === 'purchase' && tx.receiptImage ? (
                          <button
                            onClick={() => onViewReceipt(tx.receiptImage!)}
                            className="font-bold w-24 text-right text-purple-600 hover:underline focus:outline-none"
                            aria-label={`View receipt for ${tx.description}`}
                          >
                            -${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </button>
                        ) : (
                          <p className={`font-bold w-24 text-right ${isDeposit ? 'text-green-600' : 'text-gray-800'}`}>{isDeposit ? '+' : '-'}${tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                        )}
                        <button className="text-gray-400 ml-4"><MoreHorizontalIcon className="w-5 h-5" /></button>
                    </div>
                    );
                })}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50 rounded-2xl">
                    <p>{selectedAccountId ? "No transactions for this account yet." : "Select an account to view its history."}</p>
                </div>
            )}
          </section>
        </main>

        <aside className="lg:col-span-1 bg-gray-50/50 rounded-2xl p-6 flex flex-col">
          <SpendingChartPanel 
            history={[]}
            transactions={transactions}
            allCategories={allCategories}
          />
        </aside>
      </div>
    </div>
  );
};

export default FinancialDashboard;