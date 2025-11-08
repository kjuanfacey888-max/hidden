import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface DepositModalProps {
  onClose: () => void;
  onDeposit: (amount: number, description: string) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ onClose, onDeposit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a deposit description (e.g., from your bank statement).');
      return;
    }
    setError('');
    onDeposit(depositAmount, description);
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Log Deposit</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-semibold text-gray-700">Amount</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-7 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-700">Description</label>
            <p className="text-sm text-gray-500 mt-1">Enter the transaction description (e.g., "PAYROLL ACME CORP"). This will be used to automatically trigger linked automations.</p>
            <input 
              type="text" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Deposit description from bank" 
              className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" 
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95">
            Confirm Deposit
          </button>
        </form>
      </div>
    </div>
  );
};

export default DepositModal;