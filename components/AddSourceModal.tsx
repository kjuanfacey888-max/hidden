import React, { useState, useEffect } from 'react';
import { XIcon, TrashIcon, PlusCircleIcon } from './icons';
import type { IncomeSource, WalletAccount, TriggerType, DepositFrequency, AutomationRule } from '../types';

interface AddSourceModalProps {
  onClose: () => void;
  onSave: (source: Omit<IncomeSource, 'id'> | IncomeSource) => void;
  onDelete: (sourceId: string) => void;
  sourceToEdit: IncomeSource | null;
  accounts: WalletAccount[];
  rules: AutomationRule[];
}

const AddSourceModal: React.FC<AddSourceModalProps> = ({ onClose, onSave, onDelete, sourceToEdit, accounts, rules }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [accountId, setAccountId] = useState(accounts.length > 0 ? accounts[0].id : '');
  const [triggerType, setTriggerType] = useState<TriggerType>('on_deposit');
  const [triggerValue, setTriggerValue] = useState(1);
  const [delayDays, setDelayDays] = useState(0);
  const [sweepUnallocated, setSweepUnallocated] = useState(false);
  const [sweepAccountId, setSweepAccountId] = useState(accounts.length > 0 ? accounts[0].id : '');
  const [isLinked, setIsLinked] = useState(false);
  const [depositKeyword, setDepositKeyword] = useState('');
  const [depositAmount, setDepositAmount] = useState<number | ''>('');
  const [expectedAmount, setExpectedAmount] = useState<number | ''>('');
  const [depositFrequency, setDepositFrequency] = useState<DepositFrequency>('bi-weekly');
  const [nextDepositDate, setNextDepositDate] = useState('');
  const [blockingRules, setBlockingRules] = useState<{sourceGoalId: string; condition: 'must_be_complete'}[]>([]);
  const [newBlockingRuleId, setNewBlockingRuleId] = useState('');

  const isEditing = !!sourceToEdit;

  useEffect(() => {
    setIsVisible(true);
    if (sourceToEdit) {
      setName(sourceToEdit.name);
      setAccountId(sourceToEdit.accountId);
      setTriggerType(sourceToEdit.triggerType);
      setTriggerValue(sourceToEdit.triggerValue || 1);
      setDelayDays(sourceToEdit.delayDays || 0);
      setSweepUnallocated(sourceToEdit.sweepUnallocated || false);
      setSweepAccountId(sourceToEdit.sweepAccountId || (accounts.length > 0 ? accounts[0].id : ''));
      setIsLinked(sourceToEdit.isLinked || false);
      setDepositKeyword(sourceToEdit.depositKeyword || '');
      setDepositAmount(sourceToEdit.depositAmount || '');
      setExpectedAmount(sourceToEdit.expectedAmount || '');
      setDepositFrequency(sourceToEdit.depositFrequency || 'bi-weekly');
      setNextDepositDate(sourceToEdit.nextDepositDate || '');
      setBlockingRules(sourceToEdit.blockingRules || []);
    }
  }, [sourceToEdit, accounts]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };
  
  const handleAddBlockingRule = () => {
    if (newBlockingRuleId && !blockingRules.some(br => br.sourceGoalId === newBlockingRuleId)) {
        setBlockingRules(prev => [...prev, { sourceGoalId: newBlockingRuleId, condition: 'must_be_complete' }]);
        setNewBlockingRuleId('');
    }
  };

  const handleRemoveBlockingRule = (goalId: string) => {
    setBlockingRules(prev => prev.filter(br => br.sourceGoalId !== goalId));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a source name.");
      return;
    }
    if (!accountId) {
      alert("Please select an account.");
      return;
    }

    const sourceData: Omit<IncomeSource, 'id' | 'deletable'> & { id?: string } = {
      name,
      accountId,
      triggerType,
      triggerValue: (triggerType === 'minutes' || triggerType === 'hours') ? triggerValue : 0,
      delayDays,
      sweepUnallocated,
      sweepAccountId: sweepUnallocated ? sweepAccountId : undefined,
      isLinked,
      depositKeyword: isLinked ? depositKeyword : undefined,
      depositAmount: depositAmount ? Number(depositAmount) : undefined,
      expectedAmount: expectedAmount ? Number(expectedAmount) : undefined,
      depositFrequency,
      nextDepositDate: nextDepositDate || undefined,
      blockingRules,
    };

    if (isEditing) {
        onSave({ ...sourceToEdit, ...sourceData });
    } else {
        onSave(sourceData);
    }
    handleClose();
  };
  
  const handleDelete = () => {
      if (isEditing && sourceToEdit.deletable) {
          onDelete(sourceToEdit.id);
          handleClose();
      }
  }

  const renderTriggerValueInput = () => {
    if (triggerType === 'minutes') {
      return (
        <div>
          <label className="font-semibold text-gray-700">Minutes (1-60)</label>
          <input 
            type="number" 
            value={triggerValue} 
            onChange={e => setTriggerValue(Math.max(1, Math.min(60, Number(e.target.value))))} 
            min="1" max="60"
            className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" 
          />
        </div>
      );
    }
    if (triggerType === 'hours') {
      return (
        <div>
          <label className="font-semibold text-gray-700">Hours (1-24)</label>
          <input 
            type="number" 
            value={triggerValue} 
            onChange={e => setTriggerValue(Math.max(1, Math.min(24, Number(e.target.value))))}
            min="1" max="24"
            className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
       <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 m-4 transition-all duration-300 max-h-[90vh] flex flex-col ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{isEditing ? 'Edit Income Source' : 'Add Income Source'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-1">
          <div>
            <label className="font-semibold text-gray-700">Source Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Side Gig Income" className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Apply to Account</label>
            <select value={accountId} onChange={e => setAccountId(e.target.value)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white appearance-none">
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
            </select>
          </div>
          <div>
            <label className="font-semibold text-gray-700">Trigger Timing</label>
            <select value={triggerType} onChange={e => setTriggerType(e.target.value as TriggerType)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white appearance-none">
              <option value="on_deposit">On Deposit</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          
          {renderTriggerValueInput()}
          
          <div>
            <label className="font-semibold text-gray-700">Automation Delay (in days)</label>
            <p className="text-sm text-gray-500 mt-1">Wait this many days after a deposit before running rules.</p>
            <input 
              type="number" 
              value={delayDays} 
              onChange={e => setDelayDays(Math.max(0, Number(e.target.value)))}
              min="0"
              className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="pt-4 border-t">
              <h3 className="font-bold text-gray-800 text-lg">Activation Conditions</h3>
              <p className="text-sm text-gray-500 mt-1 mb-2">This income source will only become active after all selected goals are complete.</p>
              <div className="space-y-2 max-h-24 overflow-y-auto pr-2">
                  {blockingRules.map((br) => {
                      const ruleName = rules.find(r => r.id === br.sourceGoalId)?.name || 'Unknown Goal';
                      return (
                          <div key={br.sourceGoalId} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                              <span className="text-sm font-medium text-gray-700">{ruleName}</span>
                              <button type="button" onClick={() => handleRemoveBlockingRule(br.sourceGoalId)} className="p-1 text-red-500 hover:bg-red-100 rounded-full">
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
                      className="flex-1 p-2 border-2 border-gray-200 rounded-md bg-white text-sm"
                  >
                      <option value="">Select a goal to add...</option>
                      {rules
                          .filter(r => !blockingRules.some(br => br.sourceGoalId === r.id))
                          .map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                  <button type="button" onClick={handleAddBlockingRule} className="p-1 text-purple-600 hover:bg-purple-100 rounded-full" disabled={!newBlockingRuleId}>
                      <PlusCircleIcon className="w-6 h-6" />
                  </button>
              </div>
          </div>

          <div className="pt-4 border-t">
              <h3 className="font-bold text-gray-800 text-lg">Deposit Amount Settings</h3>
              <p className="text-sm text-gray-500 mt-1 mb-4">Control how deposit amounts are handled for projections and automations.</p>

              <div>
                  <label className="font-semibold text-gray-700">Set Fixed Deposit Amount (Optional)</label>
                  <p className="text-sm text-gray-500 mt-1">If set, all percentage-based rules for this source will use this amount, NOT the actual deposit amount.</p>
                  <input 
                      type="number" 
                      value={depositAmount} 
                      onChange={e => setDepositAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g., 2200 (for consistent allocations)"
                      className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                  />
              </div>

              <div className="mt-4">
                  <label className="font-semibold text-gray-700">Expected Deposit Amount (for Projections)</label>
                  <p className="text-sm text-gray-500 mt-1">Used to estimate time-to-goal. Does not affect actual transactions.</p>
                  <input 
                      type="number" 
                      value={expectedAmount} 
                      onChange={e => setExpectedAmount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g., 2200 (for timeline estimates)"
                      className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                  />
              </div>
              <div className="mt-4">
                  <label className="font-semibold text-gray-700">Next Deposit Date (for Projections)</label>
                  <p className="text-sm text-gray-500 mt-1">When is your next paycheck or deposit expected? This is used to accurately place income events on the calendar.</p>
                  <input 
                      type="date" 
                      value={nextDepositDate} 
                      onChange={e => setNextDepositDate(e.target.value)}
                      className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                  />
              </div>
              <div className="mt-4">
                  <label className="font-semibold text-gray-700">Deposit Frequency (for Projections)</label>
                  <select value={depositFrequency} onChange={e => setDepositFrequency(e.target.value as DepositFrequency)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white appearance-none">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="bi-weekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                  </select>
              </div>
          </div>

          <div className="pt-4 border-t">
            <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                    type="checkbox"
                    checked={sweepUnallocated}
                    onChange={e => setSweepUnallocated(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                />
                <span className="font-semibold text-gray-700">Sweep unallocated funds</span>
            </label>
            <p className="text-sm text-gray-500 ml-8">Automatically transfer any remaining unallocated funds to a designated account.</p>
          </div>

          {sweepUnallocated && (
            <div>
                <label className="font-semibold text-gray-700">Sweep Destination Account</label>
                <select value={sweepAccountId} onChange={e => setSweepAccountId(e.target.value)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white appearance-none">
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                </select>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <label className="flex items-center space-x-3 cursor-pointer">
                <input 
                    type="checkbox"
                    checked={isLinked}
                    onChange={e => setIsLinked(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                />
                <span className="font-semibold text-gray-700">Link to auto-detect deposits</span>
            </label>
            <p className="text-sm text-gray-500 ml-8">Automatically trigger automations when a deposit description contains a keyword.</p>
          </div>
        
          {isLinked && (
            <div>
                <label className="font-semibold text-gray-700">Deposit Keyword</label>
                <p className="text-sm text-gray-500 mt-1">Enter a unique keyword from the deposit description (e.g., "payroll", "stripe"). Not case-sensitive.</p>
                <input 
                    type="text" 
                    value={depositKeyword} 
                    onChange={e => setDepositKeyword(e.target.value)} 
                    placeholder="e.g., ACME Corp Payroll"
                    className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" 
                />
            </div>
          )}


          <div className="flex space-x-2 pt-2 mt-auto">
            {isEditing && sourceToEdit.deletable && (
                <button type="button" onClick={handleDelete} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
                    <TrashIcon className="w-5 h-5"/>
                    <span>Delete</span>
                </button>
            )}
            <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95">
              {isEditing ? 'Save Changes' : 'Add Source'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSourceModal;