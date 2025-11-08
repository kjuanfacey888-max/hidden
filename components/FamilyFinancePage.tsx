import React from 'react';
import type { FamilyHub, Bill } from '../types';
import { UsersIcon, PlusCircleIcon } from './icons';
import SharedBillsWidget from './SharedBillsWidget';
import IouTrackerWidget from './IouTrackerWidget';

interface FamilyFinancePageProps {
    hub: FamilyHub;
    bills: Bill[];
    onManageMembers: () => void;
    onAddIou: () => void;
    onSettleIou: (iouId: string) => void;
    onOpenBillModal: (bill: Bill | null) => void;
}

const FamilyFinancePage: React.FC<FamilyFinancePageProps> = ({ hub, bills, onManageMembers, onAddIou, onSettleIou, onOpenBillModal }) => {
    return (
        <div className="h-full flex flex-col">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-5xl font-bold text-[#1A202C]">{hub.name}</h1>
                    <p className="text-gray-500 mt-2">A central place to manage your shared finances.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex -space-x-4">
                        {hub.members.slice(0, 3).map(member => (
                            <img key={member.id} src={member.avatarUrl} alt={member.name} className="w-12 h-12 rounded-full border-2 border-white ring-2 ring-gray-200" />
                        ))}
                        {hub.members.length > 3 && (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 border-2 border-white ring-2 ring-gray-200">
                                +{hub.members.length - 3}
                            </div>
                        )}
                    </div>
                     <button
                        onClick={onManageMembers}
                        className="flex items-center space-x-2 bg-purple-600 text-white font-bold py-3 px-5 rounded-xl hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/40"
                    >
                        <UsersIcon className="w-6 h-6" />
                        <span>Manage Members</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto pr-4 -mr-4">
                <div className="lg:col-span-2">
                    <IouTrackerWidget 
                        ious={hub.ious}
                        members={hub.members}
                        onAddIou={onAddIou}
                        onSettleIou={onSettleIou}
                    />
                </div>
                <div>
                    <SharedBillsWidget 
                        bills={bills}
                        members={hub.members}
                        onOpenBillModal={onOpenBillModal}
                    />
                </div>
            </div>
        </div>
    );
};

export default FamilyFinancePage;