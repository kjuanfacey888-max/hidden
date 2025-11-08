import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';
import type { AutomationRule, AutomationMilestone, WalletAccount, DepositFrequency } from '../types';
import { format } from 'date-fns';

type EventType = 'custom' | 'bill' | 'income-source' | 'goal-due' | 'goal-start' | 'milestone-due' | 'milestone-start';

interface AddEventModalProps {
  isOpen: boolean;
  defaultDate?: string | null;
  onClose: () => void;
  onSave: (type: EventType, data: any) => void;
  rules: AutomationRule[];
  milestones: AutomationMilestone[];
  accounts: WalletAccount[];
}

const eventTypeOptions: { value: EventType, label: string }[] = [
    { value: 'custom', label: 'Custom Event' },
    { value: 'bill', label: 'Add a Bill' },
    { value: 'income-source', label: 'Add Pay Day / Income' },
    { value: 'goal-due', label: 'Set Goal Due Date' },
    { value: 'goal-start', label: 'Set Goal Start Date' },
    { value: 'milestone-due', label: 'Set Milestone Due Date' },
    { value: 'milestone-start', label: 'Set Milestone Start Date' },
];

const colors = ['#8B5CF6', '#EC4899', '#22C55E', '#3B82F6', '#F97316', '#F59E0B'];

const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, defaultDate, onClose, onSave, rules, milestones, accounts }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [eventType, setEventType] = useState<EventType>('custom');
    
    // --- Form state for all types ---
    // Custom
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState(colors[0]);
    // Bill
    const [billName, setBillName] = useState('');
    const [billAmount, setBillAmount] = useState('');
    const [billDueDate, setBillDueDate] = useState('1st');
    // Income
    const [incomeName, setIncomeName] = useState('Paycheck');
    const [incomeAccount, setIncomeAccount] = useState(accounts.length > 0 ? accounts[0].id : '');
    const [incomeAmount, setIncomeAmount] = useState('2000');
    const [incomeFrequency, setIncomeFrequency] = useState<DepositFrequency>('bi-weekly');
    // Generic
    const [date, setDate] = useState(defaultDate || format(new Date(), 'yyyy-MM-dd'));
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('10:00');
    const [selectedRuleId, setSelectedRuleId] = useState(rules.length > 0 ? rules[0].id : '');
    const [selectedMilestoneId, setSelectedMilestoneId] = useState(milestones.length > 0 ? milestones[0].id : '');
    
    useEffect(() => { setIsVisible(isOpen); }, [isOpen]);
    useEffect(() => { setDate(defaultDate || format(new Date(), 'yyyy-MM-dd'))}, [defaultDate]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        switch (eventType) {
            case 'custom':
                onSave('custom', { title, date, startTime, endTime, description, color });
                break;
            case 'bill':
                onSave('bill', { name: billName, amount: parseFloat(billAmount), dueDate: billDueDate, iconName: 'BillsIcon' });
                break;
            case 'income-source':
                 onSave('income-source', {
                    name: incomeName,
                    accountId: incomeAccount,
                    expectedAmount: parseFloat(incomeAmount),
                    depositFrequency: incomeFrequency,
                    nextDepositDate: date,
                    triggerType: 'on_deposit',
                    isLinked: false,
                    sweepUnallocated: false,
                    delayDays: 0,
                    triggerValue: 0
                });
                break;
            case 'goal-due':
            case 'goal-start':
                onSave(eventType, { id: selectedRuleId, date });
                break;
            case 'milestone-due':
            case 'milestone-start':
                onSave(eventType, { id: selectedMilestoneId, date });
                break;
        }
    };

    const renderFormFields = () => {
        switch (eventType) {
            case 'custom':
                return <>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Event Title" required className="w-full p-3 border-2 border-gray-200 rounded-lg" />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description..." className="w-full p-3 border-2 border-gray-200 rounded-lg" />
                    <div className="flex space-x-4"><input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg" /><input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg" /></div>
                    <div><label className="font-semibold text-gray-700">Color</label><div className="flex space-x-3 mt-2">{colors.map(c => <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-full border-4 ${color === c ? 'border-purple-600' : 'border-transparent'}`} style={{ backgroundColor: c }} />)}</div></div>
                </>;
            case 'bill':
                 return <>
                    <input type="text" value={billName} onChange={e => setBillName(e.target.value)} placeholder="Bill Name (e.g., Rent)" required className="w-full p-3 border-2 border-gray-200 rounded-lg" />
                    <input type="number" value={billAmount} onChange={e => setBillAmount(e.target.value)} placeholder="Amount" required className="w-full p-3 border-2 border-gray-200 rounded-lg" />
                    <input type="text" value={billDueDate} onChange={e => setBillDueDate(e.target.value)} placeholder="Due Date (e.g., 1st, 15th)" required className="w-full p-3 border-2 border-gray-200 rounded-lg" />
                 </>;
            case 'income-source':
                return <>
                    <input type="text" value={incomeName} onChange={e => setIncomeName(e.target.value)} placeholder="Income Name (e.g., Paycheck)" required className="w-full p-3 border-2 border-gray-200 rounded-lg" />
                    <select value={incomeAccount} onChange={e => setIncomeAccount(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white">{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select>
                    <input type="number" value={incomeAmount} onChange={e => setIncomeAmount(e.target.value)} placeholder="Expected Amount" required className="w-full p-3 border-2 border-gray-200 rounded-lg" />
                    <select value={incomeFrequency} onChange={e => setIncomeFrequency(e.target.value as DepositFrequency)} className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white">
                        <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="bi-weekly">Bi-weekly</option><option value="monthly">Monthly</option>
                    </select>
                </>;
            case 'goal-due': case 'goal-start':
                return <select value={selectedRuleId} onChange={e => setSelectedRuleId(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white">{rules.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select>;
            case 'milestone-due': case 'milestone-start':
                return <select value={selectedMilestoneId} onChange={e => setSelectedMilestoneId(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white">{milestones.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select>;
            default: return null;
        }
    }

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={e => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10"><XIcon className="w-6 h-6" /></button>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Add to Calendar</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select value={eventType} onChange={e => setEventType(e.target.value as EventType)} className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white">
                        {eventTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    
                    {eventType.includes('due') || eventType.includes('start') || eventType === 'custom' || eventType === 'income-source' ? (
                         <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-3 border-2 border-gray-200 rounded-lg" />
                    ) : null}

                    {renderFormFields()}

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all">Add Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEventModal;