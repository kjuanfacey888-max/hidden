import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';
import type { BudgetCategory, PossibleCategory } from '../types';
import { IconMap } from './icons';

interface AddCategoryModalProps {
    onClose: () => void;
    onAddCategory: (categoryData: Omit<PossibleCategory, 'iconName'> & { goal?: number }) => void;
    existingCategories: BudgetCategory[];
    allPossibleCategories: PossibleCategory[];
    defaults?: Partial<Omit<PossibleCategory, 'iconName'>> & { activeTab?: 'list' | 'custom' } | null;
}

const colors = [
    '#4A5568', '#ED8936', '#F6E05E', '#805AD5', '#F56565', '#48BB78',
    '#38B2AC', '#4299E1', '#0BC5EA', '#3182CE', '#2B6CB0', '#ED64A6', '#A0AEC0'
];
const icons = Object.keys(IconMap);

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose, onAddCategory, existingCategories, allPossibleCategories, defaults }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'list' | 'custom'>(defaults?.activeTab || 'list');
    
    // Custom category state
    const [customName, setCustomName] = useState('');
    const [customGoal, setCustomGoal] = useState(100);
    const [customMainCategory, setCustomMainCategory] = useState<'Needs' | 'Wants' | 'Financial Goals' | 'Miscellaneous'>(defaults?.mainCategory || 'Needs');
    const [customIcon, setCustomIcon] = useState(icons[0]);
    const [customColor, setCustomColor] = useState(colors[0]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };
    
    const handleAddFromList = (category: PossibleCategory) => {
        onAddCategory(category);
        handleClose();
    }
    
    const handleAddCustom = () => {
        if (!customName.trim()) {
            alert("Please enter a category name.");
            return;
        }
        onAddCategory({
            name: customName,
            mainCategory: customMainCategory,
            Icon: IconMap[customIcon],
            color: customColor,
            goal: customGoal
        });
        handleClose();
    }

    const groupedPossibleCategories = allPossibleCategories.reduce((acc, category) => {
        if (!acc[category.mainCategory]) {
          acc[category.mainCategory] = [];
        }
        acc[category.mainCategory].push(category);
        return acc;
    }, {} as Record<string, PossibleCategory[]>);
    
    const existingCategoryNames = new Set(existingCategories.map(c => c.name));

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Category</h2>
                <p className="text-gray-500 mb-6">Choose from our list of common categories or create your own from scratch.</p>

                <div className="flex border-b border-gray-200 mb-6">
                    <button onClick={() => setActiveTab('list')} className={`py-3 px-6 font-semibold transition-colors ${activeTab === 'list' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}>Choose from List</button>
                    <button onClick={() => setActiveTab('custom')} className={`py-3 px-6 font-semibold transition-colors ${activeTab === 'custom' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}>Create Custom</button>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 -mr-4">
                    {activeTab === 'list' ? (
                        <div className="space-y-6">
                            {Object.keys(groupedPossibleCategories).map((mainCategory) => {
                                const categories = groupedPossibleCategories[mainCategory];
                                return (
                                <div key={mainCategory}>
                                    <h3 className="text-lg font-bold text-purple-800 mb-3">{mainCategory}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {categories.map(cat => {
                                            const isAdded = existingCategoryNames.has(cat.name);
                                            return (
                                                <button key={cat.name} onClick={() => handleAddFromList(cat)} disabled={isAdded}
                                                    className="text-left p-3 rounded-lg border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                                                >
                                                    <p className="font-semibold text-gray-700">{cat.name}</p>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )})}
                        </div>
                    ) : (
                        <div className="space-y-6">
                             <div>
                                <label className="font-semibold text-gray-700">Category Name</label>
                                <input type="text" value={customName} onChange={e => setCustomName(e.target.value)} placeholder="e.g., Coffee Shops" className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                            </div>
                             <div>
                                <label className="font-semibold text-gray-700">Initial Goal</label>
                                <input type="number" value={customGoal} onChange={e => setCustomGoal(Number(e.target.value))} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                            </div>
                             <div>
                                <label className="font-semibold text-gray-700">Main Category</label>
                                <select value={customMainCategory} onChange={e => setCustomMainCategory(e.target.value as any)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white">
                                    <option>Needs</option>
                                    <option>Wants</option>
                                    <option>Financial Goals</option>
                                    <option>Miscellaneous</option>
                                </select>
                            </div>
                             <div>
                                <label className="font-semibold text-gray-700">Icon</label>
                                <div className="grid grid-cols-8 gap-2 mt-2">
                                    {icons.map(iconKey => {
                                        const IconComponent = IconMap[iconKey];
                                        return (
                                            <button key={iconKey} type="button" onClick={() => setCustomIcon(iconKey)} className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-colors ${customIcon === iconKey ? 'border-purple-600 bg-purple-100 text-purple-600' : 'border-gray-200 text-gray-500 hover:border-purple-400'}`}>
                                                <IconComponent className="w-6 h-6" />
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="font-semibold text-gray-700">Color</label>
                                <div className="grid grid-cols-8 gap-2 mt-2">
                                    {colors.map(color => (
                                        <button key={color} type="button" onClick={() => setCustomColor(color)} className={`w-12 h-12 rounded-lg border-4 ${customColor === color ? 'border-purple-600' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                 {activeTab === 'custom' && (
                    <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                        <button onClick={handleAddCustom} className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95">
                            Create Category
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddCategoryModal;