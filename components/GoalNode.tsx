import React, { useState, useRef, useEffect, memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { AutomationRule, WalletAccount, Milestone } from '../types';
import { WorkflowIcon, ClockIcon, CheckIcon, SparkleIcon } from './icons';

interface GoalNodeData {
  rule: AutomationRule;
  account: WalletAccount | undefined;
  timeToGoal?: string | null;
  milestones?: (Milestone & { timeEstimate?: string | null; })[];
  onRequestOptimalMilestones: (ruleId: string) => void;
  onCreateNextGoal: (ruleId: string) => void;
  onOpenAiAssistant: () => void;
  isAiLoading: boolean;
}

const GoalNode: React.FC<{ data: GoalNodeData }> = ({ data }) => {
  const { rule, account, timeToGoal, milestones, onRequestOptimalMilestones, onCreateNextGoal, onOpenAiAssistant, isAiLoading } = data;
  const isComplete = rule.status === 'complete';
  const isActive = rule.status === 'active';
  const isPermanent = rule.isPermanent;

  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const aiMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (aiMenuRef.current && !aiMenuRef.current.contains(event.target as Node)) {
            setIsAiMenuOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [aiMenuRef]);

  const isMetric = !!rule.goalMetric;
  let progress = 0;
  let currentAmount = 0;
  let currentUnits = 0;

  if (rule.trackingMode === 'goal_specific') {
    currentAmount = rule.currentAmount || 0;
  } else { // 'account_balance' or undefined
    currentAmount = account?.balance || 0;
  }
  
  const goalAmount = rule.goal || 0;
  if (goalAmount > 0) {
      progress = Math.min((currentAmount / goalAmount) * 100, 100);
  }

  if (isMetric && rule.goalMetric.currentPrice && rule.goalMetric.currentPrice > 0) {
      currentUnits = currentAmount / rule.goalMetric.currentPrice;
  }

  return (
    <div className={`relative w-72 p-4 bg-white rounded-lg shadow-md border-2 ${isActive ? 'border-purple-500' : 'border-transparent'} ${isComplete ? 'opacity-60 bg-gray-50' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      
      <div className="flex items-start justify-between">
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${isComplete ? 'bg-gray-200 text-gray-500' : 'bg-purple-100 text-purple-600'}`}>
                <WorkflowIcon className="w-6 h-6"/>
            </div>
            <div>
                <p className={`font-bold ${isComplete ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{rule.name}</p>
                <p className="text-sm text-gray-500">
                    {rule.allocationType === 'buy_next_unit' ? 'Buying units' : `${rule.percentage}%`} to {account?.name || '...'}
                </p>
            </div>
        </div>
        {isComplete && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">MET</span>}
      </div>

      <div className="mt-4">
        {isPermanent ? (
            <div className="text-center py-3 bg-gray-50 rounded-md">
                <p className="font-bold text-gray-700">Ongoing Allocation</p>
                <p className="text-lg font-bold text-purple-600">{rule.percentage}%</p>
            </div>
        ) : (
            <>
                <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                    {isMetric ? (
                        <>
                            <span>{currentUnits.toFixed(2)} {rule.goalMetric?.ticker}</span>
                            <span>{rule.goalMetric?.targetUnits} {rule.goalMetric?.ticker}</span>
                        </>
                    ) : (
                        <>
                            <span>${currentAmount.toLocaleString()}</span>
                            <span>${goalAmount.toLocaleString()}</span>
                        </>
                    )}
                </div>
                <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                            className={`h-2.5 rounded-full ${isComplete ? 'bg-green-500' : 'bg-purple-600'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    {milestones && milestones.map((milestone, index) => {
                        const isAchieved = progress >= milestone.percentage;
                        return (
                            <div 
                                key={index}
                                className="absolute top-1/2 -translate-y-1/2"
                                style={{ left: `${milestone.percentage}%`, transform: 'translateX(-50%)' }}
                                title={`${milestone.percentage}%: ${milestone.description}${milestone.timeEstimate ? ` (Est: ${milestone.timeEstimate})` : ''}`}
                            >
                                {isAchieved ? (
                                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                                        <CheckIcon className="w-2.5 h-2.5" strokeWidth={4}/>
                                    </div>
                                ) : (
                                    <div className="w-3 h-3 bg-white rounded-full border-2 border-purple-500"></div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </>
        )}
      </div>
      
      {!isPermanent && timeToGoal && !isComplete && (
        <div className="mt-3 pt-3 border-t border-gray-200/80 flex items-center justify-center space-x-2 text-purple-700">
            <ClockIcon className="w-4 h-4" />
            <p className="text-sm font-bold">{timeToGoal}</p>
        </div>
      )}

      {!isComplete && (
        <div ref={aiMenuRef} className="relative mt-3 pt-3 border-t border-gray-200/80">
            <button 
                onClick={() => setIsAiMenuOpen(prev => !prev)}
                disabled={isAiLoading}
                className="w-full flex items-center justify-center space-x-2 text-sm font-semibold text-purple-700 hover:bg-purple-50 p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
                {isAiLoading ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>AI is working...</span>
                    </>
                ) : (
                    <>
                        <SparkleIcon className="w-4 h-4" />
                        <span>AI Assist</span>
                    </>
                )}
            </button>
            {isAiMenuOpen && !isAiLoading && (
                <div className="absolute bottom-full mb-2 w-full bg-white shadow-lg rounded-lg border z-20 p-2 text-sm">
                    {!isPermanent && (
                        <button 
                            onClick={() => { onRequestOptimalMilestones(rule.id); setIsAiMenuOpen(false); }}
                            className="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-700"
                        >
                            Add Optimal Milestones
                        </button>
                    )}
                    {!isPermanent && (
                        <button 
                            onClick={() => { onCreateNextGoal(rule.id); setIsAiMenuOpen(false); }}
                            className="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-700"
                        >
                            Create My Next Goal For Me
                        </button>
                    )}
                    <button 
                        onClick={() => { onOpenAiAssistant(); setIsAiMenuOpen(false); }}
                        className="w-full text-left p-2 rounded-md hover:bg-gray-100 text-gray-700"
                    >
                        Custom Request
                    </button>
                </div>
            )}
        </div>
      )}
      
      {!isPermanent && (
        <Handle type="source" position={Position.Bottom} id="on-goal-reached" className="!bg-green-500">
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-gray-500 whitespace-nowrap">On Goal Reached</div>
        </Handle>
      )}
    </div>
  );
};

export default memo(GoalNode);