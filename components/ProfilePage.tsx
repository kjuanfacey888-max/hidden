import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { UploadIcon } from './icons';

interface ProfilePageProps {
    profile: UserProfile;
    onSave: (updatedProfile: UserProfile) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onSave }) => {
    const [formData, setFormData] = useState(profile);
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 3000);
    };

    return (
        <div className="h-full flex flex-col">
            <header className="mb-8">
                <h1 className="text-5xl font-bold text-[#1A202C]">My Profile</h1>
                <p className="text-gray-500 mt-2">Manage your personal information for account verification.</p>
            </header>

            <form id="profile-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-8">
                <div className="flex items-center space-x-6">
                    <div className="relative group">
                        <img src={formData.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                        <label htmlFor="avatar-upload" className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <UploadIcon className="w-8 h-8" />
                        </label>
                        <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">{formData.firstName} {formData.lastName}</h2>
                        <p className="text-gray-500">{formData.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="font-semibold text-gray-700">First Name</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                    </div>
                     <div>
                        <label className="font-semibold text-gray-700">Last Name</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Phone Number</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Date of Birth</label>
                        <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                    </div>
                    <div>
                        <label className="font-semibold text-gray-700">Social Security Number</label>
                        <input type="password" name="ssn" value={formData.ssn} onChange={handleChange} placeholder="•••••1234" className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                    </div>
                </div>
                
                <div>
                    <h3 className="text-xl font-bold mb-2">Address</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="col-span-2">
                             <label className="font-semibold text-gray-700">Street Address</label>
                             <input type="text" name="street" value={formData.address.street} onChange={handleAddressChange} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                         </div>
                         <div>
                             <label className="font-semibold text-gray-700">City</label>
                             <input type="text" name="city" value={formData.address.city} onChange={handleAddressChange} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                         </div>
                         <div>
                             <label className="font-semibold text-gray-700">State</label>
                             <input type="text" name="state" value={formData.address.state} onChange={handleAddressChange} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                         </div>
                         <div>
                             <label className="font-semibold text-gray-700">ZIP Code</label>
                             <input type="text" name="zip" value={formData.address.zip} onChange={handleAddressChange} className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500" />
                         </div>
                     </div>
                </div>

                 <div className="py-4">
                    {showConfirmation && (
                        <div className="text-green-600 font-semibold p-3 bg-green-50 rounded-md animate-fade-in-fast text-center">
                            Profile updated successfully!
                        </div>
                    )}
                 </div>

            </form>

            <div className="mt-auto pt-6 border-t border-gray-200 flex justify-end">
                <button type="submit" form="profile-form" className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all">
                    Save Profile
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;