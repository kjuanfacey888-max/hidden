import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };
    
    const mockNotifications = [
        { id: 1, title: 'Budget Warning', message: 'You are at 95% of your "Groceries" budget.', time: '2m ago' },
        { id: 2, title: 'Bill Reminder', message: 'Your Netflix bill is due in 3 days.', time: '1h ago' },
        { id: 3, title: 'AI Insight', message: 'New savings opportunity found in your "Wants" category.', time: 'Yesterday' },
    ];

    if (!isOpen) return null;

    return (
        <div 
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleClose}
        >
            <div className={`absolute inset-0 bg-black/10 backdrop-blur-sm`}></div>
            <div 
                className={`fixed top-0 right-0 bottom-0 bg-white w-full max-w-sm p-6 shadow-2xl transition-transform duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-700">
                        <XIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-4">
                    {mockNotifications.map(n => (
                        <div key={n.id} className="p-4 bg-gray-50 rounded-lg">
                            <p className="font-bold text-gray-800">{n.title}</p>
                            <p className="text-sm text-gray-600">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-2 text-right">{n.time}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NotificationsModal;