import type { AutomationTemplate } from '../types';

export const allTemplates: AutomationTemplate[] = [
    {
        id: 'template-freedom-flow',
        name: 'The Financial Freedom Flow',
        description: 'Based on the "6-Jar Budget", this system automatically divides your income into buckets for necessities, long-term savings, investments, fun, education, and giving.',
        category: '📈 Wealth Building',
        iconName: 'FreedomIcon',
        parameters: [
            { id: 'PAYCHECK_SOURCE', displayName: 'Primary Paycheck Source', type: 'accountSelector', prompt: 'Select the account where your primary paycheck is deposited.' },
            { id: 'STOCKS_ACCOUNT', displayName: 'Financial Freedom Account', type: 'accountSelector', prompt: 'Select your primary investment/stocks account.' },
            { id: 'EDUCATION_ACCOUNT', displayName: 'Education Account', type: 'accountSelector', prompt: 'Select an account for education and self-improvement.' },
            { id: 'NECESSITIES_ACCOUNT', displayName: 'Necessities/Checking Account', type: 'accountSelector', prompt: 'Select your main checking or spending account.' },
            { id: 'PLAY_ACCOUNT', displayName: 'Play/Fun Money Account', type: 'accountSelector', prompt: 'Select an account for fun money and guilt-free spending.' },
            { id: 'LTS_ACCOUNT', displayName: 'Long-Term Savings Account', type: 'accountSelector', prompt: 'Select your account for long-term savings goals (e.g., house, car).' },
            { id: 'GIVE_ACCOUNT', displayName: 'Give/Charity Account', type: 'accountSelector', prompt: 'Select an account for charitable giving.' },
        ],
        nodes: [
            // Source
            { id: 'source-1', type: 'source', data: { name: 'Primary Paycheck', destinationAccountId: '{{PAYCHECK_SOURCE}}' }, position: { x: 600, y: 50 } },
            // Goals
            { id: 'goal-1', type: 'goal', data: { name: 'Financial Freedom', percentage: 10, goal: 1000000, destinationAccountId: '{{STOCKS_ACCOUNT}}', sourceTrigger: 'source-1', goalType: 'Investment' }, position: { x: 0, y: 250 } },
            { id: 'goal-2', type: 'goal', data: { name: 'Long-Term Savings', percentage: 10, goal: 50000, destinationAccountId: '{{LTS_ACCOUNT}}', sourceTrigger: 'source-1', goalType: 'Long-Term' }, position: { x: 300, y: 250 } },
            { id: 'goal-3', type: 'goal', data: { name: 'Education', percentage: 10, goal: 5000, destinationAccountId: '{{EDUCATION_ACCOUNT}}', sourceTrigger: 'source-1', goalType: 'Long-Term' }, position: { x: 600, y: 250 } },
            { id: 'goal-4', type: 'goal', data: { name: 'Necessities', percentage: 50, goal: 3000, destinationAccountId: '{{NECESSITIES_ACCOUNT}}', sourceTrigger: 'source-1', goalType: 'Short-Term' }, position: { x: 900, y: 250 } },
            { id: 'goal-5', type: 'goal', data: { name: 'Play', percentage: 10, goal: 500, destinationAccountId: '{{PLAY_ACCOUNT}}', sourceTrigger: 'source-1', goalType: 'Short-Term' }, position: { x: 1200, y: 250 } },
            { id: 'goal-6', type: 'goal', data: { name: 'Give', percentage: 10, goal: 500, destinationAccountId: '{{GIVE_ACCOUNT}}', sourceTrigger: 'source-1', goalType: 'Short-Term' }, position: { x: 1500, y: 250 } },
            // Milestones for Goal 1 (Financial Freedom)
            { id: 'm-ff-1', type: 'milestone', data: { name: 'Reach $10k', sourceGoalId: 'goal-1', triggerPercentage: 1, advice: 'Reaching your first $10k is a major psychological win. At this point, ensure your portfolio is diversified.' }, position: { x: -75, y: 450 } },
            { id: 'm-ff-2', type: 'milestone', data: { name: 'Reach $100k', sourceGoalId: 'goal-1', triggerPercentage: 10, advice: 'The power of compounding is now significant. Review your asset allocation and consider consulting a financial advisor.' }, position: { x: 75, y: 450 } },
            { id: 'm-ff-3', type: 'milestone', data: { name: 'Reach $250k', sourceGoalId: 'goal-1', triggerPercentage: 25, advice: 'You are well on your way. Consider strategies to optimize for taxes and explore more advanced investment vehicles.' }, position: { x: 0, y: 550 } },
        ],
        edges: [
            { id: 'e1', source: 'source-1', target: 'goal-1' }, { id: 'e2', source: 'source-1', target: 'goal-2' }, { id: 'e3', source: 'source-1', target: 'goal-3' }, { id: 'e4', source: 'source-1', target: 'goal-4' }, { id: 'e5', source: 'source-1', target: 'goal-5' }, { id: 'e6', source: 'source-1', target: 'goal-6' },
            { id: 'em-ff1', source: 'goal-1', target: 'm-ff-1' }, { id: 'em-ff2', source: 'goal-1', target: 'm-ff-2' }, { id: 'em-ff3', source: 'goal-1', target: 'm-ff-3' },
        ],
        categoriesToCreate: [],
    },
    {
        id: 'template-consistent-investor',
        name: 'The Consistent Investor (DCA)',
        description: 'A classic Dollar-Cost Averaging strategy. Automatically saves a portion of your income, then uses that growing balance to automatically buy a stock or ETF.',
        category: '📈 Wealth Building',
        iconName: 'TrendingUpIcon',
        parameters: [
            { id: 'PAYCHECK_SOURCE', type: 'accountSelector', displayName: 'Income Source', prompt: 'Select the account where your income is deposited.'},
            { id: 'INVESTMENT_SAVINGS_ACCOUNT', type: 'accountSelector', displayName: 'Investment Savings Account', prompt: 'Select the savings account you want to build up for investing.'},
            { id: 'INVESTMENT_PERCENTAGE', type: 'percentageInput', displayName: 'Investment Savings Rate', prompt: 'What percentage of your income do you want to save for investing?', defaultValue: 20 },
            { id: 'DCA_SYMBOL', type: 'amountInput', displayName: 'Stock/ETF Symbol', prompt: 'What stock or ETF do you want to buy (e.g., VOO, AAPL)?', defaultValue: 'VOO' },
            { id: 'DCA_INTERVAL', type: 'amountInput', displayName: 'Investment Interval', prompt: 'Invest every time your savings increase by this amount:', defaultValue: 100 },
            { id: 'DCA_AMOUNT', type: 'amountInput', displayName: 'Investment Amount', prompt: 'How much ($) do you want to invest each time?', defaultValue: 100 },
        ],
        nodes: [
            { id: 'source-1', type: 'source', data: { name: 'Paycheck', destinationAccountId: '{{PAYCHECK_SOURCE}}' }, position: { x: 250, y: 50 } },
            { id: 'goal-1', type: 'goal', data: { name: 'DCA Savings Fund', percentage: '{{INVESTMENT_PERCENTAGE}}', isPermanent: true, destinationAccountId: '{{INVESTMENT_SAVINGS_ACCOUNT}}', sourceTrigger: 'source-1' }, position: { x: 250, y: 250 } },
        ],
        edges: [
            { id: 'e-s1-g1', source: 'source-1', target: 'goal-1' },
        ],
        categoriesToCreate: [],
        autoInvestRules: [
            {
                name: 'Auto-DCA',
                sourceGoalId: 'goal-1',
                triggerType: 'on_every_increase',
// Fix: Use string placeholders for amounts to match the updated AutomationTemplate type.
                triggerAmount: '{{DCA_INTERVAL}}',
                tradeAction: {
                    symbol: '{{DCA_SYMBOL}}',
// Fix: Use string placeholders for amounts to match the updated AutomationTemplate type.
                    amount: '{{DCA_AMOUNT}}',
                }
            }
        ]
    },
    {
        id: 'template-safety-net-investor',
        name: 'The Safety Net Investor',
        description: '"Pay Yourself First" by prioritizing your emergency fund. Once it\'s full, this system automatically starts investing for you.',
        category: '🔧 Financial Foundation',
        iconName: 'ShieldCheckIcon',
        parameters: [
            { id: 'PAYCHECK_SOURCE', type: 'accountSelector', displayName: 'Income Source', prompt: 'Select your primary income source.' },
            { id: 'EMERGENCY_FUND_ACCOUNT', type: 'accountSelector', displayName: 'Emergency Fund Account', prompt: 'Select your high-yield savings account for emergencies.' },
            { id: 'EMERGENCY_FUND_GOAL', type: 'amountInput', displayName: 'Emergency Fund Goal', prompt: 'What is your total emergency fund goal (3-6 months of expenses)?', defaultValue: 15000 },
            { id: 'SAVINGS_PERCENTAGE', type: 'percentageInput', displayName: 'Aggressive Savings Rate', prompt: 'What percentage of your income should go towards this plan?', defaultValue: 25 },
            { id: 'BROKERAGE_ACCOUNT', type: 'accountSelector', displayName: 'Brokerage Account', prompt: 'Select your investment account for after your EF is funded.' },
            { id: 'INVESTMENT_SYMBOL', type: 'amountInput', displayName: 'ETF/Stock to Buy', prompt: 'What do you want to invest in (e.g., VTI)?', defaultValue: 'VTI' },
        ],
        nodes: [
            { id: 'source-1', type: 'source', data: { name: 'Paycheck', destinationAccountId: '{{PAYCHECK_SOURCE}}' }, position: { x: 250, y: 50 } },
            { id: 'goal-1', type: 'goal', data: { name: 'Build Emergency Fund', percentage: '{{SAVINGS_PERCENTAGE}}', goal: '{{EMERGENCY_FUND_GOAL}}', destinationAccountId: '{{EMERGENCY_FUND_ACCOUNT}}', sourceTrigger: 'source-1', completionAction: 'chain' }, position: { x: 250, y: 250 } },
            { id: 'goal-2', type: 'goal', data: { name: 'Start Investing', percentage: '{{SAVINGS_PERCENTAGE}}', isPermanent: true, destinationAccountId: '{{BROKERAGE_ACCOUNT}}', sourceTrigger: 'goal-1', goalType: 'Investment' }, position: { x: 250, y: 500 } },
        ],
        edges: [
            { id: 'e-s1-g1', source: 'source-1', target: 'goal-1' },
            { id: 'e-g1-g2', source: 'goal-1', target: 'goal-2' },
        ],
        categoriesToCreate: [],
        autoInvestRules: [
            {
                name: 'Auto-Invest Post-EF',
                sourceGoalId: 'goal-2',
                triggerType: 'on_every_increase',
                triggerAmount: 250,
                tradeAction: {
                    symbol: '{{INVESTMENT_SYMBOL}}',
                    amount: 250,
                }
            }
        ]
    },
    {
        id: 'template-ai-copilot',
        name: 'The AI Co-Pilot',
        description: 'The ultimate "set it and forget it" plan. Automatically deposits funds into your brokerage and immediately activates your pre-configured AI Trader to manage it.',
        category: '📈 Wealth Building',
        iconName: 'BotIcon',
        parameters: [
            { id: 'PAYCHECK_SOURCE', type: 'accountSelector', displayName: 'Income Source', prompt: 'Select your income source.' },
            { id: 'INVESTMENT_PERCENTAGE', type: 'percentageInput', displayName: 'Investment Allocation', prompt: 'What percentage of income should be invested?', defaultValue: 15 },
        ],
        nodes: [
            { id: 'source-1', type: 'source', data: { name: 'Paycheck', destinationAccountId: '{{PAYCHECK_SOURCE}}' }, position: { x: 250, y: 50 } },
            { id: 'action-1', type: 'action', data: { name: 'Deposit to Brokerage', type: 'deposit_to_brokerage', percentage: '{{INVESTMENT_PERCENTAGE}}' }, position: { x: 100, y: 250 } },
            { id: 'action-2', type: 'action', data: { name: 'Activate AI Trader', type: 'activate_ai_trader', strategy: { strategyType: 'Long-Term Investing', riskTolerance: 60, investmentAmount: 0, takeProfitPercentage: 25, stopLossPercentage: 15 } }, position: { x: 400, y: 250 } },
        ],
        edges: [
            { id: 'e-s1-a1', source: 'source-1', target: 'action-1' },
            { id: 'e-a1-a2', source: 'action-1', target: 'action-2' },
        ],
        categoriesToCreate: [],
    }
];