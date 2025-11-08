import React from 'react';

export interface CategoryTransaction {
    id: string;
    description: string;
    amount: number;
    date: string;
}

export interface BudgetCategory {
  id:string;
  name: string;
  spent: number;
  goal: number;
  Icon: React.FC<{ className?: string }>;
  color: string;
  pacing: 'good' | 'warning' | 'danger';
  transactions: CategoryTransaction[];
  isShortcut: boolean;
  mainCategory: 'Needs' | 'Wants' | 'Financial Goals' | 'Miscellaneous';
}

export interface PossibleCategory {
    name: string;
    mainCategory: 'Needs' | 'Wants' | 'Financial Goals' | 'Miscellaneous';
    Icon: React.FC<{ className?: string }>;
    color: string;
    iconName: string;
}

export interface Device {
  name: string;
  Icon: React.FC<{ className?: string }>;
}

export interface SpendingData {
  day: number;
  amount: number;
  category: string;
}

export interface Bill {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    iconName: string;
    recurring?: boolean;
    // Fix: Add optional paidByMemberId for shared bills tracking
    paidByMemberId?: string;
}

export interface UncategorizedTransaction {
    id: string;
    description: string;
    amount: number;
    suggestedCategory: string;
}

export interface ParsedTransaction {
    description: string;
    amount: number;
    category: string;
}

export interface LinkedCard {
  id: string;
  last4: string;
  cardType: 'visa' | 'mastercard' | 'unknown';
  balance: number;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'allocation';
  amount: number;
  date: string;
  description?: string;
  category?: string; // Allow any string for dynamic categories
  cardId?: string;
  source?: string; // For allocation history
  receiptImage?: string; // Base64 encoded image
}

export interface LinkedSource {
    cardId: string;
    priority: 'Primary' | 'Secondary' | 'Tertiary';
}

export interface WalletAccount {
    id: string;
    name: string;
    balance: number;
    iconName: keyof typeof import('./components/icons').IconMap;
    color: string;
    imageUrl?: string;
    history: WalletTransaction[];
    linkedSources?: LinkedSource[];
}

export type TriggerType = 'on_deposit' | 'minutes' | 'hours' | 'daily' | 'weekly' | 'monthly' | 'yearly';
export type DepositFrequency = 'daily' | 'weekly' | 'bi-weekly' | 'monthly';

export interface IncomeSource {
    id: string;
    name: string;
    accountId: string; // ID of the WalletAccount
    triggerType: TriggerType;
    triggerValue: number; // e.g., 30 for minutes, 12 for hours. Can be 0 for others.
    delayDays: number; // Delay in days before executing automation
    deletable?: boolean;
    sweepUnallocated: boolean;
    sweepAccountId?: string;
    isLinked: boolean;
    depositKeyword?: string;
    depositAmount?: number;
    expectedAmount?: number;
    depositFrequency?: DepositFrequency;
    nextDepositDate?: string;
    blockingRules?: {
        sourceGoalId: string;
        condition: 'must_be_complete';
    }[];
}

export type GoalType = 'Short-Term' | 'Long-Term' | 'Investment';
export type CompletionAction = 'stop' | 'chain' | 'reduce';

export interface Milestone {
    percentage: number;
    description: string;
}

export interface GoalMetric {
    type: 'shares' | 'crypto';
    ticker: string;
    targetUnits: number;
    currentPrice?: number;
}

export interface AutomationRule {
    id: string;
    name: string;
    destinationAccountId: string;
    percentage: number; 
    goal?: number;
    isPermanent?: boolean;
    sourceTriggers: string[]; // IDs of rules, sources, or milestones that feed this one
    status: 'active' | 'inactive' | 'complete';
    goalType: GoalType;
    completionAction: CompletionAction;
    reduceToPercentage?: number;
    lastTransferFailed: boolean;
    milestones?: Milestone[];
    allocationType?: 'percentage' | 'buy_next_unit';
    goalMetric?: GoalMetric;
    trackingMode?: 'account_balance' | 'goal_specific';
    currentAmount?: number; // Only used for 'goal_specific' tracking
    // New properties for advanced templates
    increasePercentageOverTimeConfig?: {
        increaseBy: number; // e.g., 1 for 1%
        everyMonths: number; // e.g., 6 for every 6 months
        lastIncreaseDate?: string; // ISO date string
    };
    blockingRules?: {
        sourceGoalId: string;
        condition: 'must_be_complete';
    }[];
    startDate?: string;
    dueDate?: string;
}

export interface AutomationMilestone {
    id: string;
    name: string;
    advice?: string;
    sourceGoalId: string; // ID of the AutomationRule it's watching
    triggerPercentage: number;
    startDate?: string;
    dueDate?: string;
}

export interface AutoInvestRule {
    id: string;
    name: string;
    sourceGoalId: string;
    triggerType: 'on_amount_reached' | 'on_every_increase';
    triggerAmount: number;
    tradeAction: {
        symbol: string;
        amount: number; // in dollars
    };
    lastTriggeredValue: number; // Tracks the last balance value that triggered the rule
}


export interface AutomationBoard {
    id: string;
    name: string;
    status: 'active' | 'inactive';
    type: 'individual';
    incomeSources: IncomeSource[];
    automationRules: AutomationRule[];
    automationMilestones: AutomationMilestone[];
    automationActions: AutomationAction[];
    autoInvestRules: AutoInvestRule[];
}


// --- Full System Template Types ---

export interface TemplateParameter {
    id: string; // e.g., 'EMERGENCY_FUND_GOAL'
    displayName: string;
    type: 'accountSelector' | 'amountInput' | 'percentageInput';
    defaultValue?: string | number;
    prompt: string; // e.g., "What is your desired Emergency Fund amount?"
}

