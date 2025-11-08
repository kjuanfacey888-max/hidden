import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';
import { LinkedCard } from '../types';

interface WithdrawModalProps {
  onClose: () => void;
  onWithdraw: (amount: number, cardId: string) => void;
  cards: LinkedCard[];
  balance: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onClose, onWithdraw, cards, balance }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedCard, setSelectedCard] = useState<string>(cards.length > 0 ? cards[0].id : '');
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
    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (withdrawAmount > balance) {
        setError('Withdrawal amount cannot exceed your balance.');
        return;
    }
    if (!selectedCard) {
      setError('Please select a card to withdraw to.');
      return;
    }
    setError('');
    onWithdraw(withdrawAmount, selectedCard);
    handleClose();
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Withdraw Funds</h2>
        <p className="text-gray-500 mb-6">Available balance: <span className="font-bold text-purple-600">${balance.toFixed(2)}</span></p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-semibold text-gray-700">Amount</label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-7 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-700">To Card</label>
            {cards.length > 0 ? (
                <select value={selectedCard} onChange={e => setSelectedCard(e.target.value)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white">
                    {cards.map(card => (
                        <option key={card.id} value={card.id}>
                        {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)} ending in {card.last4}
                        </option>
                    ))}
                </select>
            ) : (
                <p className="text-gray-500 mt-2">You need to add a card first.</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" disabled={cards.length === 0} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
            Confirm Withdrawal
          </button>
        </form>
      </div>
    </div>
  );
};

export default WithdrawModal;
