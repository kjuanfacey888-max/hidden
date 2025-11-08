import React from 'react';
import type { Bill, FamilyMember } from '../types';
import { BillIconMap, PlusCircleIcon, SyncIcon } from './icons';

interface SharedBillsWidgetProps {
    bills: Bill[];
    members: FamilyMember[];
    onOpenBillModal: (bill: Bill | null) => void;
}

const SharedBillsWidget: React.FC<SharedBillsWidgetProps> = ({ bills, members, onOpenBillModal }) => {
    
    const getMemberName = (memberId?: string) => {
        if (!memberId) return 'Unassigned';
        return members.find(m => m.id === memberId)?.name || 'Unknown';
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Shared Bills</h3>
                <button onClick={() => onOpenBillModal(null)} className="flex items-center space-x-1 text-sm text-purple-600 font-semibold hover:text-purple-800">
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Add Bill</span>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {bills.length > 0 ? (
                    <ul className="space-y-3">
                        {bills.map(bill => {
                            const Icon = BillIconMap[bill.iconName as keyof typeof BillIconMap] || BillIconMap.BillsIcon;
                            const member = members.find(m => m.id === bill.paidByMemberId);
                            return (
                                <li key={bill.id} onClick={() => onOpenBillModal(bill)} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mr-3 text-gray-600">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{bill.name}</p>
                                            <p className="text-sm text-gray-500 flex items-center space-x-1.5">
                                                <span>Due: {bill.dueDate}</span>
                                                {bill.recurring && <SyncIcon className="w-3.5 h-3.5 text-gray-400" title="Recurring bill" />}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-gray-800">${bill.amount.toFixed(2)}</p>
                                        {member ? (
                                            <div className="flex items-center justify-end space-x-1 text-xs text-gray-600">
                                                <img src={member.avatarUrl} alt={member.name} className="w-4 h-4 rounded-full" />
                                                <span>{member.name.split(' ')[0]}</span>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-yellow-600 font-semibold">Unassigned</p>
                                        )}
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <div>
                            <p className="font-semibold">No bills added yet.</p>
                            <p className="text-sm">Click "Add Bill" to get started.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SharedBillsWidget;