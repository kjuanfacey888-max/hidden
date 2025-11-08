import React, { useState, useEffect } from 'react';
import type { BudgetCategory } from '../types';
import { XIcon, TrashIcon } from './icons';

interface CategoryDetailModalProps {
  category: BudgetCategory;
  onClose: () => void;
  onSave: (updatedCategory: BudgetCategory) => void;
  onDelete: (categoryId: string) => void;
}

const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({ category, onClose, onSave, onDelete }) => {
  const [newGoal, setNewGoal] = useState(category.goal);
  const [newSpent, setNewSpent] = useState(category.spent);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPacing, setCurrentPacing] = useState(category.pacing);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to finish
  };

  const handleSave = () => {
    onSave({ ...category, spent: newSpent, goal: newGoal, pacing: currentPacing });
    handleClose();
  };
  
  const handleDelete = () => {
    onDelete(category.id);
    // The parent component will handle closing the modal after deletion.
  }

  useEffect(() => {
    const percentage = newGoal > 0 ? (newSpent / newGoal) * 100 : 101; // Treat 0 goal as over budget
    if (percentage > 90) {
      setCurrentPacing('danger');
    } else if (percentage > 75) {
      setCurrentPacing('warning');
    } else {
      setCurrentPacing('good');
    }
  }, [newGoal, newSpent]);

  const progressPercentage = newGoal > 0 ? Math.min((newSpent / newGoal) * 100, 100) : 100;

  const pacingInfo = {
    good: { text: "You're on track!", color: 'text-green-600', progressColor: 'bg-green-500' },
    warning: { text: "You're spending a bit too fast.", color: 'text-yellow-600', progressColor: 'bg-yellow-500' },
    danger: { text: "You're close to your budget limit.", color: 'text-red-600', progressColor: 'bg-red-500' },
  };
  
  const aiInsight = {
      Groceries: "AI Insight: Your grocery spending is 15% lower when you shop on Tuesdays. Consider moving your shopping day.",
      Utilities: "AI Insight: Your electricity usage peaks between 6 PM and 9 PM. Shifting some appliance use could save you money.",
      Transport: "AI Insight: You've spent 20% more on gas this month compared to last. Planning routes could reduce fuel consumption."
  }[category.name] || "AI Insight: We're analyzing your spending to find savings opportunities.";


  return (
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleClose}
    >
      <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
      <div 
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10">
          <XIcon className="w-6 h-6" />
        </button>

        <div className="flex items-center mb-6">
          <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center text-white mr-5`}>
            <category.Icon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{category.name}</h2>
            <p className={`font-semibold transition-colors duration-300 ${pacingInfo[currentPacing].color}`}>{pacingInfo[currentPacing].text}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-end font-semibold text-gray-600 mb-2">
            <div className="flex items-center">
                <span>Spent: $</span>
                <input 
                    type="number"
                    value={newSpent}
                    onChange={(e) => setNewSpent(Math.max(0, Number(e.target.value)))}
                    className="w-24 font-bold bg-gray-100 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
            <div className="flex items-center">
                <span>Goal: $</span>
                <input 
                    type="number"
                    value={newGoal}
                    onChange={(e) => setNewGoal(Math.max(0, Number(e.target.value)))}
                    className="w-24 text-right font-bold bg-gray-100 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
                className={`h-3 rounded-full transition-all duration-500 ease-out ${pacingInfo[currentPacing].progressColor}`}
                style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-6 bg-purple-50 border border-purple-200 text-purple-700 p-4 rounded-xl">
            <p className="font-semibold text-sm">{aiInsight}</p>
        </div>
        
        <div>
            <h3 className="font-bold text-gray-800 mb-3">Recent Transactions</h3>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {category.transactions.map(t => (
                    <div key={t.id} className="flex justify-between items-center text-sm">
                        <div>
                            <p className="font-semibold text-gray-700">{t.description}</p>
                            <p className="text-gray-500">{new Date(t.date).toLocaleDateString()}</p>
                        </div>
                        <p className="font-bold text-gray-800">${t.amount.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-8 flex justify-between items-center">
             <button
                onClick={handleDelete}
                className="bg-red-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-red-500/40"
            >
                Delete Category
            </button>
            <button 
                onClick={handleSave}
                className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl shadow-purple-600/40 hover:shadow-2xl hover:shadow-purple-600/60"
            >
                Save & Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailModal;