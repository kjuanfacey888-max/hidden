import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';
import type { TrackerType, WalletAccount, DashboardTracker } from '../types';

interface CreateGoalModalProps {
  onClose: () => void;
  onAddTracker: (trackerData: Omit<DashboardTracker, 'id'>) => void;
  accounts: WalletAccount[];
}

const CreateGoalModal: React.FC<CreateGoalModalProps> = ({ onClose, onAddTracker, accounts }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [type, setType] = useState<TrackerType>('income');
    const [title, setTitle] = useState('');
    const [target, setTarget] = useState(5000);
    const [sourceAccountId, setSourceAccountId] = useState(accounts.find(a => a.name.toLowerCase().includes('savings'))?.id || accounts[0]?.id || '');
    
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const finalTitle = title.trim() || getDefaultTitle();
        if (!finalTitle || (type !== 'credit-score' && target <= 0)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        const trackerData: Omit<DashboardTracker, 'id'> = {
            type,
            title: finalTitle,
            target: type === 'credit-score' ? 850 : target,
            sourceAccountId: type === 'savings' ? sourceAccountId : undefined,
        };
        onAddTracker(trackerData);
    };

    const getDefaultTitle = () => {
        switch(type) {
            case 'income': return 'Monthly Income';
            case 'savings': return 'Savings Goal';
            case 'credit-score': return 'Credit Score';
            default: return 'New Goal';
        }
    };

    const renderFormFields = () => {
        switch(type) {
            case 'income':
                return (
                    <>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Monthly Income Goal" className="w-full p-3 border-2 border-gray-200 rounded-lg"/>
                        <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} placeholder="Target Amount" className="w-full p-3 border-2 border-gray-200 rounded-lg"/>
                    </>
                );
            case 'savings':
                return (
                     <>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Vacation Fund" className="w-full p-3 border-2 border-gray-200 rounded-lg"/>
                        <input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} placeholder="Target Amount" className="w-full p-3 border-2 border-gray-200 rounded-lg"/>
                        <select value={sourceAccountId} onChange={e => setSourceAccountId(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-lg bg-white">
                            <option value="">Select Account to Track</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                    </>
                );
            case 'credit-score':
                return (
                    <p className="text-gray-600 text-center p-4 bg-gray-100 rounded-lg">This tracker will display your latest credit score. No additional configuration needed.</p>
                );
            default: return null;
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={e => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10"><XIcon className="w-6 h-6" /></button>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Create New Dashboard Tracker</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-semibold text-gray-700">Tracker Type</label>
                        <select value={type} onChange={e => setType(e.target.value as TrackerType)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg bg-white">
                            <option value="income">Monthly Income Tracker</option>
                            <option value="savings">Savings Goal Tracker</option>
                            <option value="credit-score">Credit Score Tracker</option>
                        </select>
                    </div>

                    {renderFormFields()}

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all">
                            Add Tracker
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGoalModal;