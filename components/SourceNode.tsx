import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { IncomeSource, WalletAccount } from '../types';
import { UploadIcon, ClockIcon, ZapIcon } from './icons';

const SourceNode: React.FC<{ data: { source: IncomeSource, account: WalletAccount | undefined } }> = ({ data }) => {
  const { source, account } = data;

  const getTriggerText = () => {
      switch(source.triggerType) {
          case 'minutes': return `Every ${source.triggerValue} min`;
          case 'hours': return `Every ${source.triggerValue} hr`;
          case 'daily': return 'Daily';
          case 'weekly': return 'Weekly';
          case 'monthly': return 'Monthly';
          case 'yearly': return 'Yearly';
          case 'on_deposit': return 'On Deposit';
          default: return 'N/A';
      }
  };

  return (
    <div className={`relative w-72 p-4 rounded-lg shadow-md border-2 border-dashed bg-white ${source.isLinked ? 'border-purple-500' : 'border-green-400'}`}>
      {source.isLinked && (
          <div className="absolute -top-3 -right-3 w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm" title={`Linked via keyword: "${source.depositKeyword}"`}>
              <ZapIcon className="w-4 h-4" />
          </div>
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-center">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center mr-3 ${source.isLinked ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                <UploadIcon className="w-6 h-6"/>
            </div>
            <div>
                <p className="font-bold text-gray-800">{source.name}</p>
                <p className="text-sm text-gray-500">From: <span className="font-semibold">{account?.name || '...'}</span></p>
            </div>
        </div>
         <div className="flex flex-col items-end text-xs text-gray-600">
            <div className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-md">
              <ClockIcon className="w-3 h-3" />
              <span className="font-semibold">{getTriggerText()}</span>
            </div>
            {source.delayDays > 0 && 
              <span className="font-semibold text-blue-600 mt-1">({source.delayDays}d delay)</span>
            }
         </div>
      </div>
      {source.isLinked && source.depositKeyword && (
          <div className="mt-2 text-xs text-gray-500 font-mono bg-gray-100 p-1 rounded">
              Keyword: "{source.depositKeyword}"
          </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </div>
  );
};

export default memo(SourceNode);