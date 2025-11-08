import React, { useState, useEffect, useMemo } from 'react';
import { XIcon, IconMap, WandIcon } from './icons';
import type { AutomationTemplate, TemplateCategory } from '../types';

interface AutomationTemplateLibraryProps {
  templates: AutomationTemplate[];
  onSelect: (template: AutomationTemplate) => void;
  onClose: () => void;
  onOpenAiGenerator: () => void;
}

const AutomationTemplateLibrary: React.FC<AutomationTemplateLibraryProps> = ({ templates, onSelect, onClose, onOpenAiGenerator }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const groupedTemplates = useMemo(() => {
        return templates.reduce((acc, template) => {
            const category = template.category || 'Personal';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(template);
            return acc;
        }, {} as Record<TemplateCategory | 'Personal', AutomationTemplate[]>);
    }, [templates]);

    const categoryOrder: (TemplateCategory | 'Personal')[] = [
        "🔧 Financial Foundation",
        "📈 Wealth Building",
        "💰 Debt-Crushing Strategy",
        "🏠 Home Ownership",
        "💸 Spending & Habits",
        "🚀 Launch Your Startup",
        "🌴 Ultimate Travel Saver",
        "Personal"
    ];

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-gray-50 rounded-3xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <header className="p-8 pb-4">
                    <button onClick={handleClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                    <h1 className="text-4xl font-bold text-gray-800">Automation Template Library</h1>
                    <p className="text-lg text-gray-600 mt-2">Select a pre-built system to deploy a powerful financial strategy in one click.</p>
                </header>

                <div className="px-8 pb-4">
                    <button
                        onClick={onOpenAiGenerator}
                        className="w-full text-left p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                            <WandIcon className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Build a Custom Plan with AI</h3>
                            <p className="opacity-90">Describe your goals and let our AI create a personalized system for you.</p>
                        </div>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-8 pt-4 pb-8">
                    <div className="space-y-10">
                        {categoryOrder.map(category => {
                            if (!groupedTemplates[category] || groupedTemplates[category].length === 0) return null;
                            
                            return (
                                <section key={category}>
                                    <h2 className="text-2xl font-bold text-purple-800 mb-4">{category}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {groupedTemplates[category].map(template => {
                                            const Icon = IconMap[template.iconName];
                                            return (
                                                <button key={template.id} onClick={() => onSelect(template)} className="text-left p-6 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-purple-500 hover:shadow-lg transition-all transform hover:-translate-y-1">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-4">
                                                            {Icon && <Icon className="w-7 h-7" />}
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-800">{template.name}</h3>
                                                    </div>
                                                    <p className="text-gray-600">{template.description}</p>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </section>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutomationTemplateLibrary;