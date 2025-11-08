import React from 'react';
import type { IOU, FamilyMember } from '../types';
import { PlusCircleIcon, CheckIcon } from './icons';

interface IouTrackerWidgetProps {
    ious: IOU[];
    members: FamilyMember[];
    onAddIou: () => void;
    onSettleIou: (iouId: string) => void;
}

const IouTrackerWidget: React.FC<IouTrackerWidgetProps> = ({ ious, members, onAddIou, onSettleIou }) => {
    const outstandingIous = ious.filter(iou => iou.status === 'outstanding');
    
    const getMemberName = (memberId: string) => {
        return members.find(m => m.id === memberId)?.name || 'Unknown';
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">I Owe You (IOU) Tracker</h3>
                <button onClick={onAddIou} className="flex items-center space-x-1 text-sm text-purple-600 font-semibold hover:text-purple-800">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Add IOU</span>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {outstandingIous.length > 0 ? (
                    <ul className="space-y-3">
                        {outstandingIous.map(iou => (
                            <li key={iou.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        <span className="font-bold text-red-600">{getMemberName(iou.fromMemberId)}</span> owes <span className="font-bold text-green-600">{getMemberName(iou.toMemberId)}</span>
                                    </p>
                                    <p className="text-sm text-gray-500">{iou.description}</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="font-bold text-lg text-gray-800">${iou.amount.toFixed(2)}</span>
                                    <button 
                                        onClick={() => onSettleIou(iou.id)}
                                        className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                                        title="Mark as paid"
                                    >
                                        <CheckIcon className="w-5 h-5"/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <div>
                            <p className="font-semibold">All square!</p>
                            <p className="text-sm">No outstanding IOUs.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IouTrackerWidget;