export interface TemplateNode {
    id: string; // A template-local ID, e.g., 'node-1'
    type: 'source' | 'goal' | 'milestone' | 'action'; // Simplified type
    // Fix: The intersection of types was incorrect, preventing properties like 'strategy' from being used. Changed to a union of partial types.
    data: Omit<(Partial<IncomeSource> & Partial<AutomationRule> & Partial<AutomationMilestone> & Partial<AutomationAction>), 'goal' | 'percentage' | 'sourceTriggers'> & {
      // Use placeholders for values that the user needs to set
      name: string; // Can contain placeholders like "Pay Off: {{DEBT_1_NAME}}"
      goal?: string | number; // e.g., "{{EMERGENCY_FUND_GOAL}}"
      destinationAccountId?: string; // e.g., "{{STOCK_ACCOUNT_ID}}"
      percentage?: string | number;
      sourceTrigger?: string; // Links to another template-local node ID (used for single-source chaining in templates)
    };
    position: { x: number; y: number };
}

export interface TemplateEdge {
    id: string;
    source: string; // Template-local node ID
    target: string; // Template-local node ID
}

export type TemplateCategory = "🚀 Launch Your Startup" | "💰 Debt-Crushing Strategy" | "🌴 Ultimate Travel Saver" | "📈 Wealth Building" | "🏠 Home Ownership" | "🔧 Financial Foundation" | "💸 Spending & Habits" | "Personal";

export interface AutomationTemplate {
    id: string;
    name: string;
    description: string;
    category: TemplateCategory;
    iconName: keyof typeof import('./components/icons').IconMap;
    parameters: TemplateParameter[];
    nodes: TemplateNode[];
    edges: TemplateEdge[];
    categoriesToCreate: (Omit<BudgetCategory, 'id' | 'spent' | 'pacing' | 'transactions' | 'isShortcut' | 'Icon'> & { iconName: keyof typeof import('./components/icons').IconMap; goal: string | number })[];
    // Fix: Allow string placeholders for amounts in auto-invest rules within a template.
    autoInvestRules?: (Omit<AutoInvestRule, 'id' | 'lastTriggeredValue' | 'triggerAmount' | 'tradeAction'> & {
        sourceGoalId: string;
        triggerAmount: string | number;
        tradeAction: {
            symbol: string;
            amount: string | number;
        };
    })[];
}

export interface CustomCalendarEvent {
    id: string;
    title: string;
    date: string;
    startTime?: string; // HH:mm
    endTime?: string; // HH:mm
    description?: string;
    color: string;
}

export interface TradeEvent {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  qty: number;
  price: number;
  date: string; // ISO string with time
  isAiTrade: boolean;
}

export interface CalendarEvent {
  id: string;
  date: Date;
  title: string;
  type: 'goal' | 'milestone' | 'bill' | 'income' | 'custom' | 'transaction' | 'stock_buy' | 'stock_sell';
  data: AutomationRule | (AutomationMilestone & { sourceGoalName?: string }) | Bill | IncomeSource | CustomCalendarEvent | WalletTransaction | TradeEvent;
  startTime?: string;
  endTime?: string;
  color?: string;
}

// --- New Chart Types ---
export interface ChartTransaction {
    id: string;
    description: string;
    amount: number;
    category: string;
    iconName: keyof typeof import('./components/icons').TransactionIconMap;
}

export interface DailySpendingData {
  date: string; // "YYYY-MM-DD"
  total: number;
  transactions: ChartTransaction[];
}

// --- New Dashboard Tracker Types ---
export type TrackerType = 'spending' | 'income' | 'savings' | 'credit-score';

export interface DashboardTracker {
    id: string;
    type: TrackerType;
    title: string;
    target: number;
    sourceAccountId?: string; // For savings goals
}

// --- Credit Report Types (based on iSoftpull docs) ---
export interface CreditScoreInfo {
    score: number;
    reason_codes: string[];
}

export interface CreditScores {
    equifax?: CreditScoreInfo;
    transunion?: CreditScoreInfo;
    experian?: CreditScoreInfo;
}

export interface TradeAccount {
    company: string;
    account_status: string;
    account_type: string;
    portfolio_type: string;
    balance: string;
    high_credit: string;
    credit_limit?: string;
    months_reviewed: string;
    payment_history: string;
}

export interface Inquiry {
    company: string;
    date: string;
    industry: string;
}

export interface Collection {
    subscriber: string;
    original_loan_amount: string;
    balance: string;
    date_reported: string;
}

export interface PublicRecord {
    type: string;
    status: string;
    date_filed: string;
}

export interface CreditReport {
    credit_score: CreditScores;
    trade_accounts: TradeAccount[];
    inquiries: Inquiry[];
    collections: Collection[];
    public_record: PublicRecord[];
}

// --- Alpaca API Types ---
export interface AlpacaAccount {
    id: string;
    portfolio_value: string;
    cash: string;
    buying_power: string;
    daytrade_count: number;
    equity: string;
    last_equity: string;
}

export interface AlpacaPosition {
    asset_id: string;
    symbol: string;
    qty: string;
    market_value: string;
    current_price: string;
    unrealized_pl: string;
    unrealized_plpc: string; // an-day profit/loss percent (e.g. 0.0085)
}

export interface AlpacaPortfolioHistoryPoint {
    timestamp: number;
    equity: number;
    profit_loss: number;
    profit_loss_pct: number;
}

export interface AlpacaPortfolioHistory {
    timestamp: number[];
    equity: (number | null)[];
    profit_loss: (number | null)[];
    profit_loss_pct: (number | null)[];
    base_value: number;
    timeframe: string;
}

export interface AlpacaOrder {
    id: string;
    symbol: string;
    qty: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit