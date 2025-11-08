import React, { useState, useEffect } from 'react';
import type { AlpacaKeys } from '../types';
import { XIcon } from './icons';

interface PlaceTradeModalProps {
  onClose: () => void;
  onPlaceOrder: (order: { symbol: string, qty: number, side: 'buy' | 'sell' }) => Promise<void>;
  keys: AlpacaKeys;
  initialSymbol?: string;
}

const PlaceTradeModal: React.FC<PlaceTradeModalProps> = ({ onClose, onPlaceOrder, keys, initialSymbol }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [symbol, setSymbol] = useState(initialSymbol || '');
  const [qty, setQty] = useState('1');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    if (isLoading) return;
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseFloat(qty);
    if (!symbol.trim() || isNaN(quantity) || quantity <= 0) {
      setError("Please enter a valid symbol and quantity.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await onPlaceOrder({ symbol: symbol.toUpperCase(), qty: quantity, side });
      handleClose();
    } catch (err: any) {
      setError(err.message || "Failed to place order.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Place a Trade</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex p-1 bg-gray-100 rounded-lg">
            <button type="button" onClick={() => setSide('buy')} className={`flex-1 p-2 rounded-md font-semibold text-sm ${side === 'buy' ? 'bg-green-500 text-white shadow' : 'text-gray-600'}`}>Buy</button>
            <button type="button" onClick={() => setSide('sell')} className={`flex-1 p-2 rounded-md font-semibold text-sm ${side === 'sell' ? 'bg-red-500 text-white shadow' : 'text-gray-600'}`}>Sell</button>
          </div>
          <div>
            <label className="font-semibold text-gray-700">Symbol</label>
            <input 
              type="text" 
              value={symbol} 
              onChange={e => setSymbol(e.target.value)} 
              placeholder="e.g., AAPL" 
              className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
              autoCapitalize="characters"
            />
          </div>
          <div>
            <label className="font-semibold text-gray-700">Quantity</label>
            <input 
              type="number" 
              value={qty} 
              onChange={e => setQty(e.target.value)}
              placeholder="e.g., 10" 
              min="0.001"
              step="0.001"
              className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

          <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center">
            {isLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
            {isLoading ? 'Submitting Order...' : 'Submit Market Order'}
          </button>
          <p className="text-xs text-gray-500 text-center">Market orders execute at the next available price. Be aware of market volatility.</p>
        </form>
      </div>
    </div>
  );
};

export default PlaceTradeModal;