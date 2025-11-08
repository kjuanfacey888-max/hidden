import React, { useState, useEffect } from 'react';
import { XIcon, IconMap, PlusCircleIcon, TrashIcon } from './icons';
import type { WalletAccount, LinkedCard, LinkedSource } from '../types';

interface AddAccountModalProps {
    onClose: () => void;
    onSaveAccount: (account: Omit<WalletAccount, 'balance' | 'history'> & { id?: string }) => void;
    linkedCards: LinkedCard[];
    accountToEdit: WalletAccount | null;
}

const colors = [
    { name: 'blue', hex: '#3B82F6' },
    { name: 'pink', hex: '#EC4899' },
    { name: 'green', hex: '#22C55E' },
    { name: 'purple', hex: '#8B5CF6' },
    { name: 'orange', hex: '#F97316' },
];

const icons = Object.keys(IconMap);

const AddAccountModal: React.FC<AddAccountModalProps> = ({ onClose, onSaveAccount, linkedCards, accountToEdit }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [name, setName] = useState('');
    const [color, setColor] = useState(colors[0].name);
    const [iconName, setIconName] = useState('CreditCardIcon' as keyof typeof IconMap);

    const isEditing = !!accountToEdit;

    // New state for linked sources
    const [linkedSources, setLinkedSources] = useState<LinkedSource[]>([]);
    const [selectedCardId, setSelectedCardId] = useState(linkedCards.length > 0 ? linkedCards[0].id : '');
    const [selectedPriority, setSelectedPriority] = useState<'Primary' | 'Secondary' | 'Tertiary'>('Primary');

    useEffect(() => {
        setIsVisible(true);
        if (isEditing) {
            setName(accountToEdit.name);
            setColor(accountToEdit.color);
            setIconName(accountToEdit.iconName);
            setLinkedSources(accountToEdit.linkedSources || []);
        }
    }, [accountToEdit, isEditing]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!name.trim()) {
            alert("Please enter an account name.");
            return;
        }
        const accountData: Omit<WalletAccount, 'balance' | 'history'> & { id?: string } = {
            id: isEditing ? accountToEdit.id : undefined,
            name,
            color,
            iconName,
            linkedSources
        };
        onSaveAccount(accountData);
    }

    const handleAddLink = () => {
        if (!selectedCardId) {
            alert("No card selected to link.");
            return;
        }
        if (linkedSources.some(s => s.cardId === selectedCardId)) {
            alert("This card is already linked to this account.");
            return;
        }
        setLinkedSources(prev => [...prev, { cardId: selectedCardId, priority: selectedPriority }]);
    };

    const handleRemoveLink = (cardId: string) => {
        setLinkedSources(prev => prev.filter(s => s.cardId !== cardId));
    };

    const getCardDisplay = (cardId: string) => {
        const card = linkedCards.find(c => c.id === cardId);
        if (!card) return 'Unknown Card';
        return `${card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)} ending in ${card.last4}`;
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 m-4 transition-all duration-300 max-h-[90vh] flex flex-col ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{isEditing ? 'Edit Account' : 'Create New Account'}</h2>
                
                <form id="account-form" onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 -mr-2 flex-1">
                    <div>
                        <label className="font-semibold text-gray-700">Account Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Trip Fund, Car Fund" className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Color</label>
                        <div className="flex space-x-3 mt-2">
                            {colors.map(c => (
                                <button key={c.name} type="button" onClick={() => setColor(c.name)} className={`w-10 h-10 rounded-full border-4 ${color === c.name ? 'border-purple-600' : 'border-transparent'}`} style={{ backgroundColor: c.hex }} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Icon</label>
                        <div className="grid grid-cols-8 gap-2 mt-2">
                            {icons.map(iconKey => {
                                const IconComponent = IconMap[iconKey as keyof typeof IconMap];
                                return (
                                    <button key={iconKey} type="button" onClick={() => setIconName(iconKey as keyof typeof IconMap)} className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-colors ${iconName === iconKey ? 'border-purple-600 bg-purple-100 text-purple-600' : 'border-gray-200 text-gray-500 hover:border-purple-400'}`}>
                                        <IconComponent className="w-6 h-6" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="font-bold text-gray-800 text-lg">Linked Funding Sources (Optional)</h3>
                        <p className="text-sm text-gray-500 mt-1 mb-4">Link cards to this account to act as funding sources for automations.</p>

                        <div className="space-y-2 mb-4">
                            {linkedSources.map(source => (
                                <div key={source.cardId} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                                    <div>
                                        <p className="font-semibold text-gray-700">{getCardDisplay(source.cardId)}</p>
                                        <p className={`text-xs font-semibold ${source.priority === 'Primary' ? 'text-purple-600' : 'text-gray-500'}`}>{source.priority}</p>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveLink(source.cardId)} className="p-1 text-red-500 hover:bg-red-100 rounded-full">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {linkedCards.length > 0 ? (
                            <div className="flex items-end space-x-2 p-2 border border-dashed rounded-lg">
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-600">Card</label>
                                    <select value={selectedCardId} onChange={e => setSelectedCardId(e.target.value)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg bg-white">
                                        {linkedCards.map(c => <option key={c.id} value={c.id}>{getCardDisplay(c.id)}</option>)}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-sm font-semibold text-gray-600">Priority</label>
                                    <select value={selectedPriority} onChange={e => setSelectedPriority(e.target.value as any)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg bg-white">
                                        <option>Primary</option>
                                        <option>Secondary</option>
                                        <option>Tertiary</option>
                                    </select>
                                </div>
                                <button type="button" onClick={handleAddLink} className="p-2 text-purple-600 bg-purple-100 rounded-lg hover:bg-purple-200">
                                    <PlusCircleIcon className="w-6 h-6" />
                                </button>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 text-sm p-4 bg-gray-50 rounded-lg">You have no linked cards to add as a source. Add a card in the Wallet page first.</p>
                        )}
                    </div>
                </form>

                <div className="mt-auto pt-6 border-t">
                    <button type="submit" form="account-form" className="w-full bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95">
                        {isEditing ? 'Save Changes' : 'Create Account'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddAccountModal;