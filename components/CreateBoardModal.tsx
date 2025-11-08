import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface CreateBoardModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = ({ onClose, onCreate }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onCreate(name.trim());
            handleClose();
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Name Your New Board</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="boardName" className="font-semibold text-gray-700">Board Name</label>
                        <input
                            id="boardName"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="e.g., My 2024 Financial Plan"
                            className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                            required
                            autoFocus
                        />
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-all">
                            Create Board
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBoardModal;
