import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI, Type, Chat } from '@google/genai';
import Sidebar from './Sidebar';
import MainDashboard from './MainDashboard';
import RightPanel from './RightPanel';
import CategoryDetailModal from './CategoryDetailModal';
import AiReviewModal from './AiReviewModal';
import AllCategoriesPage from './AllCategoriesPage';
import AddCategoryModal from './AddCategoryModal';
import FinancialDashboard from './FinancialDashboard';
import AddCardModal from './AddCardModal';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import AutomationWorkflowPage from './AutomationWorkflowPage';
import AddAccountModal from './AddAccountModal';
import AddSourceModal from './AddSourceModal';
import BillModal from './BillModal';
import AutomationTemplateLibrary from './AutomationTemplateLibrary';
import TemplateSetupWizard from './TemplateSetupWizard';
import AiTemplateGeneratorModal from './AiTemplateGeneratorModal';
import MilestoneTypeModal from './MilestoneTypeModal';
import CalendarPage from './CalendarPage';
import AddEventModal from './AddEventModal';
import SelectTrackingModeModal from './SelectTrackingModeModal';
import ReceiptScannerModal from './ReceiptScannerModal';
import ReceiptViewerModal from './ReceiptViewerModal';
import CreateBoardModal from './CreateBoardModal';
import CreditPage from './CreditPage';
import CreateGoalModal from './CreateGoalModal';
import StocksPage from './StocksPage';
import StockDetailPage from './StockDetailPage';
import PlaceTradeModal from './PlaceTradeModal';
import AiChatPage from './AiChatPage';
import SettingsPage from './SettingsPage';
import AiTraderModal from './AiTraderModal';
import NotificationsModal from './NotificationsModal';
import ProfilePage from './ProfilePage';
import TaxPage from './TaxPage';
import ActionNode from './ActionNode';
import AutoInvestNode from './AutoInvestNode';
import type { View, StockDetails, BudgetCategory, UncategorizedTransaction, ParsedTransaction, PossibleCategory, LinkedCard, WalletTransaction, AutomationRule, WalletAccount, IncomeSource, Bill, AutomationMilestone, AutomationTemplate, AutomationBoard, Milestone, CustomCalendarEvent, CategoryTransaction, CreditReport, DashboardTracker, Conversation, ChatMessage, AlpacaKeys, AlpacaData, AiTraderStrategy, AutomationAction, UserProfile, TradeEvent, AutoInvestRule } from '../types';
import { initialCategoriesData } from '../data/categories';
import { allPossibleCategories } from '../data/allPossibleCategories';
import { allTemplates as initialAllTemplates } from '../data/templates';
import { generatePopularStocks } from '../data/popularStocks';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { Connection } from 'reactflow';
import { addMonths, isBefore, subDays, setHours, setMinutes } from 'date-fns';
import { IconMap, AppleIcon, TeslaIcon, GoogleIcon, NvidiaIcon, AmazonIcon, MetaIcon, TrendingUpIcon as StockTickerTrendingUpIcon } from './icons';


const initialUncategorizedTransactions: UncategorizedTransaction[] = [
    { id: 'u1', description: 'AMAZON MKTPLACE PMTS', amount: 34.99, suggestedCategory: 'Shopping' },
    { id: 'u2', description: 'VENMO*PAYMENT', amount: 50.00, suggestedCategory: 'Personal' },
    { id: 'u3', description: 'SQ*COFFEE SHOP', amount: 5.75, suggestedCategory: 'Food' },
];

const generateDetailedTransactions = (): WalletTransaction[] => {
  const transactions: WalletTransaction[] = [];
  const categories = [
    { name: 'Groceries', merchants: ['Whole Foods', 'Trader Joe\'s', 'SuperMart'] },
    { name: 'Gas / Fuel', merchants: ['Shell', 'Chevron', '76'] },
    { name: 'Restaurants', merchants: ['The Cheesecake Factory', 'Local Cafe', 'Taco Bell'] },
    { name: 'Shopping', merchants: ['Amazon.com', 'Target', 'Apple Store'] },
    { name: 'Internet', merchants: ['Comcast', 'Verizon Fios'] },
    { name: 'Streaming Services', merchants: ['Netflix', 'Spotify'] },
  ];

  for (let i = 0; i < 15; i++) { // Last 15 days
    const numTransactions = Math.floor(Math.random() * 4); // 0 to 3 transactions per day
    for (let j = 0; j < numTransactions; j++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const merchant = category.merchants[Math.floor(Math.random() * category.merchants.length)];
      const amount = Math.random() * 80 + 5;
      
      let date = subDays(new Date(), i);
      date = setHours(date, Math.floor(Math.random() * 24));
      date = setMinutes(date, Math.floor(Math.random() * 60));
      
      transactions.push({
        id: `tx-${i}-${j}-${Math.random()}`,
        type: 'purchase',
        amount: parseFloat(amount.toFixed(2)),
        date: date.toISOString(),
        description: merchant,
        category: category.name,
      });
    }
  }
  return transactions;
};

const allMockTransactions = generateDetailedTransactions();
const checkingTransactions = allMockTransactions.filter((_, i) => i % 2 === 0);
const spendableTransactions = allMockTransactions.filter((_, i) => i % 2 !== 0);
checkingTransactions.push({ id: 'tx-income-1', type: 'deposit', amount: 2200, date: subDays(new Date(), 3).toISOString(), description: 'Payroll' });
checkingTransactions.push({ id: 'tx-income-2', type: 'deposit', amount: 2200, date: subDays(new Date(), 17).toISOString(), description: 'Payroll' });

const StockTicker: React.FC = () => {
    const tickerData = [
        { symbol: 'AAPL', price: 172.48, change: 2.15, changePercent: 1.26, Icon: AppleIcon },
        { symbol: 'TSLA', price: 177.77, change: -3.45, changePercent: -1.90, Icon: TeslaIcon },
        { symbol: 'GOOGL', price: 139.44, change: 1.02, changePercent: 0.74, Icon: GoogleIcon },
        { symbol: 'NVDA', price: 903.67, change: 15.22, changePercent: 1.71, Icon: NvidiaIcon },
        { symbol: 'AMZN', price: 179.62, change: -1.54, changePercent: -0.85, Icon: AmazonIcon },
        { symbol: 'META', price: 502.81, change: 8.43, changePercent: 1.70, Icon: MetaIcon },
    ];
    return (
        <div className="bg-gray-900 text-white w-full overflow-hidden h-16 flex items-center border-t border-b border-gray-700">
            <div className="flex items-center space-x-4 pl-6 pr-6 shrink-0 z-10 border-r border-gray-700">
                <StockTickerTrendingUpIcon className="w-5 h-5 text-green-400" />
                <span className="font-semibold text-sm">The market's open</span>
                <button className="bg-white text-gray-900 text-xs font-bold px-3 py-1.5 rounded-md hover:bg-gray-200">View All</button>
            </div>
            <div className="flex-1 h-full relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-full flex items-center animate-ticker">
                    {[...tickerData, ...tickerData].map((item, i) => (
                        <div key={i} className="flex items-center space-x-3 shrink-0 px-6 border-r border-gray-700 h-full">
                            <item.Icon className="w-6 h-6" />
                            <span className="font-bold text-sm">{item.symbol}</span>
                            <div className={`text-sm font-semibold ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {item.change >= 0 ? '▲' : '▼'} {Math.abs(item.changePercent).toFixed(2)}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                    display: flex;
                    width: fit-content;
                    animation: ticker 45s linear infinite;
                }
            `}</style>
        </div>
    );
};


const BudgetDashboard: React.FC = () => {
    // Budgeting State
    const [allCategories, setAllCategories] = useState<BudgetCategory[]>(initialCategoriesData);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [uncategorized, setUncategorized] = useState<UncategorizedTransaction[]>(initialUncategorizedTransactions);
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
    const [addCategoryDefaults, setAddCategoryDefaults] = useState<Partial<Omit<PossibleCategory, 'iconName'>> & { activeTab?: 'list' | 'custom' } | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isRightPanelPinned, setIsRightPanelPinned] = useState(false);
    const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);


    // --- New Dashboard Tracker State ---
    const [trackers, setTrackers] = useState<DashboardTracker[]>([
        { id: 'tracker-spending', type: 'spending', title: 'Monthly Spending', target: 3000 },
    ]);
    const [activeTrackerIndex, setActiveTrackerIndex] = useState(0);

    // Wallet & Accounts State
    const [accounts, setAccounts] = useState<WalletAccount[]>([
        { id: 'checking-1', name: 'Checking', balance: 1250.75, iconName: 'CreditCardIcon', color: 'blue', history: checkingTransactions, linkedSources: [] },
        { id: 'spendable-1', name: 'Spendable Cash', balance: 250.00, iconName: 'WalletIcon', color: 'orange', history: spendableTransactions, linkedSources: [] },
        { id: 'savings-1', name: 'Savings', balance: 5300.00, iconName: 'PiggyBankIcon', color: 'pink', history: [], linkedSources: [] },
        { id: 'stocks-1', name: 'Stocks', balance: 10000.00, iconName: 'DollarSignIcon', color: 'green', history: [], linkedSources: [] },
    ]);
    const [linkedCards, setLinkedCards] = useState<LinkedCard[]>([
        { id: 'card-1', last4: '1234', cardType: 'visa', balance: 1500 },
        { id: 'card-2', last4: '5678', cardType: 'mastercard', balance: 3200 },
    ]);
    const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
    const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
    const [isReceiptScannerModalOpen, setIsReceiptScannerModalOpen] = useState(false);
    const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(accounts[0]?.id || null);
    const [editingAccount, setEditingAccount] = useState<WalletAccount | null>(null);
    const [depositTargetAccountId, setDepositTargetAccountId] = useState<string | null>(null);
    
    // Credit Health State
    const [creditReport, setCreditReport] = useState<CreditReport | null>(null);
    const [isFetchingCreditReport, setIsFetchingCreditReport] = useState(false);
    
    // Automations State
    const [automationBoards, setAutomationBoards] = useState<AutomationBoard[]>([
        {
            id: 'board-default-1',
            name: 'My Personal Finances',
            status: 'active',
            type: 'individual',
            incomeSources: [
                { id: 'source-w2-paycheck', name: 'W-2 Paycheck', accountId: 'checking-1', triggerType: 'on_deposit', triggerValue: 0, delayDays: 1, deletable: false, sweepUnallocated: true, sweepAccountId: 'savings-1', isLinked: true, depositKeyword: 'payroll', expectedAmount: 2200, depositFrequency: 'bi-weekly', nextDepositDate: '2024-07-26' },
            ],
            automationRules: [
                { id: 'rule-savings-1', name: 'Core Savings', destinationAccountId: 'savings-1', percentage: 20, goal: 10000, sourceTriggers: ['source-w2-paycheck'], status: 'active', goalType: 'Long-Term', completionAction: 'stop', lastTransferFailed: false, milestones: [{percentage: 50, description: 'Halfway there!'}], trackingMode: 'account_balance' },
                { id: 'rule-stocks-1', name: 'Stock Investments', destinationAccountId: 'stocks-1', percentage: 10, goal: 25000, sourceTriggers: ['source-w2-paycheck'], status: 'active', goalType: 'Investment', completionAction: 'stop', lastTransferFailed: false, trackingMode: 'account_balance' },
            ],
            automationMilestones: [
                {id: 'milestone-1', name: 'Vacation Fund Ready', sourceGoalId: 'rule-savings-1', triggerPercentage: 80, advice: 'Time to book flights!'}
            ],
            automationActions: [],
            autoInvestRules: [],
        }
    ]);
    const [activeBoardId, setActiveBoardId] = useState('board-default-1');
    const [allTemplates, setAllTemplates] = useState<AutomationTemplate[]>(initialAllTemplates);
    const [isTemplateLibraryOpen, setIsTemplateLibraryOpen] = useState(false);
    const [isTemplateWizardOpen, setIsTemplateWizardOpen] = useState(false);
    const [templateToDeploy, setTemplateToDeploy] = useState<AutomationTemplate | null>(null);
    const [isAiTemplateGeneratorOpen, setIsAiTemplateGeneratorOpen] = useState(false);
    const [aiTemplateGeneratorState, setAiTemplateGeneratorState] = useState<{ isLoading: boolean; error: string | null }>({ isLoading: false, error: null });
    const [isMilestoneTypeModalOpen, setIsMilestoneTypeModalOpen] = useState(false);
    const [aiMilestoneTarget, setAiMilestoneTarget] = useState<string | null>(null);
    const [aiActionState, setAiActionState] = useState<{ isLoading: boolean, targetNodeId: string | null }>({ isLoading: false, targetNodeId: null });
    const [isSelectTrackingModeModalOpen, setIsSelectTrackingModeModalOpen] = useState(false);
    const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false);
    const [isAddSourceModalOpen, setIsAddSourceModalOpen] = useState(false);
    const [editingSource, setEditingSource] = useState<IncomeSource | null>(null);

    // Bills state
    const [bills, setBills] = useState<Bill[]>([
        {id: 'bill-1', name: 'Netflix', amount: 15.99, dueDate: '28th', iconName: 'ZapIcon', recurring: true},
        {id: 'bill-2', name: 'Phone Bill', amount: 85.00, dueDate: '15th', iconName: 'WifiIcon', recurring: true},
    ]);
    const [editingBill, setEditingBill] = useState<Bill | null | undefined>(undefined); // undefined means "add new"
    const [isBillModalOpen, setIsBillModalOpen] = useState(false);
    
    // Calendar State
    const [customEvents, setCustomEvents] = useState<CustomCalendarEvent[]>([
        { id: 'event-1', title: 'Dentist Appointment', date: '2024-07-29', startTime: '14:00', endTime: '15:00', description: 'Annual check-up.', color: '#8B5CF6' }
    ]);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [defaultEventDate, setDefaultEventDate] = useState<string | null>(null);
    const [tradeHistory, setTradeHistory] = useState<TradeEvent[]>([
        { id: 'trade-1', symbol: 'AAPL', side: 'buy', qty: 10, price: 172.48, date: setMinutes(setHours(subDays(new Date(), 2), 14), 32).toISOString(), isAiTrade: false },
        { id: 'trade-2', symbol: 'TSLA', side: 'sell', qty: 5, price: 180.11, date: setMinutes(setHours(subDays(new Date(), 5), 10), 5).toISOString(), isAiTrade: false },
        { id: 'trade-3', symbol: 'NVDA', side: 'buy', qty: 2, price: 903.67, date: setMinutes(setHours(subDays(new Date(), 1), 11), 15).toISOString(), isAiTrade: true },
        { id: 'trade-4', symbol: 'GOOGL', side: 'buy', qty: 7, price: 138.42, date: setMinutes(setHours(subDays(new Date(), 8), 15), 45).toISOString(), isAiTrade: true },
    ]);

    // --- New AI Chat State ---
    const [conversations, setConversations] = useState<Conversation[]>([
      { id: 'convo-1', title: 'How to improve my savings?', messages: [{speaker: 'user', text: 'How can I improve my savings rate?'}, {speaker: 'ai', text: 'Based on your spending, you could save an extra $150/month by reducing your restaurant spending.'}], favorite: true},
      { id: 'convo-2', title: 'Vacation budget planning', messages: [{speaker: 'user', text: 'Can you help me plan a budget for a trip to Hawaii?'}, {speaker: 'ai', text: 'Of course! A one-week trip to Hawaii for two typically costs between $4,000 and $8,000. Let\'s create a savings goal for it.'}]},
    ]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    const [isAiChatLoading, setIsAiChatLoading] = useState(false);
    const [currentAiResponse, setCurrentAiResponse] = useState('');
    const chatRef = useRef<Chat | null>(null);

    // --- New Settings State ---
    const [alpacaKeys, setAlpacaKeys] = useState<AlpacaKeys | null>(null);
    
    // --- New Stocks State ---
    const [popularStocks, setPopularStocks] = useState<StockDetails[]>([]);
    const [selectedStock, setSelectedStock] = useState<StockDetails | null>(null);
    const [isPlaceTradeModalOpen, setIsPlaceTradeModalOpen] = useState(false);
    const [tradeModalSymbol, setTradeModalSymbol] = useState<string | undefined>();
    const [alpacaData, setAlpacaData] = useState<AlpacaData | null>(null);
    const [alpacaLoading, setAlpacaLoading] = useState(false);
    const [alpacaError, setAlpacaError] = useState<string | null>(null);
    
    // --- New AI Trader State ---
    const [isAiTraderModalOpen, setIsAiTraderModalOpen] = useState(false);
    const [activeAiStrategy, setActiveAiStrategy] = useState<AiTraderStrategy | null>(null);

    // --- New Profile State ---
    const [userProfile, setUserProfile] = useState<UserProfile>({
        firstName: 'Rakib',
        lastName: 'Kowshar',
        email: 'rakib.kowshar@example.com',
        phone: '555-123-4567',
        dob: '1990-01-01',
        address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zip: '12345',
        },
        ssn: '•••••1234',
        avatarUrl: 'https://picsum.photos/id/237/200/200',
    });

    useEffect(() => {
        setPopularStocks(generatePopularStocks());
    }, []);

    useEffect(() => {
        if (alpacaKeys && currentView === 'stocks') {
            const fetchAlpacaData = async () => {
                setAlpacaLoading(true);
                setAlpacaError(null);
                setAlpacaData(null);
                
                const headers = {
                    'APCA-API-KEY-ID': alpacaKeys.key,
                    'APCA-API-SECRET-KEY': alpacaKeys.secret,
                };

                try {
                    const [accountRes, positionsRes, historyRes] = await Promise.all([
                        fetch(`${alpacaKeys.endpoint}/v2/account`, { headers }),
                        fetch(`${alpacaKeys.endpoint}/v2/positions`, { headers }),
                        fetch(`${alpacaKeys.endpoint}/v2/account/portfolio/history`, { headers }),
                    ]);

                    if (!accountRes.ok || !positionsRes.ok || !historyRes.ok) {
                        throw new Error('Failed to fetch data from Alpaca. Check your API keys and endpoint.');
                    }

                    const account = await accountRes.json();
                    const positions = await positionsRes.json();
                    const history = await historyRes.json();

                    setAlpacaData({ account, positions, history });
                } catch (e: any) {
                    setAlpacaError(e.message);
                } finally {
                    setAlpacaLoading(false);
                }
            };
            fetchAlpacaData();
        }
    }, [alpacaKeys, currentView]);


    // Derived State for active board
    const activeAutomationBoard = automationBoards.find(b => b.id === activeBoardId);
    const automationRules = activeAutomationBoard?.automationRules || [];
    const incomeSources = activeAutomationBoard?.incomeSources || [];
    const automationMilestones = activeAutomationBoard?.automationMilestones || [];
    const automationActions = activeAutomationBoard?.automationActions || [];
    const autoInvestRules = activeAutomationBoard?.autoInvestRules || [];

    const shortcuts = allCategories.filter(c => c.isShortcut);
    const totalSpent = allCategories.reduce((sum, cat) => sum + cat.spent, 0);

    // --- New Tracker Derived State ---
    const activeTracker = trackers[activeTrackerIndex];
    const activeTrackerValue = useMemo(() => {
        if (!activeTracker) return 0;
        switch (activeTracker.type) {
            case 'spending':
                return totalSpent;
            case 'income': {
                const currentMonth = new Date().getMonth();
                const currentYear = new Date().getFullYear();
                return accounts.flatMap(acc => acc.history)
                    .filter(tx => {
                        const txDate = new Date(tx.date);
                        return tx.type === 'deposit' && txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
                    })
                    .reduce((sum, tx) => sum + tx.amount, 0);
            }
            case 'savings':
                return accounts.find(acc => acc.id === activeTracker.sourceAccountId)?.balance || 0;
            case 'credit-score': {
                const scores = creditReport?.credit_score;
                if (!scores) return 0;
                const allScores = [scores.equifax?.score, scores.transunion?.score, scores.experian?.score].filter(Boolean) as number[];
                return allScores.length > 0 ? Math.max(...allScores) : 0;
            }
            default:
                return 0;
        }
    }, [activeTracker, totalSpent, accounts, creditReport]);


    // --- Modal Toggle Handlers ---
    const handleCategoryClick = (category: BudgetCategory) => {
        setSelectedCategory(category);
        setIsCategoryModalOpen(true);
    };

    const handleAddGoal = (trackingMode?: 'account_balance' | 'goal_specific') => {
        if (!trackingMode) {
            setIsSelectTrackingModeModalOpen(true);
            return;
        }

        const newGoal: AutomationRule = {
            id: `rule-new-${Date.now()}`,
            name: 'New Goal',
            destinationAccountId: accounts[0]?.id || '',
            percentage: 10,
            goal: 1000,
            sourceTriggers: [],
            status: 'inactive',
            goalType: 'Short-Term',
            completionAction: 'stop',
            lastTransferFailed: false,
            trackingMode: trackingMode,
        };
        
        setAutomationBoards(prevBoards => prevBoards.map(board => 
            board.id === activeBoardId 
            ? { ...board, automationRules: [...board.automationRules, newGoal] }
            : board
        ));
        setIsSelectTrackingModeModalOpen(false);
    };

    useEffect(() => {
        setIsBillModalOpen(editingBill !== undefined);
    }, [editingBill]);

    const handleOpenAddEventModal = (defaultDate?: string) => {
        setDefaultEventDate(defaultDate || null);
        setIsAddEventModalOpen(true);
    }
    
    // --- Data Mutation Handlers ---
    const handleSaveCategory = (updatedCategory: BudgetCategory) => {
        setAllCategories(allCategories.map(c => c.id === updatedCategory.id ? updatedCategory : c));
    };
    const handleDeleteCategory = (categoryId: string) => {
        setAllCategories(prev => prev.filter(c => c.id !== categoryId));
        setIsCategoryModalOpen(false);
        setSelectedCategory(null);
    };

    const handleAddCategory = (categoryData: Omit<PossibleCategory, 'iconName'> & { goal?: number }) => {
        const newCategory: BudgetCategory = {
            id: `cat-${Date.now()}`,
            name: categoryData.name,
            spent: 0,
            goal: categoryData.goal || 0,
            Icon: categoryData.Icon,
            color: categoryData.color,
            pacing: 'good',
            transactions: [],
            isShortcut: false,
            mainCategory: categoryData.mainCategory,
        };
        setAllCategories(prev => [...prev, newCategory]);
        setIsAddCategoryModalOpen(false); // Close the modal
    };
    
    const handleToggleShortcut = (categoryId: string) => {
        setAllCategories(prev => prev.map(c => 
            c.id === categoryId ? { ...c, isShortcut: !c.isShortcut } : c
        ));
    };

    const handleCategoryOrderChange = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setAllCategories((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                let newItems = arrayMove(items, oldIndex, newIndex);

                const activeItem = newItems.find(item => item.id === active.id);
                const overItem = newItems.find(item => item.id === over.id);

                if (activeItem && overItem && activeItem.mainCategory !== overItem.mainCategory) {
                    newItems = newItems.map(item => 
                        item.id === active.id 
                        ? { ...item, mainCategory: overItem.mainCategory } 
                        : item
                    );
                }
                
                return newItems;
            });
        }
    };
    
    // ... all other handler functions ...

    const handleSaveRule = (rule: AutomationRule) => {
        setAutomationBoards(prevBoards => prevBoards.map(board => {
            if (board.id !== activeBoardId) return board;
            const rules = board.automationRules.map(r => r.id === rule.id ? rule : r);
            return { ...board, automationRules: rules };
        }));
    };
    
    const handleRuleConnect = (connection: Connection) => {
      if (connection.source && connection.target) {
          const targetNode = [...automationRules, ...automationActions, ...autoInvestRules, ...automationMilestones].find(node => node.id === connection.target);
          if (!targetNode) return;

          if ('sourceTriggers' in targetNode) { // It's a Rule or Action
               setAutomationBoards(prevBoards => prevBoards.map(board => {
                    if (board.id !== activeBoardId) return board;
                    const updateNode = (node: AutomationRule | AutomationAction) => {
                        if (node.id === connection.target && !node.sourceTriggers.includes(connection.source!)) {
                            return { ...node, sourceTriggers: [...node.sourceTriggers, connection.source!] };
                        }
                        return node;
                    }
                    return {
                        ...board,
                        automationRules: board.automationRules.map(rule => updateNode(rule) as AutomationRule),
                        automationActions: board.automationActions.map(action => updateNode(action) as AutomationAction),
                    };
                }));
          } else if ('sourceGoalId' in targetNode) { // It's a Milestone or AutoInvest
              const updatedNode = { ...targetNode, sourceGoalId: connection.source! };
               if ('triggerPercentage' in updatedNode) {
                    handleSaveMilestone(updatedNode);
               } else {
                   handleSaveAutoInvestRule(updatedNode);
               }
          }
      }
    };
    
    const resolveValue = (value: string | number | undefined, params: Record<string, string | number>): number => {
        if (typeof value === 'number') return value;
        if (typeof value === 'string' && value.startsWith('{{') && value.endsWith('}}')) {
            const key = value.substring(2, value.length - 2);
            const resolved = params[key];
            return typeof resolved === 'number' ? resolved : 0;
        }
        return 0;
    };
    
    const handleSaveBill = (billData: Omit<Bill, 'id'> & { id?: string }) => {
        setBills(prev => {
            if (billData.id) { // Editing existing bill
                return prev.map(b => (b.id === billData.id ? { ...b, ...billData } as Bill : b));
            } else { // Adding new bill
                const newBill: Bill = {
                    ...billData,
                    id: `bill-${Date.now()}`,
                };
                return [...prev, newBill];
            }
        });
        setEditingBill(undefined); // Close modal
    };
    
    const handleDeleteBill = (billId: string) => {
        setBills(prev => prev.filter(b => b.id !== billId));
        setEditingBill(undefined); // Close modal
    };

    const handleDeployTemplate = (parameters: Record<string, string | number>, clearExisting: boolean, trackingMode: 'account_balance' | 'goal_specific') => {
        if (!templateToDeploy) return;
    
        const newItems: { rules: AutomationRule[], sources: IncomeSource[], milestones: AutomationMilestone[], categories: BudgetCategory[], actions: AutomationAction[], autoInvestRules: AutoInvestRule[] } = { rules: [], sources: [], milestones: [], categories: [], actions: [], autoInvestRules: [] };
        const idMap = new Map<string, string>(); // Maps template node ID to new real ID
    
        // Create new sources
        templateToDeploy.nodes.filter(n => n.type === 'source').forEach(node => {
            const newId = `source-tpl-${Date.now()}-${Math.random()}`;
            idMap.set(node.id, newId);
            const accountIdParam = String(node.data.destinationAccountId);
            const accountId = accountIdParam.startsWith('{{') ? String(parameters[accountIdParam.substring(2, accountIdParam.length - 2)]) : accountIdParam;
            
            newItems.sources.push({
                ...(node.data as Omit<IncomeSource, 'id'>),
                id: newId,
                accountId: accountId,
                deletable: true,
            });
        });
        
        // Create new budget categories
        templateToDeploy.categoriesToCreate.forEach(catTemplate => {
            const newId = `cat-tpl-${Date.now()}-${Math.random()}`;
            const Icon = IconMap[catTemplate.iconName];
            if (Icon) {
                newItems.categories.push({
                    id: newId,
                    name: catTemplate.name,
                    spent: 0,
                    goal: resolveValue(catTemplate.goal, parameters),
                    Icon: Icon,
                    color: catTemplate.color,
                    pacing: 'good',
                    transactions: [],
                    isShortcut: false,
                    mainCategory: catTemplate.mainCategory,
                });
            }
        });
        setAllCategories(prev => [...prev, ...newItems.categories]);
    
        // Create new goals (rules) and actions
        templateToDeploy.nodes.filter(n => n.type === 'goal' || n.type === 'action').forEach(node => {
            const isAction = node.type === 'action';
            const newId = `${isAction ? 'action' : 'rule'}-tpl-${Date.now()}-${Math.random()}`;
            idMap.set(node.id, newId);
            
            const sourceTriggers = templateToDeploy.edges
                .filter(e => e.target === node.id)
                .map(e => idMap.get(e.source))
                .filter((id): id is string => !!id);

            let name = node.data.name;
            Object.keys(parameters).forEach(key => {
                if(key.includes('_NAME')) {
                     name = name.replace(`{{${key}}}`, String(parameters[key]));
                }
            });

            if (isAction) {
                const actionData = node.data as Partial<AutomationAction>;
                newItems.actions.push({
                    ...actionData,
                    id: newId,
                    name,
                    sourceTriggers,
                } as AutomationAction);
            } else { // It's a goal
                const accountIdParam = String(node.data.destinationAccountId);
                const accountId = accountIdParam.startsWith('{{') ? String(parameters[accountIdParam.substring(2, accountIdParam.length - 2)]) : accountIdParam;
        
                const blockingRules = (node.data.blockingRules || []).map(br => {
                    const sourceGoalTemplateId = templateToDeploy.nodes.find(n => n.id === br.sourceGoalId)?.id;
                    const newSourceGoalId = sourceGoalTemplateId ? idMap.get(sourceGoalTemplateId) : undefined;
                    return newSourceGoalId ? { sourceGoalId: newSourceGoalId, condition: br.condition } : null;
                }).filter(Boolean) as { sourceGoalId: string; condition: 'must_be_complete' }[];

                newItems.rules.push({
                    ...(node.data as Omit<AutomationRule, 'id'>),
                    id: newId,
                    name,
                    destinationAccountId: accountId,
                    goal: resolveValue(node.data.goal, parameters),
                    percentage: resolveValue(node.data.percentage, parameters),
                    sourceTriggers,
                    status: 'active',
                    lastTransferFailed: false,
                    trackingMode: trackingMode,
                    blockingRules,
                    increasePercentageOverTimeConfig: node.data.increasePercentageOverTimeConfig ? { ...node.data.increasePercentageOverTimeConfig, lastIncreaseDate: undefined } : undefined,
                });
            }
        });
    
        // Create new milestones
        templateToDeploy.nodes.filter(n => n.type === 'milestone').forEach(node => {
            const newId = `milestone-tpl-${Date.now()}-${Math.random()}`;
            idMap.set(node.id, newId);
            const sourceGoalId = idMap.get(node.data.sourceGoalId || '');
            
            if (sourceGoalId) {
                newItems.milestones.push({
                    ...(node.data as Omit<AutomationMilestone, 'id'>),
                    id: newId,
                    sourceGoalId: sourceGoalId,
                });
            }
        });
        
        // Create new auto-invest rules
        templateToDeploy.autoInvestRules?.forEach(ruleTemplate => {
            const sourceGoalId = idMap.get(ruleTemplate.sourceGoalId || '');
            const resolvedTriggerAmount = resolveValue(ruleTemplate.triggerAmount, parameters);
            const resolvedTradeAmount = resolveValue(ruleTemplate.tradeAction.amount, parameters);

            let symbol = ruleTemplate.tradeAction.symbol;
            if (symbol.startsWith('{{') && symbol.endsWith('}}')) {
                const key = symbol.substring(2, symbol.length - 2);
                symbol = String(parameters[key]);
            }

            if (sourceGoalId) {
                newItems.autoInvestRules.push({
                    ...ruleTemplate,
                    id: `autoinvest-tpl-${Date.now()}-${Math.random()}`,
                    sourceGoalId: sourceGoalId,
                    triggerAmount: resolvedTriggerAmount,
                    tradeAction: {
                        ...ruleTemplate.tradeAction,
                        symbol: symbol,
                        amount: resolvedTradeAmount,
                    },
                    lastTriggeredValue: 0,
                });
            }
        });
    
        setAutomationBoards(prevBoards => prevBoards.map(board => {
            if (board.id !== activeBoardId) return board;

            return {
                ...board,
                incomeSources: clearExisting ? newItems.sources : [...board.incomeSources, ...newItems.sources],
                automationRules: clearExisting ? newItems.rules : [...board.automationRules, ...newItems.rules],
                automationMilestones: clearExisting ? newItems.milestones : [...board.automationMilestones, ...newItems.milestones],
                automationActions: clearExisting ? newItems.actions : [...board.automationActions, ...newItems.actions],
                autoInvestRules: clearExisting ? newItems.autoInvestRules : [...board.autoInvestRules, ...newItems.autoInvestRules],
            };
        }));
    
        setIsTemplateWizardOpen(false);
        setTemplateToDeploy(null);
    };

    // --- Automation Board Handlers ---
    const handleOpenAddBoardFlow = () => setIsCreateBoardModalOpen(true);
    
    const handleCreateBoard = (name: string) => {
        const newBoard: AutomationBoard = {
            id: `board-${Date.now()}`,
            name,
            type: 'individual',
            status: 'active',
            incomeSources: [],
            automationRules: [],
            automationMilestones: [],
            automationActions: [],
            autoInvestRules: [],
        };
        setAutomationBoards(prev => [...prev, newBoard]);
        setActiveBoardId(newBoard.id);
        setIsCreateBoardModalOpen(false);
    };

    const handleRenameBoard = (boardId: string, newName: string) => {
        setAutomationBoards(prev => prev.map(b => b.id === boardId ? { ...b, name: newName } : b));
    };
    
    const handleDeleteBoard = (boardId: string) => {
        if (automationBoards.length <= 1) {
            alert("You cannot delete your only board.");
            return;
        }
        setAutomationBoards(prev => {
            const remaining = prev.filter(b => b.id !== boardId);
            if (activeBoardId === boardId) {
                setActiveBoardId(remaining[0].id);
            }
            return remaining;
        });
    };
    
    const handleToggleBoardStatus = (boardId: string) => {
        setAutomationBoards(prev => prev.map(b => b.id === boardId ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' } : b));
    };

    // --- Source Handlers ---
    const handleOpenAddSourceModal = () => { setEditingSource(null); setIsAddSourceModalOpen(true); };
    const handleOpenEditSourceModal = (source: IncomeSource) => { setEditingSource(source); setIsAddSourceModalOpen(true); };
    
    const handleSaveSource = (sourceData: Omit<IncomeSource, 'id'> | IncomeSource) => {
        setAutomationBoards(prevBoards => prevBoards.map(board => {
            if (board.id !== activeBoardId) return board;
            if ('id' in sourceData) { // Editing
                return { ...board, incomeSources: board.incomeSources.map(s => s.id === sourceData.id ? sourceData : s) };
            } else { // Adding
                const newSource: IncomeSource = { ...sourceData, id: `source-${Date.now()}` };
                return { ...board, incomeSources: [...board.incomeSources, newSource] };
            }
        }));
        setIsAddSourceModalOpen(false);
    };

    const handleDeleteSource = (sourceId: string) => {
        setAutomationBoards(prevBoards => prevBoards.map(board => {
            if (board.id !== activeBoardId) return board;
            const updatedRules = board.automationRules.map(rule => ({ ...rule, sourceTriggers: rule.sourceTriggers.filter(id => id !== sourceId) }));
            return { ...board, incomeSources: board.incomeSources.filter(s => s.id !== sourceId), automationRules: updatedRules };
        }));
        setIsAddSourceModalOpen(false);
    };

    // --- Milestone & Rule Handlers ---
    const handleAddMilestone = () => {
        const newMilestone: AutomationMilestone = { id: `milestone-${Date.now()}`, name: 'New Milestone', sourceGoalId: '', triggerPercentage: 50 };
        setAutomationBoards(prev => prev.map(b => b.id === activeBoardId ? { ...b, automationMilestones: [...b.automationMilestones, newMilestone] } : b));
    };

    const handleDeleteRule = (ruleId: string) => {
        setAutomationBoards(prevBoards => prevBoards.map(board => {
            if (board.id !== activeBoardId) return board;
    
            const updatedRules = board.automationRules.filter(r => r.id !== ruleId);
            
            // Also remove this ruleId from any other rules that might be sourcing it
            const cleanedRules = updatedRules.map(rule => ({
                ...rule,
                sourceTriggers: rule.sourceTriggers.filter(triggerId => triggerId !== ruleId)
            }));
    
            // And remove any milestones that were watching this rule
            const cleanedMilestones = board.automationMilestones.filter(m => m.sourceGoalId !== ruleId);
    
            return { 
                ...board, 
                automationRules: cleanedRules,
                automationMilestones: cleanedMilestones,
            };
        }));
    };
    
    const handleSaveMilestone = (milestone: AutomationMilestone) => {
        setAutomationBoards(prevBoards => prevBoards.map(board => {
            if (board.id !== activeBoardId) return board;
            return {
                ...board,
                automationMilestones: board.automationMilestones.map(m => m.id === milestone.id ? milestone : m)
            };
        }));
    };
    
    const handleDeleteMilestone = (milestoneId: string) => {
        setAutomationBoards(prevBoards => prevBoards.map(board => {
            if (board.id !== activeBoardId) return board;
            return {
                ...board,
                automationMilestones: board.automationMilestones.filter(m => m.id !== milestoneId)
            };
        }));
    };

    // --- Template Handler ---
    const handleSaveAsTemplate = (templateData: Omit<AutomationTemplate, 'id'>) => {
        const newTemplate: AutomationTemplate = { ...templateData, id: `template-custom-${Date.now()}` };
        setAllTemplates(prev => [...prev, newTemplate]);
        alert(`Template "${newTemplate.name}" saved!`);
    };

    // --- AI Assist Handlers ---
    const handleRequestOptimalMilestones = (ruleId: string) => {
        setAiMilestoneTarget(ruleId);
        setIsMilestoneTypeModalOpen(true);
    };

    const handleGenerateOptimalMilestones = async (type: 'visual' | 'node', count: number) => {
        if (!aiMilestoneTarget) return;

        const targetRule = automationRules.find(r => r.id === aiMilestoneTarget);
        if (!targetRule) return;

        setAiActionState({ isLoading: true, targetNodeId: aiMilestoneTarget });
        setIsMilestoneTypeModalOpen(false);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const prompt = `A user has a financial goal: "${targetRule.name}" with a target of $${targetRule.goal}. Generate ${count} smart, actionable, and encouraging milestones to help them reach this goal. For each milestone, provide a percentage of the goal it represents and a short description of what the user should do or what the milestone means.

            Respond ONLY with a JSON object with the following structure: { "milestones": [{ "percentage": 25, "description": "Your description here." }] }. The percentages should be numbers between 1 and 100.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            milestones: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        percentage: { type: Type.NUMBER },
                                        description: { type: Type.STRING },
                                    },
                                    required: ['percentage', 'description'],
                                },
                            },
                        },
                        required: ['milestones'],
                    },
                },
            });

            const data = JSON.parse(response.text);
            const newMilestones: Milestone[] | AutomationMilestone[] = data.milestones;

            if (type === 'visual') {
                const updatedRule = {
                    ...targetRule,
                    milestones: [...(targetRule.milestones || []), ...newMilestones as Milestone[]].sort((a, b) => a.percentage - b.percentage),
                };
                handleSaveRule(updatedRule);
            } else { // type === 'node'
                const newMilestoneNodes: AutomationMilestone[] = (newMilestones as {percentage: number, description: string}[]).map((m, i) => ({
                    id: `milestone-ai-${Date.now()}-${i}`,
                    name: `Milestone: ${m.percentage}%`,
                    advice: m.description,
                    sourceGoalId: targetRule.id,
                    triggerPercentage: m.percentage,
                }));

                setAutomationBoards(prevBoards => prevBoards.map(board => 
                    board.id === activeBoardId 
                    ? { ...board, automationMilestones: [...board.automationMilestones, ...newMilestoneNodes] }
                    : board
                ));
            }
        } catch (e) {
            console.error("AI milestone generation failed:", e);
            alert("Sorry, the AI could not generate milestones at this time.");
        } finally {
            setAiActionState({ isLoading: false, targetNodeId: null });
            setAiMilestoneTarget(null);
        }
    };

    const handleCreateNextGoal = async (ruleId: string) => {
        const sourceRule = automationRules.find(r => r.id === ruleId);
        if (!sourceRule) return;

        setAiActionState({ isLoading: true, targetNodeId: ruleId });

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            const allGoalsDescription = automationRules.map(r => `Existing goal: ${r.name} (Goal: $${r.goal}, Type: ${r.goalType})`).join('\n');

            const prompt = `Given the user's completed or current financial goal: "${sourceRule.name}" (with a target of $${sourceRule.goal}), suggest a logical next financial goal. The user already has these goals: ${allGoalsDescription}. The new goal should not be one they already have. The new goal should be a natural progression. For example, after "Pay off Credit Card", a good next goal is "Build Emergency Fund". After "Save for a car", a good goal could be "Invest for retirement". 
            
            Respond ONLY with a JSON object with the following structure: { "name": "New Goal Name", "goal": 5000, "goalType": "Short-Term" | "Long-Term" | "Investment" }. The goal amount should be a reasonable starting number.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            goal: { type: Type.NUMBER },
                            goalType: { type: Type.STRING, enum: ['Short-Term', 'Long-Term', 'Investment'] },
                        },
                        required: ['name', 'goal', 'goalType'],
                    }
                }
            });

            const nextGoalData = JSON.parse(response.text);

            const newGoal: AutomationRule = {
                id: `rule-ai-${Date.now()}`,
                name: nextGoalData.name,
                destinationAccountId: sourceRule.destinationAccountId, // Default to same account
                percentage: sourceRule.percentage, // Default to same percentage
                goal: nextGoalData.goal,
                sourceTriggers: [sourceRule.id], // Chain it to the previous goal
                status: 'inactive',
                goalType: nextGoalData.goalType,
                completionAction: 'stop',
                lastTransferFailed: false,
                trackingMode: sourceRule.trackingMode,
            };

            setAutomationBoards(prevBoards => prevBoards.map(board => 
                board.id === activeBoardId 
                ? { ...board, automationRules: [...board.automationRules, newGoal] }
                : board
            ));

        } catch (e) {
            console.error("AI next goal generation failed:", e);
            alert("Sorry, the AI could not generate a next goal at this time.");
        } finally {
            setAiActionState({ isLoading: false, targetNodeId: null });
        }
    };

    const handleSaveEvent = (type: string, data: any) => {
        switch (type) {
            case 'custom': {
                const newCustomEvent: CustomCalendarEvent = {
                    ...data,
                    id: `event-custom-${Date.now()}`
                };
                setCustomEvents(prev => [...prev, newCustomEvent]);
                break;
            }
            case 'bill': {
                const newBill: Bill = {
                    ...data,
                    id: `bill-cal-${Date.now()}`
                };
                setBills(prev => [...prev, newBill]);
                break;
            }
            case 'income-source': {
                const newSource: IncomeSource = {
                    ...data,
                    id: `source-cal-${Date.now()}`,
                };
                setAutomationBoards(prevBoards => prevBoards.map(board => 
                    board.id === activeBoardId 
                    ? { ...board, incomeSources: [...board.incomeSources, newSource] }
                    : board
                ));
                break;
            }
            case 'goal-due': {
                setAutomationBoards(prevBoards => prevBoards.map(board => 
                    board.id === activeBoardId 
                    ? { ...board, automationRules: board.automationRules.map(r => r.id === data.id ? { ...r, dueDate: data.date } : r) }
                    : board
                ));
                break;
            }
            case 'goal-start': {
                setAutomationBoards(prevBoards => prevBoards.map(board => 
                    board.id === activeBoardId 
                    ? { ...board, automationRules: board.automationRules.map(r => r.id === data.id ? { ...r, startDate: data.date } : r) }
                    : board
                ));
                break;
            }
            case 'milestone-due': {
                setAutomationBoards(prevBoards => prevBoards.map(board => 
                    board.id === activeBoardId 
                    ? { ...board, automationMilestones: board.automationMilestones.map(m => m.id === data.id ? { ...m, dueDate: data.date } : m) }
                    : board
                ));
                break;
            }
            case 'milestone-start': {
                setAutomationBoards(prevBoards => prevBoards.map(board => 
                    board.id === activeBoardId 
                    ? { ...board, automationMilestones: board.automationMilestones.map(m => m.id === data.id ? { ...m, startDate: data.date } : m) }
                    : board
                ));
                break;
            }
        }
        setIsAddEventModalOpen(false);
    };
    
    // --- Account Handlers ---
    const handleSelectAccount = (accountId: string) => {
        setSelectedAccountId(prev => (prev === accountId ? null : accountId));
    };

    const handleOpenEditAccountModal = (account: WalletAccount) => {
        setEditingAccount(account);
        setIsAddAccountModalOpen(true);
    };

    const handleCloseAddAccountModal = () => {
        setIsAddAccountModalOpen(false);
        setEditingAccount(null);
    };

    const handleOpenDepositModal = (accountId: string) => {
        setDepositTargetAccountId(accountId);
        setIsDepositModalOpen(true);
    };

    const handleSaveAccount = (accountData: Omit<WalletAccount, 'balance' | 'history'> & { id?: string }) => {
        if (accountData.id) { // Editing
            setAccounts(prev => prev.map(acc => acc.id === accountData.id ? { ...acc, ...accountData } as WalletAccount : acc));
        } else { // Adding new
            const newAccount: WalletAccount = {
                ...(accountData as Omit<WalletAccount, 'id' | 'balance' | 'history'>),
                id: `account-${Date.now()}`,
                balance: 0,
                history: [],
            };
            setAccounts(prev => [...prev, newAccount]);
        }
        handleCloseAddAccountModal();
    };
    
    // --- New Automation Action Handlers ---
    const handleAddAutomationAction = (type: 'deposit_to_brokerage' | 'activate_ai_trader') => {
        const newAction: AutomationAction = type === 'deposit_to_brokerage'
            ? {
                id: `action-${Date.now()}`,
                name: 'Deposit to Brokerage',
                type: 'deposit_to_brokerage',
                percentage: 10,
                sourceTriggers: [],
            }
            : {
                id: `action-${Date.now()}`,
                name: 'Activate AI Trader',
                type: 'activate_ai_trader',
                strategy: {
                    strategyType: 'Long-Term Investing',
                    riskTolerance: 50,
                    investmentAmount: 1000,
                    takeProfitPercentage: 20,
                    stopLossPercentage: 10,
                },
                sourceTriggers: [],
            };
        
        setAutomationBoards(prev => prev.map(b => 
            b.id === activeBoardId 
            ? { ...b, automationActions: [...b.automationActions, newAction] } 
            : b
        ));
    };

    const handleSaveAutomationAction = (action: AutomationAction) => {
        setAutomationBoards(prev => prev.map(b => 
            b.id === activeBoardId 
            ? { ...b, automationActions: b.automationActions.map(a => a.id === action.id ? action : a) }
            : b
        ));
    };

    const handleDeleteAutomationAction = (actionId: string) => {
        setAutomationBoards(prev => prev.map(b => {
            if (b.id !== activeBoardId) return b;
            // Also clean up any source triggers pointing to this action
            const updatedRules = b.automationRules.map(r => ({ ...r, sourceTriggers: r.sourceTriggers.filter(id => id !== actionId) }));
            const updatedActions = b.automationActions.map(a => ({ ...a, sourceTriggers: a.sourceTriggers.filter(id => id !== actionId) }));
            return {
                ...b,
                automationRules: updatedRules,
                automationActions: updatedActions.filter(a => a.id !== actionId)
            };
        }));
    };
    
    // --- New Auto-Invest Handlers ---
    const handleAddAutoInvestRule = () => {
        const newRule: AutoInvestRule = {
            id: `autoinvest-${Date.now()}`,
            name: 'New Auto-Invest Rule',
            sourceGoalId: '',
            triggerType: 'on_every_increase',
            triggerAmount: 1000,
            tradeAction: { symbol: 'AAPL', amount: 50 },
            lastTriggeredValue: 0,
        };
         setAutomationBoards(prev => prev.map(b => 
            b.id === activeBoardId 
            ? { ...b, autoInvestRules: [...b.autoInvestRules, newRule] } 
            : b
        ));
    };
    
    const handleSaveAutoInvestRule = (rule: AutoInvestRule) => {
        setAutomationBoards(prev => prev.map(b => 
            b.id === activeBoardId 
            ? { ...b, autoInvestRules: b.autoInvestRules.map(r => r.id === rule.id ? rule : r) }
            : b
        ));
    };

    const handleDeleteAutoInvestRule = (ruleId: string) => {
        setAutomationBoards(prev => prev.map(b => 
            b.id === activeBoardId 
            ? { ...b, autoInvestRules: b.autoInvestRules.filter(r => r.id !== ruleId) } 
            : b
        ));
    };

    // --- AUTOMATION ENGINE ---
    const runAutomations = (sourceId: string, depositAmount: number) => {
        if (!activeAutomationBoard || activeAutomationBoard.status === 'inactive') return;

        console.log(`Automation triggered by source: ${sourceId} with amount: $${depositAmount}`);
        const allNodes = [...activeAutomationBoard.automationRules, ...activeAutomationBoard.automationActions];
        
        let newAccounts = [...accounts];

        const processNode = (node: AutomationRule | AutomationAction, amount: number) => {
            console.log(`Processing node: ${node.name}`);
            
            let allocatedAmount = 0;
            if ('destinationAccountId' in node) { // It's a Rule
                const transferAmount = (amount * node.percentage) / 100;
                const fromAccount = newAccounts.find(acc => acc.id === incomeSources.find(s => s.id === sourceId)?.accountId);
                const toAccount = newAccounts.find(acc => acc.id === node.destinationAccountId);

                if (fromAccount && toAccount && fromAccount.balance >= transferAmount) {
                    allocatedAmount = transferAmount;
                    const txId = `tx-auto-${Date.now()}-${Math.random()}`;
                    newAccounts = newAccounts.map(acc => {
                        if (acc.id === fromAccount.id) return { ...acc, balance: acc.balance - transferAmount, history: [{id: txId + '-from', type: 'allocation', amount: transferAmount, date: new Date().toISOString(), description: `To: ${node.name}`}, ...acc.history] };
                        if (acc.id === toAccount.id) return { ...acc, balance: acc.balance + transferAmount, history: [{id: txId + '-to', type: 'allocation', amount: transferAmount, date: new Date().toISOString(), description: `From: ${fromAccount.name}`}, ...acc.history] };
                        return acc;
                    });
                     console.log(`Transferred $${transferAmount.toFixed(2)} from ${fromAccount.name} to ${toAccount.name}`);
                }
            } else if (node.type === 'deposit_to_brokerage') {
                const depositToBrokerageAmount = (amount * node.percentage) / 100;
                handleAddFundsToPortfolio(depositToBrokerageAmount);
                console.log(`Deposited $${depositToBrokerageAmount.toFixed(2)} to brokerage.`);
            } else if (node.type === 'activate_ai_trader') {
                setActiveAiStrategy(node.strategy);
                console.log('Activated AI Trader with strategy:', node.strategy);
            }

            // Find next nodes in the chain and process them
            const nextNodes = allNodes.filter(n => n.sourceTriggers.includes(node.id));
            nextNodes.forEach(nextNode => processNode(nextNode, allocatedAmount));
        };

        const initialNodes = allNodes.filter(node => node.sourceTriggers.includes(sourceId));
        initialNodes.forEach(node => processNode(node, depositAmount));
        
        setAccounts(newAccounts); // Final state update
    };

    // Auto-Invest Engine
    useEffect(() => {
        if (!activeAutomationBoard || !alpacaData?.account) return;

        let boardWasUpdated = false;
        const newTradeHistory = [...tradeHistory];
        let newCashBalance = parseFloat(alpacaData.account.cash);

        const updatedAutoInvestRules = activeAutomationBoard.autoInvestRules.map(rule => {
            const sourceGoal = activeAutomationBoard.automationRules.find(r => r.id === rule.sourceGoalId);
            if (!sourceGoal) return rule;

            const account = accounts.find(a => a.id === sourceGoal.destinationAccountId);
            if (!account) return rule;

            const currentBalance = account.balance;
            const { triggerType, triggerAmount, lastTriggeredValue, tradeAction } = rule;
            let shouldTrigger = false;
            
            if (triggerType === 'on_amount_reached') {
                if (currentBalance >= triggerAmount && lastTriggeredValue < triggerAmount) {
                    shouldTrigger = true;
                }
            } else if (triggerType === 'on_every_increase') {
                if (currentBalance >= triggerAmount) {
                    const newTimesTriggered = Math.floor(currentBalance / triggerAmount);
                    const oldTimesTriggered = Math.floor(lastTriggeredValue / triggerAmount);
                    if (newTimesTriggered > oldTimesTriggered) {
                        shouldTrigger = true;
                    }
                }
            }

            if (shouldTrigger && newCashBalance >= tradeAction.amount) {
                console.log(`Auto-Invest Triggered: ${rule.name}`);
                boardWasUpdated = true;
                newCashBalance -= tradeAction.amount;
                
                const newTrade: TradeEvent = {
                    id: `trade-auto-${Date.now()}`,
                    symbol: tradeAction.symbol,
                    side: 'buy',
                    qty: tradeAction.amount / (popularStocks.find(s => s.symbol === tradeAction.symbol)?.price || 150), // Mock price
                    price: popularStocks.find(s => s.symbol === tradeAction.symbol)?.price || 150,
                    date: new Date().toISOString(),
                    isAiTrade: true,
                };
                newTradeHistory.push(newTrade);

                return { ...rule, lastTriggeredValue: currentBalance };
            }

            return rule;
        });

        if (boardWasUpdated) {
            setAutomationBoards(prev => prev.map(b => b.id === activeBoardId ? { ...b, autoInvestRules: updatedAutoInvestRules } : b));
            setTradeHistory(newTradeHistory);
            setAlpacaData(prev => prev ? { ...prev, account: { ...prev.account, cash: String(newCashBalance) } } : null);
        }
    // Watching accounts is key. A trade only happens when a goal balance changes.
    }, [accounts, activeAutomationBoard, alpacaData]);


    const handleDeposit = (amount: number, description: string) => {
        if (!depositTargetAccountId) return;

        const newTransaction: WalletTransaction = {
            id: `tx-${Date.now()}`,
            type: 'deposit',
            amount,
            description,
            date: new Date().toISOString(),
        };

        setAccounts(prevAccounts => prevAccounts.map(acc => {
            if (acc.id === depositTargetAccountId) {
                return {
                    ...acc,
                    balance: acc.balance + amount,
                    history: [newTransaction, ...acc.history],
                };
            }
            return acc;
        }));

        // --- AUTOMATION ENGINE TRIGGER ---
        const activeBoard = automationBoards.find(b => b.id === activeBoardId && b.status === 'active');
        if (activeBoard) {
            const linkedSource = activeBoard.incomeSources.find(s => 
                s.isLinked &&
                s.accountId === depositTargetAccountId &&
                s.depositKeyword &&
                description.toLowerCase().includes(s.depositKeyword.toLowerCase())
            );
            if (linkedSource) {
                 runAutomations(linkedSource.id, amount);
            }
        }
        
        setIsDepositModalOpen(false);
        setDepositTargetAccountId(null);
    };

    const handleLogPurchaseFromReceipt = (data: { amount: number; description: string; categoryName: string; accountId: string; receiptImage: string | null; }) => {
        // 1. Update Wallet Account
        setAccounts(prevAccounts => prevAccounts.map(acc => {
            if (acc.id === data.accountId) {
                const newTransaction: WalletTransaction = {
                    id: `tx-receipt-${Date.now()}`,
                    type: 'purchase',
                    amount: data.amount,
                    description: data.description,
                    date: new Date().toISOString(),
                    category: data.categoryName,
                    receiptImage: data.receiptImage || undefined,
                };
                return {
                    ...acc,
                    balance: acc.balance - data.amount,
                    history: [newTransaction, ...acc.history],
                };
            }
            return acc;
        }));

        // 2. Update Budget Category
        setAllCategories(prevCategories => prevCategories.map(cat => {
            if (cat.name === data.categoryName) {
                const newTransaction: CategoryTransaction = {
                    id: `cat-tx-receipt-${Date.now()}`,
                    description: data.description,
                    amount: data.amount,
                    date: new Date().toISOString(),
                };
                return {
                    ...cat,
                    spent: cat.spent + data.amount,
                    transactions: [newTransaction, ...cat.transactions],
                };
            }
            return cat;
        }));

        setIsReceiptScannerModalOpen(false);
    };

     const handleFetchCreditReport = async () => {
        setIsFetchingCreditReport(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockReport: CreditReport = {
            credit_score: {
                equifax: { score: 780, reason_codes: ["Too many inquiries", "High credit card utilization"] },
                transunion: { score: 795, reason_codes: ["High credit card utilization", "Short credit history"] },
                experian: { score: 788, reason_codes: ["Too many recent accounts", "High credit card utilization"] }
            },
            trade_accounts: [
                { account_type: 'Credit Card', balance: '2500', high_credit: '10000', credit_limit: '10000', payment_history: '1,1,1,1,1,1,1,1,1,1,1,1', months_reviewed: '12', portfolio_type: 'revolving', account_status: 'Open', company: 'Capital One' },
                { account_type: 'Auto Loan', balance: '15320', high_credit: '25000', credit_limit: '25000', payment_history: '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', months_reviewed: '16', portfolio_type: 'installment', account_status: 'Open', company: 'Toyota Financial' },
                { account_type: 'Mortgage', balance: '225000', high_credit: '275000', credit_limit: '275000', payment_history: '1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1', months_reviewed: '24', portfolio_type: 'mortgage', account_status: 'Open', company: 'Wells Fargo' },
                { account_type: 'Credit Card', balance: '500', high_credit: '5000', credit_limit: '5000', payment_history: '1,1,1,1,1,1', months_reviewed: '6', portfolio_type: 'revolving', account_status: 'Open', company: 'Chase' },
            ],
            inquiries: [
                { company: 'CREDCO', date: '2024-05-15', industry: 'Auto' },
                { company: 'AMEX', date: '2024-02-01', industry: 'Credit Card' },
            ],
            collections: [],
            public_record: [],
        };

        setCreditReport(mockReport);
        setIsFetchingCreditReport(false);
    };

    // --- New Tracker Handlers ---
    const handleNextTracker = () => setActiveTrackerIndex(i => (i + 1) % trackers.length);
    const handlePrevTracker = () => setActiveTrackerIndex(i => (i - 1 + trackers.length) % trackers.length);

    const handleTrackerTargetChange = (newTarget: number) => {
        setTrackers(prev => prev.map((tracker, index) => 
            index === activeTrackerIndex ? { ...tracker, target: newTarget } : tracker
        ));
    };

    const handleAddNewTracker = (newTrackerData: Omit<DashboardTracker, 'id'>) => {
        const newTracker: DashboardTracker = {
            ...newTrackerData,
            id: `tracker-${Date.now()}`,
        };
        setTrackers(prev => {
            const newTrackers = [...prev, newTracker];
            setActiveTrackerIndex(newTrackers.length - 1);
            return newTrackers;
        });
        setIsCreateGoalModalOpen(false);
    };

    // --- AI Chat Handler ---
    const handleNewConversation = () => {
        setActiveConversationId(null);
        chatRef.current = null; // Reset chat session for new conversation
    };

    const handleSendMessageToAi = async (message: string) => {
        setIsAiChatLoading(true);
        setCurrentAiResponse('');

        let conversationToUpdateId = activeConversationId;
        let conversationHistory: ChatMessage[];

        // If it's a new chat, create it
        if (!conversationToUpdateId) {
            const newConversation: Conversation = {
                id: `convo-${Date.now()}`,
                title: message.length > 40 ? message.substring(0, 37) + '...' : message,
                messages: [{ speaker: 'user', text: message }],
            };
            setConversations(prev => [newConversation, ...prev]);
            conversationToUpdateId = newConversation.id;
            setActiveConversationId(newConversation.id);
            conversationHistory = []; // New chat starts with no history for the API call
        } else {
            const activeConvo = conversations.find(c => c.id === conversationToUpdateId);
            if (!activeConvo) { console.error("Active conversation not found"); return; }
            
            const updatedMessages = [...activeConvo.messages, { speaker: 'user', text: message }];
            setConversations(prev => prev.map(c => c.id === conversationToUpdateId ? { ...c, messages: updatedMessages } : c));
            // Provide previous messages as history to the API
            conversationHistory = activeConvo.messages;
        }
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const financialContext = JSON.stringify({
                accounts: accounts.map(a => ({ name: a.name, balance: a.balance })),
                budgets: allCategories.map(c => ({ name: c.name, spent: c.spent, goal: c.goal })),
                bills: bills.map(b => ({ name: b.name, amount: b.amount, dueDate: b.dueDate })),
            });
            const systemInstruction = `You are a helpful financial assistant. The user can ask you questions about their finances. Here is a JSON summary of their current financial data: ${financialContext}. Use this data to answer their questions. Keep your answers concise and helpful.`;
            
            // Start a new chat session only for new conversations
            if (!chatRef.current || !activeConversationId) {
                 chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: { systemInstruction },
                    history: conversationHistory.map(m => ({
                        role: m.speaker === 'user' ? 'user' : 'model',
                        parts: m.text
                    }))
                });
            }
            
            const response = await chatRef.current.sendMessageStream({ message });
            
            let responseText = '';
            for await (const chunk of response) {
                responseText += chunk.text;
                setCurrentAiResponse(responseText);
            }
            
            setConversations(prev => prev.map(c => {
                if (c.id === conversationToUpdateId) {
                    return { ...c, messages: [...c.messages, { speaker: 'ai', text: responseText }] };
                }
                return c;
            }));

        } catch (e) {
            console.error("AI Chat Error:", e);
             setConversations(prev => prev.map(c => {
                if (c.id === conversationToUpdateId) {
                    return { ...c, messages: [...c.messages, { speaker: 'ai', text: "I'm sorry, I encountered an error and can't respond right now." }] };
                }
                return c;
            }));
        } finally {
            setIsAiChatLoading(false);
            setCurrentAiResponse('');
        }
    };

    // --- Settings Handler ---
    const handleSaveApiKeys = (keys: AlpacaKeys) => {
        setAlpacaKeys(keys);
    };

    // --- Stocks Handlers ---
    const handleViewStockDetail = (stock: StockDetails) => {
        setSelectedStock(stock);
        setCurrentView('stock-detail');
    };

    const handleBackToStocks = () => {
        setSelectedStock(null);
        setCurrentView('stocks');
    };
    
    const handleOpenPlaceTradeModal = (symbol?: string) => {
        setTradeModalSymbol(symbol);
        setIsPlaceTradeModalOpen(true);
    };
    
    const handlePlaceOrder = async (order: { symbol: string, qty: number, side: 'buy' | 'sell' }) => {
        if (!alpacaKeys) {
            throw new Error("API Keys not set.");
        }
        // In a real app, you would make the fetch call to Alpaca API here
        console.log("Placing order:", order);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        alert(`Order to ${order.side} ${order.qty} shares of ${order.symbol} submitted successfully! (Mock)`);
    };

    const handleAddFundsToPortfolio = (amount: number) => {
        setAlpacaData(prevData => {
            if (!prevData?.account) return prevData;
            const newCash = parseFloat(prevData.account.cash) + amount;
            const newPortfolioValue = parseFloat(prevData.account.portfolio_value) + amount;
            return {
                ...prevData,
                account: {
                    ...prevData.account,
                    cash: String(newCash),
                    portfolio_value: String(newPortfolioValue),
                }
            };
        });
    };

    // --- New AI Trader Handler ---
    const handleActivateAiStrategy = (strategy: AiTraderStrategy) => {
        setActiveAiStrategy(strategy);
        console.log("Activating AI Strategy:", strategy);
    };

    // --- New Header Button Handlers ---
    const handleExport = () => alert('Exporting your financial data...');
    
    // --- New Profile Handler ---
    const handleSaveProfile = (updatedProfile: UserProfile) => {
        setUserProfile(updatedProfile);
    };

    return (
      <div className="bg-gray-100 min-h-screen p-12">
        <div className="flex flex-col h-[calc(100vh-6rem)] bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
          {currentView === 'stocks' && <StockTicker />}
          <div className="flex flex-1 overflow-hidden">
              <Sidebar onNavigate={setCurrentView} currentView={currentView} avatarUrl={userProfile.avatarUrl} />
              <main className="flex-1 p-12 overflow-y-auto">
                {currentView === 'dashboard' && activeTracker && (
                    <MainDashboard 
                        activeTracker={activeTracker}
                        activeTrackerValue={activeTrackerValue}
                        onTrackerTargetChange={handleTrackerTargetChange}
                        onNextTracker={handleNextTracker}
                        onPrevTracker={handlePrevTracker}
                        canGoNext={trackers.length > 1}
                        canGoPrev={trackers.length > 1}
                        onAddGoalClick={() => setIsCreateGoalModalOpen(true)} 
                        onScanReceiptClick={() => setIsReceiptScannerModalOpen(true)} 
                        allCategories={allCategories} 
                        onOpenNotifications={() => setIsNotificationsOpen(true)}
                        onExportData={handleExport}
                        onNavigate={setCurrentView}
                    />
                )}
                {currentView === 'categories' && <AllCategoriesPage categories={allCategories} onCategoryClick={handleCategoryClick} onToggleShortcut={handleToggleShortcut} onAddCategoryClick={() => setIsAddCategoryModalOpen(true)} onDeleteCategory={handleDeleteCategory} onOrderChange={handleCategoryOrderChange} />}
                {currentView === 'wallet' && <FinancialDashboard 
                    accounts={accounts} 
                    transactions={walletTransactions} 
                    onAddCard={() => setIsAddCardModalOpen(true)} 
                    onSyncTransactions={() => {}} 
                    isSyncing={isSyncing} 
                    allCategories={allCategories} 
                    onAddAccount={() => { setEditingAccount(null); setIsAddAccountModalOpen(true); }}
                    onViewReceipt={setViewingReceipt}
                    selectedAccountId={selectedAccountId}
                    onSelectAccount={handleSelectAccount}
                    onEditAccount={handleOpenEditAccountModal}
                    onDepositToAccount={handleOpenDepositModal}
                />}
                {currentView === 'automations' && <AutomationWorkflowPage rules={automationRules} incomeSources={incomeSources} automationMilestones={automationMilestones} automationActions={automationActions} autoInvestRules={autoInvestRules} onSaveRule={handleSaveRule} onOpenTemplateLibrary={() => setIsTemplateLibraryOpen(true)} onAddGoal={() => handleAddGoal()} onAddSource={handleOpenAddSourceModal} onEditSource={handleOpenEditSourceModal} onDeleteRule={handleDeleteRule} onRuleConnect={handleRuleConnect} onRunTimeTriggers={() => {}} accounts={accounts} onAddMilestone={handleAddMilestone} onSaveMilestone={handleSaveMilestone} onDeleteMilestone={handleDeleteMilestone} onSaveAsTemplate={handleSaveAsTemplate} boards={automationBoards} activeBoardId={activeBoardId} onAddBoard={handleOpenAddBoardFlow} onSwitchBoard={setActiveBoardId} onRenameBoard={handleRenameBoard} onDeleteBoard={handleDeleteBoard} onToggleBoardStatus={handleToggleBoardStatus} aiActionState={aiActionState} onRequestOptimalMilestones={handleRequestOptimalMilestones} onCreateNextGoal={handleCreateNextGoal} onOpenAiAssistant={() => {}} onAddAutomationAction={handleAddAutomationAction} onSaveAutomationAction={handleSaveAutomationAction} onDeleteAutomationAction={handleDeleteAutomationAction} onAddAutoInvestRule={handleAddAutoInvestRule} onSaveAutoInvestRule={handleSaveAutoInvestRule} onDeleteAutoInvestRule={handleDeleteAutoInvestRule} />}
                {currentView === 'calendar' && <CalendarPage rules={automationRules} incomeSources={incomeSources} milestones={automationMilestones} accounts={accounts} bills={bills} customEvents={customEvents} onAddEvent={handleOpenAddEventModal} allCategories={allCategories} tradeHistory={tradeHistory} popularStocks={popularStocks} />}
                {currentView === 'credit' && <CreditPage report={creditReport} isLoading={isFetchingCreditReport} onFetchReport={handleFetchCreditReport} />}
                {currentView === 'stocks' && <StocksPage popularStocks={popularStocks} onViewStockDetail={handleViewStockDetail} onPlaceTrade={handleOpenPlaceTradeModal} alpacaKeys={alpacaKeys} onNavigate={setCurrentView} alpacaData={alpacaData} isLoading={alpacaLoading} error={alpacaError} onAddFunds={handleAddFundsToPortfolio} onOpenAiTrader={() => setIsAiTraderModalOpen(true)} activeAiStrategy={activeAiStrategy} />}
                {currentView === 'stock-detail' && selectedStock && <StockDetailPage stock={selectedStock} onBack={handleBackToStocks} onPlaceTrade={handleOpenPlaceTradeModal} />}
                {/* FIX: Changed `currentResponse` to `currentAiResponse` to match the state variable name. */}
                {currentView === 'ai-chat' && <AiChatPage conversations={conversations} activeConversationId={activeConversationId} currentResponse={currentAiResponse} isLoading={isAiChatLoading} onSendMessage={handleSendMessageToAi} onNewConversation={handleNewConversation} onSelectConversation={setActiveConversationId} />}
                {currentView === 'settings' && <SettingsPage onSave={handleSaveApiKeys} initialKeys={alpacaKeys} />}
                {currentView === 'profile' && <ProfilePage profile={userProfile} onSave={handleSaveProfile} />}
                {currentView === 'tax' && <TaxPage accounts={accounts} allCategories={allCategories} />}
              </main>
              {(currentView === 'dashboard' || isRightPanelPinned) && (
                  <RightPanel
                      shortcuts={shortcuts}
                      onCategoryClick={handleCategoryClick}
                      reviewCount={uncategorized.length}
                      onReviewClick={() => setIsAiModalOpen(true)}
                      bills={bills}
                      onAddBill={() => setEditingBill(null)}
                      onEditBill={(bill) => setEditingBill(bill)}
                      isPinned={isRightPanelPinned}
                      onPinToggle={() => setIsRightPanelPinned(prev => !prev)}
                      accounts={accounts}
                      onAddAccount={() => setIsAddAccountModalOpen(true)}
                      onNavigateToWallet={() => setCurrentView('wallet')}
                      onNavigateToCredit={() => setCurrentView('credit')}
                      onNavigateToTax={() => setCurrentView('tax')}
                  />
              )}
            </div>
        </div>
        
        {isCategoryModalOpen && selectedCategory && (
            <CategoryDetailModal
                category={selectedCategory}
                onClose={() => setIsCategoryModalOpen(false)}
                onSave={handleSaveCategory}
                onDelete={handleDeleteCategory}
            />
        )}
        {isAddCategoryModalOpen && (
            <AddCategoryModal
                onClose={() => setIsAddCategoryModalOpen(false)}
                onAddCategory={handleAddCategory}
                existingCategories={allCategories}
                allPossibleCategories={allPossibleCategories}
                defaults={addCategoryDefaults}
            />
        )}
        {isTemplateLibraryOpen && (
            <AutomationTemplateLibrary
                templates={allTemplates}
                onClose={() => setIsTemplateLibraryOpen(false)}
                onSelect={(template) => {
                    setTemplateToDeploy(template);
                    setIsTemplateLibraryOpen(false);
                    setIsTemplateWizardOpen(true);
                }}
                onOpenAiGenerator={() => {
                    setIsTemplateLibraryOpen(false);
                    setIsAiTemplateGeneratorOpen(true);
                }}
            />
        )}
        {isTemplateWizardOpen && templateToDeploy && (
            <TemplateSetupWizard
                template={templateToDeploy}
                accounts={accounts}
                incomeSources={incomeSources}
                onDeploy={handleDeployTemplate}
                onClose={() => setIsTemplateWizardOpen(false)}
            />
        )}
        {isBillModalOpen && (
            <BillModal
                billToEdit={editingBill as Bill | null}
                onClose={() => setEditingBill(undefined)}
                onSave={handleSaveBill}
                onDelete={handleDeleteBill}
            />
        )}
        {isMilestoneTypeModalOpen && (
            <MilestoneTypeModal
                onClose={() => setIsMilestoneTypeModalOpen(false)}
                onConfirm={handleGenerateOptimalMilestones}
                isLoading={aiActionState.isLoading}
            />
        )}
        {isCreateBoardModalOpen && <CreateBoardModal onClose={() => setIsCreateBoardModalOpen(false)} onCreate={handleCreateBoard} />}
        {isSelectTrackingModeModalOpen && <SelectTrackingModeModal onClose={() => setIsSelectTrackingModeModalOpen(false)} onConfirm={handleAddGoal} />}
        {isAddSourceModalOpen && <AddSourceModal onClose={() => setIsAddSourceModalOpen(false)} onSave={handleSaveSource} onDelete={handleDeleteSource} sourceToEdit={editingSource} accounts={accounts} rules={automationRules} />}
        {isAddEventModalOpen && (
            <AddEventModal
                isOpen={isAddEventModalOpen}
                defaultDate={defaultEventDate}
                onClose={() => setIsAddEventModalOpen(false)}
                onSave={handleSaveEvent}
                rules={automationRules}
                milestones={automationMilestones}
                accounts={accounts}
            />
        )}
        {isAddAccountModalOpen && (
            <AddAccountModal
                onClose={handleCloseAddAccountModal}
                onSaveAccount={handleSaveAccount}
                linkedCards={linkedCards}
                accountToEdit={editingAccount}
            />
        )}
        {isDepositModalOpen && (
            <DepositModal
                onClose={() => setIsDepositModalOpen(false)}
                onDeposit={handleDeposit}
            />
        )}
        {isCreateGoalModalOpen && (
            <CreateGoalModal 
                onClose={() => setIsCreateGoalModalOpen(false)}
                onAddTracker={handleAddNewTracker}
                accounts={accounts}
            />
        )}
        {isPlaceTradeModalOpen && alpacaKeys && (
            <PlaceTradeModal 
                onClose={() => setIsPlaceTradeModalOpen(false)}
                onPlaceOrder={handlePlaceOrder}
                keys={alpacaKeys}
                initialSymbol={tradeModalSymbol}
            />
        )}
        {isAiTraderModalOpen && alpacaData?.account && (
            <AiTraderModal
                onClose={() => setIsAiTraderModalOpen(false)}
                onActivate={handleActivateAiStrategy}
                cashBalance={parseFloat(alpacaData.account.cash)}
            />
        )}
        <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
        {isReceiptScannerModalOpen && (
            <ReceiptScannerModal
                onClose={() => setIsReceiptScannerModalOpen(false)}
                onLogPurchase={handleLogPurchaseFromReceipt}
                accounts={accounts}
                categories={allCategories}
            />
        )}
        {viewingReceipt && (
            <ReceiptViewerModal
                image={viewingReceipt}
                onClose={() => setViewingReceipt(null)}
            />
        )}
      </div>
    );
};

export default BudgetDashboard;
