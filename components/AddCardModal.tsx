import React, { useState, useEffect } from 'react';
import { XIcon, VisaIcon, MastercardIcon, CreditCardIcon } from './icons';
import { LinkedCard } from '../types';

interface AddCardModalProps {
  onClose: () => void;
  onAddCard: (card: Omit<LinkedCard, 'id'>) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ onClose, onAddCard }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'unknown'>('unknown');
  const [error, setError] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(value);

    if (value.startsWith('4')) {
        setCardType('visa');
    } else if (value.startsWith('5')) {
        setCardType('mastercard');
    } else {
        setCardType('unknown');
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + ' / ' + value.slice(2);
    }
    setExpiry(value);
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, '').slice(0, 3));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCardNumber = cardNumber.replace(/\s/g, '');
    if (rawCardNumber.length !== 16) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }
    if (expiry.length !== 7) {
      setError('Please enter a valid expiry date (MM / YY).');
      return;
    }
    if (cvv.length !== 3) {
      setError('Please enter a valid 3-digit CVV.');
      return;
    }
    setError('');
    onAddCard({
      last4: rawCardNumber.slice(-4),
      cardType,
      balance: 0,
    });
  };

  const CardTypeIcon = () => {
      if(cardType === 'visa') return <VisaIcon className="w-8 h-5"/>
      if(cardType === 'mastercard') return <MastercardIcon className="w-8 h-5"/>
      return <CreditCardIcon className="w-6 h-6 text-gray-400"/>
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Add New Card</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-semibold text-gray-700">Card Number</label>
            <div className="relative mt-1">
              <input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="0000 0000 0000 0000" className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <CardTypeIcon />
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
             <div className="flex-1">
                <label className="font-semibold text-gray-700">Expiry Date</label>
                <input type="text" value={expiry} onChange={handleExpiryChange} placeholder="MM / YY" className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
            </div>
            <div className="flex-1">
                <label className="font-semibold text-gray-700">CVV</label>
                <input type="password" value={cvv} onChange={handleCvvChange} placeholder="•••" className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95">
            Link Card
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;