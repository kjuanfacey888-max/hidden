import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { AutoInvestRule } from '../types';
import { RepeatIcon } from './icons';

interface AutoInvestNodeData {
  rule: AutoInvestRule;
  sourceGoalName: string;
}

const AutoInvestNode: React.FC<{ data: AutoInvestNodeData }> = ({ data }) => {
  const { rule, sourceGoalName } = data;

  const triggerText = rule.triggerType === 'on_every_increase'
    ? `Every $${rule.triggerAmount.toLocaleString()}`
    : `At $${rule.triggerAmount.toLocaleString()}`;
  
  const actionText = `Buy $${rule.tradeAction.amount.toLocaleString()} of ${rule.tradeAction.symbol}`;

  return (
    <div className="w-72 p-4 bg-white rounded-lg shadow-md border-2 border-dashed border-cyan-500">
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3 bg-cyan-100 text-cyan-600">
            <RepeatIcon className="w-6 h-6"/>
        </div>
        <div>
            <p className="font-bold text-gray-800">{rule.name}</p>
            <p className="text-sm text-gray-500">Auto-Investment Rule</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t text-sm space-y-2">
        <p className="text-gray-600">
            Watching: <span className="font-bold text-purple-600">'{sourceGoalName}'</span>
        </p>
         <p className="text-gray-600">
            Condition: <span className="font-bold text-cyan-700">{triggerText}</span>
        </p>
         <p className="text-gray-600">
            Action: <span className="font-bold text-green-700">{actionText}</span>
        </p>
      </div>
    </div>
  );
};

export default memo(AutoInvestNode);