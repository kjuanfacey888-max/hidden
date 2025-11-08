import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface MilestoneTypeModalProps {
  onClose: () => void;
  onConfirm: (type: 'visual' | 'node', count: number) => void;
  isLoading: boolean;
}

const MilestoneTypeModal: React.FC<MilestoneTypeModalProps> = ({ onClose, onConfirm, isLoading }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [type, setType] = useState<'visual' | 'node'>('visual');
    const [count, setCount] = useState(3);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        if (isLoading) return;
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = () => {
        onConfirm(type, count);
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Generate AI Milestones</h2>
                <p className="text-gray-500 mb-6">How would you like the AI to add milestones to your goal?</p>

                <div className="space-y-4">
                    <button
                        onClick={() => setType('visual')}
                        className={`w-full text-left p-4 border-2 rounded-lg transition-all ${type === 'visual' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <p className="font-bold text-gray-800">Visual Milestones</p>
                        <p className="text-sm text-gray-600">Add checkpoints directly to the goal's progress bar. Best for a quick visual overview.</p>
                    </button>
                    <button
                        onClick={() => setType('node')}
                        className={`w-full text-left p-4 border-2 rounded-lg transition-all ${type === 'node' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                        <p className="font-bold text-gray-800">Milestone Nodes</p>
                        <p className="text-sm text-gray-600">Create new, independent nodes on the canvas that can trigger other automations.</p>
                    </button>

                    {type === 'node' && (
                        <div className="pl-4">
                            <label className="font-semibold text-gray-700">Number of milestone nodes to create:</label>
                            <input
                                type="number"
                                value={count}
                                onChange={e => setCount(Math.max(1, Math.min(5, Number(e.target.value))))}
                                className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                                min="1"
                                max="5"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <span>Generate Milestones</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MilestoneTypeModal;
