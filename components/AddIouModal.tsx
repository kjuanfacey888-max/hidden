import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';
import type { FamilyMember } from '../types';

interface AddIouModalProps {
    members: FamilyMember[];
    onAddIou: (fromMemberId: string, toMemberId: string, amount: number, description: string) => void;
    onClose: () => void;
}

const AddIouModal: React.FC<AddIouModalProps> = ({ members, onAddIou, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [fromMemberId, setFromMemberId] = useState(members[0]?.id || '');
    const [toMemberId, setToMemberId] = useState(members[1]?.id || '');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if (!fromMemberId || !toMemberId || !description.trim() || isNaN(numAmount) || numAmount <= 0) {
            alert("Please fill all fields correctly.");
            return;
        }
        if (fromMemberId === toMemberId) {
            alert("A member cannot owe themselves.");
            return;
        }
        onAddIou(fromMemberId, toMemberId, numAmount, description);
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Log an IOU</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <label className="font-semibold text-gray-700">From</label>
                            <select value={fromMemberId} onChange={e => setFromMemberId(e.target.value)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg bg-white">
                                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                        <span className="mt-8 font-semibold text-gray-500">owes</span>
                        <div className="flex-1">
                            <label className="font-semibold text-gray-700">To</label>
                            <select value={toMemberId} onChange={e => setToMemberId(e.target.value)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg bg-white">
                                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                            </select>
                        </div>
                    </div>
                     <div>
                        <label className="font-semibold text-gray-700">Amount</label>
                        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg" required />
                    </div>
                     <div>
                        <label className="font-semibold text-gray-700">For</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., Pizza night" className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg" required />
                    </div>
                    <div className="pt-4">
                        <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-all">Add IOU</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddIouModal;