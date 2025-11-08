import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';
import type { AiTraderStrategy } from '../types';

interface AiTraderModalProps {
  onClose: () => void;
  onActivate: (strategy: AiTraderStrategy) => void;
  cashBalance: number;
}

const AiTraderModal: React.FC<AiTraderModalProps> = ({ onClose, onActivate, cashBalance }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    // Form state
    const [strategyType, setStrategyType] = useState<'Day Trading' | 'Swing Trading' | 'Long-Term Investing'>('Day Trading');
    const [riskTolerance, setRiskTolerance] = useState(50);
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [takeProfitPercentage, setTakeProfitPercentage] = useState('5');
    const [stopLossPercentage, setStopLossPercentage] = useState('2');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(investmentAmount);
        const takeProfit = parseFloat(takeProfitPercentage);
        const stopLoss = parseFloat(stopLossPercentage);

        if (isNaN(amount) || amount <= 0 || isNaN(takeProfit) || takeProfit <= 0 || isNaN(stopLoss) || stopLoss <= 0) {
            alert("Please enter valid numbers for all fields.");
            return;
        }
        if (amount > cashBalance) {
            alert("Investment amount cannot exceed your available cash balance.");
            return;
        }

        onActivate({
            strategyType,
            riskTolerance,
            investmentAmount: amount,
            takeProfitPercentage: takeProfit,
            stopLossPercentage: stopLoss,
        });
        handleClose();
    };
    
    const riskLabel = riskTolerance < 33 ? 'Conservative' : riskTolerance < 66 ? 'Moderate' : 'Aggressive';

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10"><XIcon className="w-6 h-6" /></button>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Configure AI Trader</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-semibold text-gray-700">Trading Strategy</label>
                        <select value={strategyType} onChange={e => setStrategyType(e.target.value as any)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg bg-white">
                            <option>Day Trading</option>
                            <option>Swing Trading</option>
                            <option>Long-Term Investing</option>
                        </select>
                    </div>

                    <div>
                        <label className="font-semibold text-gray-700 flex justify-between">
                            <span>Risk Tolerance</span>
                            <span className="font-bold text-purple-600">{riskLabel}</span>
                        </label>
                        <input type="range" min="0" max="100" value={riskTolerance} onChange={e => setRiskTolerance(Number(e.target.value))} className="w-full mt-2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-thumb:bg-purple-600"/>
                    </div>

                    <div>
                        <label className="font-semibold text-gray-700">Investment Amount</label>
                        <input type="number" value={investmentAmount} onChange={e => setInvestmentAmount(e.target.value)} placeholder={`Max: $${cashBalance.toFixed(2)}`} max={cashBalance} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg"/>
                    </div>
                    
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label className="font-semibold text-gray-700">Take Profit (%)</label>
                            <input type="number" value={takeProfitPercentage} onChange={e => setTakeProfitPercentage(e.target.value)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg"/>
                        </div>
                        <div className="flex-1">
                            <label className="font-semibold text-gray-700">Stop Loss (%)</label>
                            <input type="number" value={stopLossPercentage} onChange={e => setStopLossPercentage(e.target.value)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg"/>
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-all">
                            Activate AI Strategy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AiTraderModal;
