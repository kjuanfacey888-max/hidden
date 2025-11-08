import React, { useState, useEffect } from 'react';
import { XIcon, UserIcon, UsersIcon } from './icons';

interface SelectBoardTypeModalProps {
  onClose: () => void;
  onSelect: (type: 'individual' | 'family') => void;
}

const SelectBoardTypeModal: React.FC<SelectBoardTypeModalProps> = ({ onClose, onSelect }) => {
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
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Automation Board</h2>
                <p className="text-gray-500 mb-6">Choose the type of board you want to create.</p>
                
                <div className="space-y-4">
                    <button
                        onClick={() => onSelect('individual')}
                        className="w-full text-left p-6 border-2 rounded-2xl transition-all border-gray-200 hover:border-purple-500 hover:bg-purple-50 flex items-center"
                    >
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-4">
                            <UserIcon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-800">Individual Board</p>
                            <p className="text-sm text-gray-600">For managing your own personal finances and goals.</p>
                        </div>
                    </button>
                    <button
                        onClick={() => onSelect('family')}
                        className="w-full text-left p-6 border-2 rounded-2xl transition-all border-gray-200 hover:border-purple-500 hover:bg-purple-50 flex items-center"
                    >
                         <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4">
                            <UsersIcon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="font-bold text-lg text-gray-800">Family Board</p>
                            <p className="text-sm text-gray-600">For collaborative goals and shared finances with family members.</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectBoardTypeModal;
