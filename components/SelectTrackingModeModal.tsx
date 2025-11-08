import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface SelectTrackingModeModalProps {
  onClose: () => void;
  onConfirm: (trackingMode: 'account_balance' | 'goal_specific') => void;
}

const SelectTrackingModeModal: React.FC<SelectTrackingModeModalProps> = ({ onClose, onConfirm }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">New Goal: Progress Tracking</h2>
                <p className="text-gray-500 mb-6">First, choose how this new goal's progress will be measured.</p>
                
                <div className="space-y-4">
                    <button
                        onClick={() => onConfirm('account_balance')}
                        className="w-full text-left p-4 border-2 rounded-lg transition-all border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                    >
                        <p className="font-bold text-gray-800">Track Total Account Balance</p>
                        <p className="text-sm text-gray-600">Progress reflects the entire balance of the destination account. Good for broad goals like "Reach $10k in Savings".</p>
                    </button>
                    <button
                        onClick={() => onConfirm('goal_specific')}
                        className="w-full text-left p-4 border-2 rounded-lg transition-all border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                    >
                        <p className="font-bold text-gray-800">Track Goal-Specific Funds</p>
                        <p className="text-sm text-gray-600">Starts at $0 and only counts funds specifically allocated to this goal. Good for distinct goals like "Save $5k for Vacation".</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectTrackingModeModal;
