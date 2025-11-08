import React, { useState, useEffect } from 'react';
import type { AutomationRule, WalletAccount, IncomeSource, Milestone, AutomationMilestone, AutomationAction, AiTraderStrategy, AutoInvestRule } from '../types';
import { XIcon, PlusCircleIcon, TrashIcon } from './icons';

interface AutomationEditorPanelProps {
  selectedNodeId: string | null;
  incomeSources: IncomeSource[];
  rules: AutomationRule[];
  automationMilestones: AutomationMilestone[];
  automationActions: AutomationAction[];
  autoInvestRules: AutoInvestRule[];
  onSaveRule: (rule: AutomationRule) => void;
  onSaveAutomationAction: (action: AutomationAction) => void;
  onSaveAutoInvestRule: (rule: AutoInvestRule) => void;
  onEditSource: (source: IncomeSource) => void;
  onClose: () => void;
  onAddChainedGoal: (sourceId: string) => void;
  onDeleteRule: (ruleId: string) => void;
  onDeleteAutomationAction: (actionId: string) => void;
  onDeleteAutoInvestRule: (ruleId: string) => void;
  onSaveMilestone: (milestone: AutomationMilestone) => void;
  onDeleteMilestone: (milestoneId: string) => void;
  accounts: WalletAccount[];
}

const SourceEditor: React.FC<{
    source: IncomeSource;
    rules: AutomationRule[];
    accounts: WalletAccount[];
    onEdit: (source: IncomeSource) => void;
    onAddChainedGoal: (sourceId: string) => void;
}> = ({ source, rules, accounts, onEdit, onAddChainedGoal }) => {
    
    const totalAllocated = rules
      .filter(r => r.sourceTriggers.includes(source.id))
      .reduce((sum, r) => sum + r.percentage, 0);

    const unallocated = 100 - totalAllocated;
    const sweepAccountName = accounts.find(a => a.id === source.sweepAccountId)?.name;

    return (
        <div className="space-y-4">
            <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold text-lg mb-2 flex justify-between items-center">
                    <span>{source.name}</span>
                     <button onClick={() => onEdit(source)} className="text-sm text-purple-600 font-semibold hover:underline">
                        Edit
                    </button>
                </h3>
                <p className="text-sm text-gray-600">Primary income source</p>
            </div>
            
            <div>
                <label className="font-semibold text-gray-700">Allocation Summary</label>
                <div className="w-full bg-gray-200 rounded-full h-4 mt-2 overflow-hidden flex">
                    <div className="h-4 bg-purple-600" style={{ width: `${totalAllocated > 100 ? 100 : totalAllocated}%` }}></div>
                    <div className="h-4 bg-green-400" style={{ width: `${unallocated > 0 ? unallocated : 0}%` }}></div>
                </div>
                <div className="flex justify-between text-sm mt-1 font-semibold">
                    <span className="text-purple-600">{totalAllocated}% Allocated</span>
                    {unallocated >= 0 && <span className="text-green-600">{unallocated}% Unallocated</span>}
                </div>
                {totalAllocated > 100 && <p className="text-sm mt-1 font-semibold text-red-500">Warning: You've allocated more than 100%!</p>}
            </div>

            {source.sweepUnallocated && sweepAccountName && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-semibold text-green-800">Any unallocated funds will be automatically swept to your '{sweepAccountName}' account.</p>
                </div>
            )}
            
            <button onClick={() => onAddChainedGoal(source.id)} className="w-full flex items-center justify-center space-x-2 text-purple-600 font-bold py-3 px-5 rounded-xl hover:bg-purple-50 transition-colors border-2 border-dashed border-gray-300">
                <PlusCircleIcon className="w-6 h-6" />
                <span>Add Goal to Source</span>
            </button>
        </div>
    );
};


