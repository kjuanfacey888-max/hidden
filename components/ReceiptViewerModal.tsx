import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface ReceiptViewerModalProps {
    image: string;
    onClose: () => void;
}

const ReceiptViewerModal: React.FC<ReceiptViewerModalProps> = ({ image, onClose }) => {
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
            <div className={`absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-xl shadow-2xl p-4 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute -top-3 -right-3 bg-white rounded-full p-1 text-gray-600 hover:text-gray-900 transition-colors z-10 shadow-md">
                    <XIcon className="w-6 h-6" />
                </button>
                <img src={`data:image/jpeg;base64,${image}`} alt="Scanned Receipt" className="max-w-full max-h-[85vh] rounded-lg" />
            </div>
        </div>
    );
};

export default ReceiptViewerModal;