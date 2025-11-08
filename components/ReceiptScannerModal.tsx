import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { XIcon, CameraIcon } from './icons';
import type { WalletAccount, BudgetCategory } from '../types';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            const base64Data = base64String.split(',')[1];
            resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

interface ReceiptScannerModalProps {
    onClose: () => void;
    onLogPurchase: (data: { amount: number; description: string; categoryName: string; accountId: string; receiptImage: string | null; }) => void;
    accounts: WalletAccount[];
    categories: BudgetCategory[];
}

type View = 'live' | 'confirm' | 'loading' | 'error';

const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({ onClose, onLogPurchase, accounts, categories }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [view, setView] = useState<View>('live');
    const [error, setError] = useState<string | null>(null);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    
    // Form state
    const [merchant, setMerchant] = useState('');
    const [date, setDate] = useState('');
    const [total, setTotal] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categories.length > 0 ? categories[0].name : '');
    const [selectedAccount, setSelectedAccount] = useState(accounts.length > 0 ? accounts[0].id : '');
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    useEffect(() => {
        setIsVisible(true);
        setupCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const setupCamera = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
            setError("Could not access camera. Please check your browser permissions.");
            setView('error');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
    };

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const captureImage = async () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                canvas.toBlob(async (blob) => {
                    if (blob) {
                        const base64Data = await blobToBase64(blob);
                        setCapturedImage(base64Data);
                        stopCamera();
                        await handleSendToGemini(base64Data);
                    }
                }, 'image/jpeg', 0.9);
            }
        }
    };

    const handleSendToGemini = async (base64Image: string) => {
        setView('loading');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const imagePart = { inlineData: { mimeType: 'image/jpeg', data: base64Image } };
            const textPart = { text: 'Extract the merchant name, date (in YYYY-MM-DD format), and total amount from this receipt. If the date is not present, use today\'s date. The total amount should be a number.' };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            merchant: { type: Type.STRING, description: 'The name of the store or merchant.' },
                            date: { type: Type.STRING, description: 'The date of the purchase in YYYY-MM-DD format.' },
                            total: { type: Type.NUMBER, description: 'The final total amount of the purchase.' },
                        },
                        required: ['merchant', 'date', 'total'],
                    },
                },
            });
            
            const data = JSON.parse(response.text);
            setMerchant(data.merchant || '');
            setDate(data.date || new Date().toISOString().split('T')[0]);
            setTotal(String(data.total || ''));
            setView('confirm');
        } catch (e) {
            console.error(e);
            setError('Could not read the receipt. Please try again or enter details manually.');
            setView('confirm'); // Go to confirm view to allow manual entry
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(total);
        if (isNaN(amount) || amount <= 0 || !merchant.trim() || !selectedCategory || !selectedAccount) {
            alert("Please fill in all fields with valid data.");
            return;
        }
        onLogPurchase({
            amount,
            description: merchant,
            categoryName: selectedCategory,
            accountId: selectedAccount,
            receiptImage: capturedImage
        });
    };
    
    const renderContent = () => {
        switch (view) {
            case 'loading':
                return <div className="flex flex-col items-center justify-center h-full"><svg className="animate-spin h-10 w-10 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><p className="mt-4 font-semibold text-gray-600">Reading your receipt...</p></div>;
            case 'error':
                 return <div className="flex flex-col items-center justify-center h-full text-center"><p className="text-red-500 font-semibold">{error}</p><button onClick={() => { setView('live'); setupCamera(); }} className="mt-4 bg-purple-600 text-white font-bold py-2 px-4 rounded-lg">Try Again</button></div>;
            case 'confirm':
                return (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Confirm Purchase</h2>
                        <div><label className="font-semibold text-gray-700">Merchant</label><input type="text" value={merchant} onChange={e => setMerchant(e.target.value)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg" required /></div>
                        <div className="flex space-x-4"><div className="flex-1"><label className="font-semibold text-gray-700">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg" required /></div><div className="flex-1"><label className="font-semibold text-gray-700">Total</label><input type="number" step="0.01" value={total} onChange={e => setTotal(e.target.value)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg" required /></div></div>
                        <div><label className="font-semibold text-gray-700">Category</label><select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg bg-white" required>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
                        <div><label className="font-semibold text-gray-700">From Account</label><select value={selectedAccount} onChange={e => setSelectedAccount(e.target.value)} className="w-full mt-1 p-2 border-2 border-gray-200 rounded-lg bg-white" required>{accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
                        <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-all">Log Purchase</button>
                    </form>
                );
            case 'live':
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Scan Receipt</h2>
                        <p className="text-gray-500 mb-4 text-center">Center your receipt in the frame and tap the button to capture.</p>
                        <div className="w-full aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden relative">
                            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                            <canvas ref={canvasRef} className="hidden"></canvas>
                        </div>
                        <button onClick={captureImage} className="mt-6 w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-purple-700 transition-colors"><CameraIcon className="w-8 h-8"/></button>
                    </div>
                );
        }
    };
    
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 m-4 transition-all duration-300 min-h-[500px] flex flex-col ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                {renderContent()}
            </div>
        </div>
    );
};

export default ReceiptScannerModal;