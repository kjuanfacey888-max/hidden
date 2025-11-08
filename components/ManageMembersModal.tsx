import React, { useState, useEffect } from 'react';
import { XIcon, UserIcon, PlusCircleIcon } from './icons';
import type { FamilyMember, FamilyMemberRole } from '../types';

interface ManageMembersModalProps {
    members: FamilyMember[];
    onAddMember: (name: string, role: FamilyMemberRole) => void;
    onClose: () => void;
}

const ManageMembersModal: React.FC<ManageMembersModalProps> = ({ members, onAddMember, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState<FamilyMemberRole>('Contributor');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (newName.trim()) {
            onAddMember(newName.trim(), newRole);
            setNewName('');
            setNewRole('Contributor');
        }
    };

    const roleColors: Record<FamilyMemberRole, string> = {
        'Co-Owner': 'bg-purple-100 text-purple-800',
        'Contributor': 'bg-blue-100 text-blue-800',
        'View-Only': 'bg-gray-100 text-gray-800',
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}>
            <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 m-4 transition-all duration-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors z-10"><XIcon className="w-6 h-6" /></button>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Manage Members</h2>
                <p className="text-gray-500 mb-6">Add or edit members of your financial hub.</p>

                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                    {members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                                <img src={member.avatarUrl} alt={member.name} className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <p className="font-bold text-gray-800">{member.name}</p>
                                </div>
                            </div>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${roleColors[member.role]}`}>{member.role}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleAdd} className="border-t pt-6 space-y-4">
                    <h3 className="font-bold text-lg text-gray-800">Add New Member</h3>
                    <div>
                        <label className="font-semibold text-gray-700">Name</label>
                        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g., Jane Doe" className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" required />
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Role</label>
                        <select value={newRole} onChange={e => setNewRole(e.target.value as FamilyMemberRole)} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-white">
                            <option value="Contributor">Contributor</option>
                            <option value="View-Only">View-Only</option>
                            <option value="Co-Owner">Co-Owner</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-700 transition-all duration-300 flex items-center justify-center space-x-2">
                        <PlusCircleIcon className="w-6 h-6" />
                        <span>Add Member</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageMembersModal;