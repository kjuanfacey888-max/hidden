import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';
import type { AutomationTemplate, WalletAccount, IncomeSource } from '../types';

interface TemplateSetupWizardProps {
  template: AutomationTemplate;
  accounts: WalletAccount[];
  incomeSources: IncomeSource[];
  onDeploy: (parameters: Record<string, string | number>, clearExisting: boolean, trackingMode: 'account_balance' | 'goal_specific') => void;
  onClose: () => void;
}

const ConfirmationDialog: React.FC<{
    onConfirm: (clear: boolean) => void;
    onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center rounded-3xl">
        <h3 className="text-2xl font-bold text-gray-800">Deploy Template</h3>
        <p className="text-gray-600 my-4">Do you want to clear your existing automation workflow before deploying this template?</p>
        <div className="flex flex-col space-y-3 w-full max-w-xs">
            <button
                onClick={() => onConfirm(true)}
                className="w-full bg-red-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-600 transition-all transform hover:scale-105"
            >
                Clear and Deploy
            </button>
            <button
                onClick={() => onConfirm(false)}
                className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105"
            >
                Deploy Alongside Existing
            </button>
            <button
                onClick={onCancel}
                className="w-full font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors"
            >
                Cancel
            </button>
        </div>
    </div>
);


const TemplateSetupWizard: React.FC<TemplateSetupWizardProps> = ({ template, accounts, incomeSources, onDeploy, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [step, setStep] = useState(0);
    const [parameters, setParameters] = useState<Record<string, string | number>>({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [trackingMode, setTrackingMode] = useState<'account_balance' | 'goal_specific'>('account_balance');
    
    const totalSteps = template.parameters.length + 1; // +1 for tracking mode step

    useEffect(() => {
        setIsVisible(true);
        // Initialize parameters with default values
        const defaults: Record<string, string | number> = {};
        template.parameters.forEach(p => {
            if (p.defaultValue) {
                defaults[p.id] = p.defaultValue;
            } else if (p.type === 'accountSelector' && accounts.length > 0) {
                defaults[p.id] = accounts[0].id;
            }
        });
        setParameters(defaults);
    }, [template, accounts]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleParamChange = (id: string, value: string | number) => {
        setParameters(prev => ({ ...prev, [id]: value }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps - 1));
    const prevStep = () => setStep(prev => Math.max(0, prev - 1));


    const handleDeploy = (clear: boolean) => {
        onDeploy(parameters, clear, trackingMode);
    };
    
    const isTrackingStep = step === 0;
    const currentParamIndex = step - 1;
    const isParamStep = currentParamIndex >= 0 && currentParamIndex < template.parameters.length;
    const currentParam = isParamStep ? template.parameters[currentParamIndex] : null;
    const progressPercentage = ((step + 1) / totalSteps) * 100;

    const renderInput = () => {
        if (!currentParam) return null;

        switch (currentParam.type) {
            case 'accountSelector':
                return (
                    <select
                        value={String(parameters[currentParam.id] || '')}
                        onChange={e => handleParamChange(currentParam.id, e.target.value)}
                        className="w-full mt-2 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white"
                    >
                        {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                    </select>
                );
            case 'amountInput':
                return (
                     <div className="relative mt-2">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                        <input
                            type="number"
                            value={String(parameters[currentParam.id] || '')}
                            onChange={e => handleParamChange(currentParam.id, Number(e.target.value))}
                            className="w-full pl-7 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                     </div>
                );
            case 'percentageInput':
                return (
                    <div className="relative mt-2">
                        <input
                            type="number"
                            value={String(parameters[currentParam.id] || '')}
                            onChange={e => handleParamChange(currentParam.id, Number(e.target.value))}
                            className="w-full pr-8 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">%</span>
                    </div>
                );
            default:
                return null;
        }
    };


    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 m-4 transition-all duration-300 flex flex-col overflow-hidden ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                {showConfirmation && <ConfirmationDialog onConfirm={handleDeploy} onCancel={() => setShowConfirmation(false)} />}
                
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Set up: {template.name}</h2>
                    <p className="text-sm text-gray-500">Step {step + 1} of {totalSteps}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
                    <div className="bg-purple-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
                </div>

                <div className="flex-1">
                    {isTrackingStep && (
                        <div>
                            <label className="font-semibold text-gray-700 text-lg">How should goal progress be tracked?</label>
                             <div className="space-y-3 mt-4">
                                <button
                                    onClick={() => setTrackingMode('account_balance')}
                                    className={`w-full text-left p-4 border-2 rounded-lg transition-all ${trackingMode === 'account_balance' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <p className="font-bold text-gray-800">Track Total Account Balance</p>
                                    <p className="text-sm text-gray-600">Goal progress reflects the entire balance of the destination account. Good for broad goals.</p>
                                </button>
                                <button
                                    onClick={() => setTrackingMode('goal_specific')}
                                    className={`w-full text-left p-4 border-2 rounded-lg transition-all ${trackingMode === 'goal_specific' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                                >
                                    <p className="font-bold text-gray-800">Track Goal-Specific Funds</p>
                                    <p className="text-sm text-gray-600">Goal starts at $0 and only counts funds specifically allocated to it. Good for distinct savings goals.</p>
                                </button>
                            </div>
                        </div>
                    )}
                    {isParamStep && currentParam && (
                        <div>
                            <label className="font-semibold text-gray-700 text-lg">{currentParam.prompt}</label>
                            {renderInput()}
                        </div>
                    )}
                </div>
                
                <div className="mt-8 flex justify-between items-center">
                    <button
                        onClick={prevStep}
                        disabled={step === 0}
                        className="font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Back
                    </button>
                    {step === totalSteps - 1 ? (
                        <button
                            onClick={() => setShowConfirmation(true)}
                            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105"
                        >
                            Deploy System
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TemplateSetupWizard;
