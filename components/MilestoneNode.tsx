import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { AutomationMilestone } from '../types';
import { ZapIcon, LightbulbIcon, ClockIcon } from './icons';

interface MilestoneNodeData {
  milestone: AutomationMilestone;
  sourceGoalName: string;
  timeEstimate?: string | null;
}

const MilestoneNode: React.FC<{ data: MilestoneNodeData }> = ({ data }) => {
  const { milestone, sourceGoalName, timeEstimate } = data;
  const hasSourceGoal = !!sourceGoalName && sourceGoalName !== '...';

  return (
    <div className={`relative w-72 p-4 bg-white rounded-lg shadow-md border-2 ${hasSourceGoal ? 'border-blue-400' : 'border-dashed border-gray-400'}`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      
      <div className="flex items-start">
        <div className="w-10 h-10 rounded-md flex items-center justify-center mr-3 bg-blue-100 text-blue-600">
            <ZapIcon className="w-6 h-6"/>
        </div>
        <div>
            <p className="font-bold text-gray-800">{milestone.name}</p>
            <p className="text-sm text-gray-500">Milestone Trigger</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t text-sm">
        {hasSourceGoal ? (
            <p className="text-gray-600 text-center">
                Triggers when <span className="font-bold text-purple-600">'{sourceGoalName}'</span> reaches <span className="font-bold text-blue-600">{milestone.triggerPercentage}%</span>
            </p>
        ) : (
            <p className="text-gray-500 italic text-center">Connect a goal to this milestone to activate it.</p>
        )}
        {timeEstimate && hasSourceGoal && (
            <div className="mt-2 flex items-center justify-center space-x-1 text-xs text-gray-500 font-semibold">
                <ClockIcon className="w-3 h-3" />
                <span>Est: {timeEstimate}</span>
            </div>
        )}
      </div>

      {milestone.advice && (
          <div className="mt-3 pt-3 border-t border-dashed text-sm flex items-start space-x-2 text-gray-700">
              <LightbulbIcon className="w-4 h-4 mt-0.5 shrink-0 text-yellow-500" />
              <p><span className="font-semibold">AI Advice:</span> {milestone.advice}</p>
          </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  );
};

export default memo(MilestoneNode);