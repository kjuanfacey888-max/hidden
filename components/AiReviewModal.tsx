
import React, { useState, useEffect } from 'react';
import type { UncategorizedTransaction } from '../types';
import { XIcon, CheckIcon } from './icons';

interface AiReviewModalProps {
  transactions: UncategorizedTransaction[];
  onClose: () => void;
  onApprove: (id: string) => void;
  onApproveAll: () => void;
}

const TransactionRow: React.FC<{ transaction: UncategorizedTransaction; onApprove: (id: string) => void }> = ({ transaction, onApprove }) => {
    const [isRemoving, setIsRemoving] = useState(false);

    const handleApprove = () => {
        setIsRemoving(true);
        setTimeout(() => {
            onApprove(transaction.id);
        }, 300);
    };

    return (
        <div className={`flex justify-between items-center py-3 transition-all duration-300 ${isRemoving ? 'opacity-0 -translate-x-4' : 'opacity-100'}`}>
            <div>
                <p className="font-semibold text-gray-700">{transaction.description}</p>
                <p className="text-sm text-gray-500">Suggested: <span className="font-medium text-purple-600">{transaction.suggestedCategory}</span></p>
            </div>
            <div className="flex items-center space-x-4">
                <p className="font-bold text-gray-800 text-right">${transaction.amount.toFixed(2)}</p>
                <button 
                    onClick={handleApprove}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors transform hover:scale-110 active:scale-95">
                    <CheckIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

const AiReviewModal: React.FC<AiReviewModalProps> = ({ transactions, onClose, onApprove, onApproveAll }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };
  
  const handleApproveAll = () => {
    onApproveAll();
    handleClose();
  }
  
  const handleSave = () => {
    // In a real app, this might trigger a batch update.
    // Here, since state is managed live, we just close.
    handleClose();
  }

  return (
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
    >
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10">
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="mb-6">
             <h2 className="text-3xl font-bold text-gray-800">Review AI Categories</h2>
             <p className="text-gray-500">Approve these transactions to add them to your budget.</p>
        </div>

        <div className="max-h-80 overflow-y-auto pr-2 divide-y divide-gray-200">
            {transactions.length > 0 ? (
                transactions.map(t => (
                    <TransactionRow key={t.id} transaction={t} onApprove={onApprove} />
                ))
            ) : (
                <div className="text-center py-10 text-gray-500">
                    <p className="font-semibold">All transactions reviewed!</p>
                    <p className="text-sm">Nice work keeping your budget up to date.</p>
                </div>
            )}
        </div>

        <div className="mt-8 flex justify-between items-center">
             <button 
                onClick={handleApproveAll}
                disabled={transactions.length === 0}
                className="text-purple-600 font-bold py-3 px-6 rounded-xl hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Approve All
            </button>
            <button 
                onClick={handleSave}
                className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-purple-600/40"
            >
                Save & Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default AiReviewModal;