const MilestoneEditor: React.FC<{
    milestone: AutomationMilestone;
    rules: AutomationRule[];
    onSave: (milestone: AutomationMilestone) => void;
    onDelete: (milestoneId: string) => void;
}> = ({ milestone, rules, onSave, onDelete }) => {
    const [name, setName] = useState(milestone.name);
    const [advice, setAdvice] = useState(milestone.advice || '');
    const [sourceGoalId, setSourceGoalId] = useState(milestone.sourceGoalId);
    const [triggerPercentage, setTriggerPercentage] = useState(milestone.triggerPercentage);

    useEffect(() => {
        setName(milestone.name);
        setAdvice(milestone.advice || '');
        setSourceGoalId(milestone.sourceGoalId);
        setTriggerPercentage(milestone.triggerPercentage);
    }, [milestone]);

    const handleSave = () => {
        onSave({ ...milestone, name, advice, sourceGoalId, triggerPercentage });
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="font-semibold text-gray-700">Milestone Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
                <label className="font-semibold text-gray-700">AI Advice</label>
                <textarea 
                    value={advice} 
                    onChange={e => setAdvice(e.target.value)} 
                    rows={3}
                    placeholder="Optional: Add advice or context for this milestone."
                    className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" 
                />
            </div>
            <div>
                <label className="font-semibold text-gray-700">Source Goal</label>
                <p className="text-xs text-gray-500">This milestone will trigger when the selected goal reaches a certain percentage.</p>
                <select value={sourceGoalId} onChange={e => setSourceGoalId(e.target.value)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
                    <option value="">Select a Goal</option>
                    {rules.map(rule => (
                        <option key={rule.id} value={rule.id}>{rule.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="font-semibold text-gray-700 flex justify-between">
                    <span>Trigger Percentage</span>
                    <span className="font-bold text-blue-600">{triggerPercentage}%</span>
                </label>
                <input 
                    type="range" min="0" max="100" value={triggerPercentage} onChange={e => setTriggerPercentage(Number(e.target.value))}
                    className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-blue-600"
                />
            </div>
            <div className="flex space-x-2 pt-2">
                <button onClick={() => onDelete(milestone.id)} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
                    <TrashIcon className="w-5 h-5"/>
                    <span>Delete</span>
                </button>
                <button onClick={handleSave} className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

const ActionEditor: React.FC<{
    action: AutomationAction;
    onSave: (action: AutomationAction) => void;
    onDelete: (actionId: string) => void;
}> = ({ action, onSave, onDelete }) => {
    const [currentAction, setCurrentAction] = useState(action);

    useEffect(() => {
        setCurrentAction(action);
    }, [action]);

    const handleSave = () => {
        onSave(currentAction);
    };

    const riskLabel = 'strategy' in currentAction ? (currentAction.strategy.riskTolerance < 33 ? 'Conservative' : currentAction.strategy.riskTolerance < 66 ? 'Moderate' : 'Aggressive') : '';

    return (
        <div className="space-y-6">
            <input 
                type="text" 
                value={currentAction.name} 
                onChange={e => setCurrentAction(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border-b-2 text-lg font-bold border-gray-200 focus:outline-none focus:border-green-500"
            />
            {currentAction.type === 'deposit_to_brokerage' && (
                <div>
                    <label className="font-semibold text-gray-700 flex justify-between">
                        <span>Deposit Percentage</span>
                        <span className="font-bold text-green-600">{currentAction.percentage}%</span>
                    </label>
                    <input 
                        type="range" min="0" max="100" 
                        value={currentAction.percentage}
                        onChange={e => setCurrentAction(prev => ({ ...prev, type: 'deposit_to_brokerage', percentage: Number(e.target.value) }))}
                        className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-green-600"
                    />
                </div>
            )}
            {currentAction.type === 'activate_ai_trader' && (
                <div className="space-y-4">
                     <div>
                        <label className="font-semibold text-gray-700">Trading Strategy</label>
                        <select 
                            value={currentAction.strategy.strategyType} 
                            onChange={e => setCurrentAction(prev => ({...prev, type: 'activate_ai_trader', strategy: {...prev.strategy, strategyType: e.target.value as any, customPrompt: e.target.value === 'Custom Prompt' ? (prev.strategy.customPrompt || '') : undefined}}))} 
                            className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg bg-white"
                        >
                            <option>Day Trading</option>
                            <option>Swing Trading</option>
                            <option>Long-Term Investing</option>
                            <option>Custom Prompt</option>
                        </select>
                    </div>

                    <div>
                        <label className="font-semibold text-gray-700">Investment Amount</label>
                        <input type="number"
                            value={currentAction.strategy.investmentAmount}
                            onChange={e => setCurrentAction(prev => ({...prev, type: 'activate_ai_trader', strategy: {...prev.strategy, investmentAmount: Number(e.target.value)}}))}
                            placeholder="Amount to invest"
                            className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg"/>
                    </div>

                    {currentAction.strategy.strategyType === 'Custom Prompt' ? (
                        <div>
                            <label className="font-semibold text-gray-700">Custom AI Prompt</label>
                            <textarea
                                value={currentAction.strategy.customPrompt || ''}
                                onChange={e => setCurrentAction(prev => ({...prev, type: 'activate_ai_trader', strategy: {...prev.strategy, customPrompt: e.target.value}}))}
                                rows={5}
                                placeholder="e.g., Invest in tech ETFs like QQQ and VGT. Sell if they drop 5% in a week. Take profits at 15%."
                                className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                            />
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="font-semibold text-gray-700 flex justify-between">
                                    <span>Risk Tolerance</span>
                                    <span className="font-bold text-green-600">{riskLabel}</span>
                                </label>
                                <input type="range" min="0" max="100" 
                                    value={currentAction.strategy.riskTolerance}
                                    onChange={e => setCurrentAction(prev => ({...prev, type: 'activate_ai_trader', strategy: {...prev.strategy, riskTolerance: Number(e.target.value)}}))} 
                                    className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-green-600"/>
                            </div>
                            <div className="flex space-x-2">
                                <div className="flex-1">
                                    <label className="font-semibold text-gray-700">Take Profit (%)</label>
                                    <input type="number" 
                                        value={currentAction.strategy.takeProfitPercentage}
                                        onChange={e => setCurrentAction(prev => ({...prev, type: 'activate_ai_trader', strategy: {...prev.strategy, takeProfitPercentage: Number(e.target.value)}}))} 
                                        className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg"/>
                                </div>
                                <div className="flex-1">
                                    <label className="font-semibold text-gray-700">Stop Loss (%)</label>
                                    <input type="number" 
                                        value={currentAction.strategy.stopLossPercentage}
                                        onChange={e => setCurrentAction(prev => ({...prev, type: 'activate_ai_trader', strategy: {...prev.strategy, stopLossPercentage: Number(e.target.value)}}))} 
                                        className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg"/>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="flex space-x-2 pt-2">
                <button onClick={() => onDelete(action.id)} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
                    <TrashIcon className="w-5 h-5"/>
                    <span>Delete</span>
                </button>
                <button onClick={handleSave} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

const AutoInvestEditor: React.FC<{
    rule: AutoInvestRule;
    allGoals: AutomationRule[];
    onSave: (rule: AutoInvestRule) => void;
    onDelete: (ruleId: string) => void;
}> = ({ rule, allGoals, onSave, onDelete }) => {
    const [currentRule, setCurrentRule] = useState(rule);

    useEffect(() => {
        setCurrentRule(rule);
    }, [rule]);

    const handleSave = () => {
        onSave(currentRule);
    };

    return (
        <div className="space-y-6">
            <input 
                type="text" 
                value={currentRule.name} 
                onChange={e => setCurrentRule(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border-b-2 text-lg font-bold border-gray-200 focus:outline-none focus:border-cyan-500"
            />
            <div>
                <label className="font-semibold text-gray-700">Source Goal</label>
                <p className="text-xs text-gray-500">This rule will watch the balance of the selected goal.</p>
                <select 
                    value={currentRule.sourceGoalId} 
                    onChange={e => setCurrentRule(prev => ({ ...prev, sourceGoalId: e.target.value }))} 
                    className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg bg-white"
                >
                    <option value="">Select a Goal</option>
                    {allGoals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
            </div>
            <div>
                <label className="font-semibold text-gray-700">Trigger Condition</label>
                <select 
                    value={currentRule.triggerType} 
                    onChange={e => setCurrentRule(prev => ({ ...prev, triggerType: e.target.value as any }))} 
                    className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg bg-white"
                >
                    <option value="on_every_increase">On Every Increase Of</option>
                    <option value="on_amount_reached">When Balance Reaches</option>
                </select>
            </div>
            <div>
                <label className="font-semibold text-gray-700">Trigger Amount</label>
                <input 
                    type="number" 
                    value={currentRule.triggerAmount} 
                    onChange={e => setCurrentRule(prev => ({ ...prev, triggerAmount: Number(e.target.value) }))} 
                    className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg"
                />
            </div>
            <div className="pt-4 border-t">
                <h3 className="font-bold text-gray-800">Trade Action</h3>
                <div className="flex space-x-2">
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-gray-600">Stock Symbol</label>
                        <input 
                            type="text" 
                            value={currentRule.tradeAction.symbol} 
                            onChange={e => setCurrentRule(prev => ({ ...prev, tradeAction: { ...prev.tradeAction, symbol: e.target.value.toUpperCase() }}))}
                            placeholder="e.g., AAPL"
                            className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-sm font-semibold text-gray-600">Amount to Buy ($)</label>
                        <input 
                            type="number" 
                            value={currentRule.tradeAction.amount} 
                            onChange={e => setCurrentRule(prev => ({ ...prev, tradeAction: { ...prev.tradeAction, amount: Number(e.target.value) }}))}
                            className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg"
                        />
                    </div>
                </div>
            </div>
            <div className="flex space-x-2 pt-2">
                <button onClick={() => onDelete(rule.id)} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 flex items-center justify-center space-x-2">
                    <TrashIcon className="w-5 h-5"/>
                    <span>Delete</span>
                </button>
                <button onClick={handleSave} className="flex-1 bg-cyan-600 text-white font-bold py-3 rounded-xl hover:bg-cyan-700">
                    Save Changes
                </button>
            </div>
        </div>
    );
};


const AutomationEditorPanel: React.FC<AutomationEditorPanelProps> = ({ 
    selectedNodeId, incomeSources, rules, automationMilestones, automationActions, autoInvestRules, 
    onSaveRule, onSaveAutomationAction, onSaveAutoInvestRule, onEditSource, onClose, 
    onAddChainedGoal, onDeleteRule, onDeleteAutomationAction, onDeleteAutoInvestRule,
    onSaveMilestone, onDeleteMilestone, accounts
}) => {
  
  const selectedRule = rules.find(r => r.id === selectedNodeId);
  const selectedSource = incomeSources.find(s => s.id === selectedNodeId);
  const selectedMilestone = automationMilestones.find(m => m.id === selectedNodeId);
  const selectedAction = automationActions.find(a => a.id === selectedNodeId);
  const selectedAutoInvest = autoInvestRules.find(r => r.id === selectedNodeId);

  // General state
  const [name, setName] = useState('');
  const [goal, setGoal] = useState(0);
  const [destinationAccountId, setDestinationAccountId] = useState('');
  const [isPermanent, setIsPermanent] = useState(false);
  
  // Allocation state
  const [allocationType, setAllocationType] = useState<'percentage' | 'buy_next_unit'>('percentage');
  const [percentage, setPercentage] = useState(0);

  // Metric Goal state
  const [isMetricGoal, setIsMetricGoal] = useState(false);
  const [metricType, setMetricType] = useState<'shares' | 'crypto'>('shares');
  const [ticker, setTicker] = useState('');
  const [targetUnits, setTargetUnits] = useState(100);
  const [mockPrice, setMockPrice] = useState(0);

  // Milestones state
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestonePercent, setNewMilestonePercent] = useState('');
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('');

  // Blocking Rules state
  const [blockingRules, setBlockingRules] = useState<{sourceGoalId: string; condition: 'must_be_complete'}[]>([]);
  const [newBlockingRuleId, setNewBlockingRuleId] = useState('');

  // Mock price logic
  useEffect(() => {
    if (ticker) {
        const price = (ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 500) + 50.12;
        setMockPrice(price);
    } else {
        setMockPrice(0);
    }
  }, [ticker]);

  useEffect(() => {
    if (selectedRule) {
      setName(selectedRule.name);
      setDestinationAccountId(selectedRule.destinationAccountId);
      setMilestones(selectedRule.milestones || []);
      setBlockingRules(selectedRule.blockingRules || []);
      setIsPermanent(selectedRule.isPermanent || false);
      
      // Set allocation type
      setAllocationType(selectedRule.allocationType || 'percentage');
      setPercentage(selectedRule.percentage);
      
      // Set goal type
      const hasMetric = !!selectedRule.goalMetric;
      setIsMetricGoal(hasMetric);

      if(hasMetric) {
        setMetricType(selectedRule.goalMetric.type);
        setTicker(selectedRule.goalMetric.ticker);
        setTargetUnits(selectedRule.goalMetric.targetUnits);
        // Goal will be recalculated from metric, so we don't set it directly
      } else {
        setGoal(selectedRule.goal || 0);
        setTicker('');
        setTargetUnits(100);
      }
      setNewBlockingRuleId('');

    }
  }, [selectedRule]);

  const handleSave = () => {
    if (selectedRule) {
        const updatedRule: AutomationRule = {
            ...selectedRule,
            name,
            destinationAccountId,
            isPermanent,
            allocationType,
            percentage,
            blockingRules: isPermanent ? [] : blockingRules,
            milestones: isPermanent ? [] : milestones,
        };

        if (isPermanent) {
            delete updatedRule.goal;
            delete updatedRule.goalMetric;
            updatedRule.completionAction = 'stop';
        } else if (isMetricGoal) {
            if (allocationType === 'buy_next_unit' && !isMetricGoal) {
                alert('"Buy Next Unit" allocation requires a Metric Goal. Please configure a metric or change the allocation type.');
                return;
            }
            const calculatedPrice = (ticker.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 500) + 50.12;
            updatedRule.goalMetric = {
                type: metricType,
                ticker: ticker.toUpperCase(),
                targetUnits: targetUnits,
                currentPrice: calculatedPrice,
            };
            updatedRule.goal = targetUnits * calculatedPrice;
        } else {
            updatedRule.goal = goal;
            updatedRule.goalMetric = undefined;
        }

        onSaveRule(updatedRule);
    }
  };


  const handleDelete = () => {
    if(selectedRule) {
        onDeleteRule(selectedRule.id);
        onClose();
    }
  }
  
  const handleAddMilestone = () => {
    const percent = parseInt(newMilestonePercent, 10);
    if(isNaN(percent) || percent <= 0 || percent > 100) {
        alert("Please enter a valid percentage (1-100).");
        return;
    }
    if(!newMilestoneDesc.trim()) {
        alert("Please enter a milestone description.");
        return;
    }
    setMilestones(prev => [...prev, { percentage: percent, description: newMilestoneDesc }].sort((a,b) => a.percentage - b.percentage));
    setNewMilestonePercent('');
    setNewMilestoneDesc('');
  }

  const handleUpdateMilestone = (index: number, field: 'percentage' | 'description', value: string) => {
    const updated = [...milestones];
    const item = { ...updated[index] };
    if (field === 'percentage') {
        const percent = parseInt(value, 10);
        item.percentage = isNaN(percent) ? 0 : percent;
    } else {
        item.description = value;
    }
    updated[index] = item;
    setMilestones(updated);
  }

  const handleDeleteMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  }

  const handleAddBlockingRule = () => {
    if (newBlockingRuleId && !blockingRules.some(br => br.sourceGoalId === newBlockingRuleId)) {
        setBlockingRules(prev => [...prev, { sourceGoalId: newBlockingRuleId, condition: 'must_be_complete' }]);
        setNewBlockingRuleId('');
    }
  };

  const handleRemoveBlockingRule = (goalId: string) => {
    setBlockingRules(prev => prev.filter(br => br.sourceGoalId !== goalId));
  };
  
  if (!selectedNodeId) {
    return (
        <div className="w-96 bg-white border-l border-gray-200 p-6 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </div>
            <h3 className="font-bold text-gray-800">Select a Node</h3>
            <p className="text-sm text-gray-500">Click on a source or goal in the workflow to edit its details here.</p>
        </div>
    );
  }

  const isInvestmentGoal = selectedRule?.goalType === 'Investment';

  return (
    <div className={`w-96 bg-white border-l border-gray-200 flex flex-col transition-all duration-300`}>
        <div className="flex justify-between items-center mb-6 p-6 pb-0">
            <h2 className="text-2xl font-bold">Edit Node</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XIcon className="w-6 h-6"/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedSource && (
              <SourceEditor 
                  source={selectedSource} 
                  onEdit={onEditSource} 
                  rules={rules} 
                  accounts={accounts} 
                  onAddChainedGoal={onAddChainedGoal} 
              />
            )}

            {selectedAction && (
                <ActionEditor
                    action={selectedAction}
                    onSave={onSaveAutomationAction}
                    onDelete={onDeleteAutomationAction}
                />
            )}
            
            {selectedAutoInvest && (
                <AutoInvestEditor
                    rule={selectedAutoInvest}
                    allGoals={rules}
                    onSave={onSaveAutoInvestRule}
                    onDelete={onDeleteAutoInvestRule}
                />
            )}

            {selectedMilestone && (
                <MilestoneEditor 
                    milestone={selectedMilestone}
                    rules={rules}
                    onSave={onSaveMilestone}
                    onDelete={onDeleteMilestone}
                />
            )}

            {selectedRule && (
            <>
                <div>
                    <label className="font-semibold text-gray-700">Goal Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                </div>
                 <div>
                    <label className="font-semibold text-gray-700">Destination Account</label>
                    <select value={destinationAccountId} onChange={e => setDestinationAccountId(e.target.value)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white">
                        {accounts.map(account => (
                            <option key={account.id} value={account.id}>{account.name}</option>
                        ))}
                    </select>
                </div>
                 <div className="pt-4 border-t">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input 
                            type="checkbox"
                            checked={isPermanent}
                            onChange={e => setIsPermanent(e.target.checked)}
                            className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                        />
                        <span className="font-semibold text-gray-700">Permanent Allocation (No Goal)</span>
                    </label>
                    <p className="text-sm text-gray-500 ml-8">This rule will run indefinitely without a target amount. Good for ongoing budget strategies.</p>
                </div>

                {!isPermanent && (
                <>
                    {/* --- GOAL TYPE --- */}
                    {isInvestmentGoal && (
                        <div className="border-t pt-4">
                            <label className="font-semibold text-gray-700">Goal Type</label>
                            <div className="flex mt-2 rounded-lg border-2 border-gray-200 p-1">
                                <button onClick={() => setIsMetricGoal(false)} className={`flex-1 p-2 rounded-md font-semibold text-sm transition-colors ${!isMetricGoal ? 'bg-purple-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>Fixed Amount</button>
                                <button onClick={() => setIsMetricGoal(true)} className={`flex-1 p-2 rounded-md font-semibold text-sm transition-colors ${isMetricGoal ? 'bg-purple-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>Target Metric</button>
                            </div>
                        </div>
                    )}
                    
                    {isMetricGoal ? (
                        <div className="p-4 bg-purple-50 rounded-lg space-y-4">
                            <div className="flex space-x-2">
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-700">Metric</label>
                                    <select value={metricType} onChange={e => setMetricType(e.target.value as any)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg bg-white">
                                        <option value="shares">Shares</option>
                                        <option value="crypto">Crypto</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-700">Ticker</label>
                                    <input type="text" value={ticker} onChange={e => setTicker(e.target.value.toUpperCase())} placeholder="e.g. GOOGL" className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-semibold text-gray-700">Target Units</label>
                                <input type="number" value={targetUnits} onChange={e => setTargetUnits(Number(e.target.value))} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg" />
                            </div>
                            <div className="text-center bg-white p-2 rounded-lg">
                                <p className="text-xs text-gray-500">Current Price (mock): ${mockPrice.toFixed(2)}</p>
                                <p className="font-bold text-purple-700">Total Goal Value: ~${(targetUnits * mockPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="font-semibold text-gray-700">Goal Amount</label>
                            <input type="number" value={goal} onChange={e => setGoal(Number(e.target.value))} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                        </div>
                    )}
                </>
                )}


                {/* --- ALLOCATION TYPE --- */}
                <div className="border-t pt-4">
                     <label className="font-semibold text-gray-700">Allocation Type</label>
                     <div className="flex mt-2 rounded-lg border-2 border-gray-200 p-1">
                        <button onClick={() => setAllocationType('percentage')} className={`flex-1 p-2 rounded-md font-semibold text-sm transition-colors ${allocationType === 'percentage' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}>Percentage of Income</button>
                        <button onClick={() => setAllocationType('buy_next_unit')} disabled={!isMetricGoal} className={`flex-1 p-2 rounded-md font-semibold text-sm transition-colors ${allocationType === 'buy_next_unit' ? 'bg-purple-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'} disabled:opacity-50 disabled:cursor-not-allowed`}>Buy Next Unit</button>
                    </div>
                </div>

                {allocationType === 'percentage' && (
                     <div>
                        <label className="font-semibold text-gray-700 flex justify-between">
                            <span>Allocation Percentage</span>
                            <span className="font-bold text-purple-600">{percentage}%</span>
                        </label>
                        <input 
                            type="range" min="0" max={100} value={percentage} onChange={e => setPercentage(Number(e.target.value))}
                            className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-purple-600"
                        />
                    </div>
                )}
                
                {!isPermanent && (
                <>
                {/* --- ACTIVATION CONDITIONS --- */}
                <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Activation Conditions</h3>
                    <p className="text-xs text-gray-500 mb-2">This goal will only start after all selected prerequisite goals are complete.</p>
                    <div className="space-y-2 max-h-24 overflow-y-auto pr-2">
                        {blockingRules.map((br) => {
                            const ruleName = rules.find(r => r.id === br.sourceGoalId)?.name || 'Unknown Goal';
                            return (
                                <div key={br.sourceGoalId} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                    <span className="text-sm font-medium text-gray-700">{ruleName}</span>
                                    <button onClick={() => handleRemoveBlockingRule(br.sourceGoalId)} className="p-1 text-red-500 hover:bg-red-100 rounded-full">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                        <select
                            value={newBlockingRuleId}
                            onChange={(e) => setNewBlockingRuleId(e.target.value)}
                            className="flex-1 p-1 border-2 border-gray-200 rounded-md bg-white"
                        >
                            <option value="">Select a goal to add...</option>
                            {rules
                                .filter(r => r.id !== selectedRule.id && !blockingRules.some(br => br.sourceGoalId === r.id))
                                .map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                        <button onClick={handleAddBlockingRule} className="p-1 text-purple-600 hover:bg-purple-100 rounded-full" disabled={!newBlockingRuleId}>
                            <PlusCircleIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>


                <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Visual Milestones (on Progress Bar)</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {milestones.map((m, i) => (
                             <div key={i} className="flex items-center space-x-2">
                                <input type="number" value={m.percentage} onChange={e => handleUpdateMilestone(i, 'percentage', e.target.value)} className="w-16 p-1 border-2 border-gray-200 rounded-md" placeholder="%"/>
                                <input type="text" value={m.description} onChange={e => handleUpdateMilestone(i, 'description', e.target.value)} className="flex-1 p-1 border-2 border-gray-200 rounded-md" placeholder="Description"/>
                                <button onClick={() => handleDeleteMilestone(i)} className="p-1 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                        ))}
                    </div>
                     <div className="flex items-center space-x-2 mt-2">
                        <input type="number" value={newMilestonePercent} onChange={e => setNewMilestonePercent(e.target.value)} className="w-16 p-1 border-2 border-gray-200 rounded-md" placeholder="%"/>
                        <input type="text" value={newMilestoneDesc} onChange={e => setNewMilestoneDesc(e.target.value)} className="flex-1 p-1 border-2 border-gray-200 rounded-md" placeholder="New milestone description"/>
                        <button onClick={handleAddMilestone} className="p-1 text-purple-600 hover:bg-purple-100 rounded-full"><PlusCircleIcon className="w-6 h-6"/></button>
                    </div>
                </div>

                <div className="border-t pt-4">
                     <button onClick={() => onAddChainedGoal(selectedRule.id)} className="w-full flex items-center justify-center space-x-2 text-purple-600 font-bold py-3 px-5 rounded-xl hover:bg-purple-50 transition-colors">
                        <PlusCircleIcon className="w-6 h-6" />
                        <span>Add Chained Goal</span>
                    </button>
                </div>
                </>
                )}
            </>
            )}
        </div>
        {selectedRule && (
            <div className="flex space-x-2 p-6 pt-0">
                <button onClick={handleDelete} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
                    <TrashIcon className="w-5 h-5"/>
                    <span>Delete</span>
                </button>
                <button onClick={handleSave} className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-colors">
                    Save Changes
                </button>
            </div>
        )}
    </div>
  );
};

export default AutomationEditorPanel;