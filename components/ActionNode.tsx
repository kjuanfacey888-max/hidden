import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { AutomationAction } from '../types';
import { PlayIcon, BotIcon, DollarSignIcon } from './icons';

interface ActionNodeData {
  action: AutomationAction;
}

const ActionNode: React.FC<{ data: ActionNodeData }> = ({ data }) => {
  const { action } = data;

  const renderContent = () => {
    switch(action.type) {
        case 'deposit_to_brokerage':
            return (
                <div>
                    <p className="font-bold text-gray-800">{action.name}</p>
                    <p className="text-sm text-gray-500">Deposit {action.percentage}% to Brokerage</p>
                </div>
            );
        case 'activate_ai_trader':
             const strategyText = action.strategy.strategyType === 'Custom Prompt'
                ? 'Custom Strategy'
                : action.strategy.strategyType;
             return (
                <div>
                    <p className="font-bold text-gray-800">{action.name}</p>
                    <p className="text-sm text-gray-500">Activate AI: {strategyText}</p>
                </div>
            );
        default:
            return null;
    }
  }

  return (
    <div className="w-72 p-4 bg-white rounded-lg shadow-md border-2 border-green-400">
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3 bg-green-100 text-green-600">
            {action.type === 'activate_ai_trader' ? <BotIcon className="w-6 h-6"/> : <DollarSignIcon className="w-6 h-6"/>}
        </div>
        {renderContent()}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </div>
  );
};

export default memo(ActionNode);