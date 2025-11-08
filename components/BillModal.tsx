import React, { useState, useEffect } from 'react';
import { XIcon, TrashIcon, BillIconMap } from './icons';
import type { Bill } from '../types';

interface BillModalProps {
  onClose: () => void;
  onSave: (bill: Omit<Bill, 'id'> & { id?: string }) => void;
  onDelete: (billId: string) => void;
  billToEdit: Bill | null;
}

const icons = Object.keys(BillIconMap);

const BillModal: React.FC<BillModalProps> = ({ onClose, onSave, onDelete, billToEdit }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [iconName, setIconName] = useState(icons[0]);
  const [recurring, setRecurring] = useState(false);

  const isEditing = !!billToEdit;

  useEffect(() => {
    setIsVisible(true);
    if (billToEdit) {
      setName(billToEdit.name);
      setAmount(String(billToEdit.amount));
      setDueDate(billToEdit.dueDate);
      setIconName(billToEdit.iconName);
      setRecurring(billToEdit.recurring || false);
    }
  }, [billToEdit]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const billAmount = parseFloat(amount);
    if (!name.trim() || isNaN(billAmount) || billAmount <= 0 || !dueDate.trim()) {
      alert("Please fill in all fields with valid data.");
      return;
    }

    const billData: Omit<Bill, 'id'> & { id?: string } = {
      name,
      amount: billAmount,
      dueDate,
      iconName,
      recurring,
    };

    if (isEditing) {
      billData.id = billToEdit.id;
    }
    
    onSave(billData);
  };
  
  const handleDelete = () => {
      if (isEditing) {
          onDelete(billToEdit.id);
      }
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{isEditing ? 'Edit Bill' : 'Add New Bill'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-semibold text-gray-700">Bill Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Electricity Bill" className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="font-semibold text-gray-700">Amount</label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" className="w-full pl-7 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
              </div>
            </div>
            <div className="flex-1">
              <label className="font-semibold text-gray-700">Due Date</label>
              <input type="text" value={dueDate} onChange={e => setDueDate(e.target.value)} placeholder="e.g., 28th" className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
            </div>
          </div>

           <div className="flex items-center space-x-3">
              <input
                  type="checkbox"
                  id="recurringBill"
                  checked={recurring}
                  onChange={e => setRecurring(e.target.checked)}
                  className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="recurringBill" className="font-semibold text-gray-700">Recurring Bill</label>
          </div>

          <div>
            <label className="font-semibold text-gray-700">Icon</label>
            <div className="flex space-x-3 mt-2">
              {icons.map(iconKey => {
                const IconComponent = BillIconMap[iconKey as keyof typeof BillIconMap];
                return (
                  <button key={iconKey} type="button" onClick={() => setIconName(iconKey)} className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-colors ${iconName === iconKey ? 'border-purple-600 bg-purple-100 text-purple-600' : 'border-gray-200 text-gray-500 hover:border-purple-400'}`}>
                    <IconComponent className="w-6 h-6" />
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            {isEditing && (
                <button type="button" onClick={handleDelete} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center space-x-2">
                    <TrashIcon className="w-5 h-5"/>
                    <span>Delete</span>
                </button>
            )}
            <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-4 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95">
              {isEditing ? 'Save Changes' : 'Add Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillModal;