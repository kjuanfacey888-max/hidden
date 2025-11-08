import React, { useState, useEffect } from 'react';
import { XIcon, WandIcon } from './icons';

interface AiTemplateGeneratorModalProps {
    onClose: () => void;
    onGenerate: (prompt: string) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

const AiTemplateGeneratorModal: React.FC<AiTemplateGeneratorModalProps> = ({ onClose, onGenerate, isLoading, error }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        if (isLoading) return;
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = () => {
        if (prompt.trim() && !isLoading) {
            onGenerate(prompt);
        }
    };

    const placeholder = `Describe your financial situation and goals. Be as detailed as possible!\n\nFor example:\n"I get paid $2000 bi-weekly into my checking account. I want to save for a $20,000 down payment on a house in my savings account. I also need to pay off a $5,000 credit card. Once the credit card is paid off, I want that money to go towards the house down payment instead. My main goal is the down payment."`;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 m-4 transition-all duration-300 flex flex-col ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Build a Custom Plan with AI</h2>
                <p className="text-gray-500 mb-6">Describe your ideal financial system, and our AI will build a template for you to deploy.</p>

                <div className="flex-1 flex flex-col">
                    <textarea
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                        placeholder={placeholder}
                        className="w-full h-full flex-1 p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 resize-none"
                        disabled={isLoading}
                    />
                </div>
                
                {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        <p className="font-semibold">Generation Failed</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                    <button 
                        onClick={handleSubmit}
                        disabled={isLoading || !prompt.trim()}
                        className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                            <>
                                <WandIcon className="w-5 h-5" />
                                <span>Generate My Plan</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiTemplateGeneratorModal;