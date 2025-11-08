import React, { useState } from 'react';
import type { AlpacaKeys } from '../types';

interface SettingsPageProps {
  onSave: (keys: AlpacaKeys) => void;
  initialKeys: AlpacaKeys | null;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onSave, initialKeys }) => {
  const [endpoint, setEndpoint] = useState(initialKeys?.endpoint || 'https://paper-api.alpaca.markets');
  const [key, setKey] = useState(initialKeys?.key || '');
  const [secret, setSecret] = useState(initialKeys?.secret || '');
  const [showSecret, setShowSecret] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim() && secret.trim() && endpoint.trim()) {
      onSave({ endpoint, key, secret });
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    } else {
      alert('Please fill in all API key fields.');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-5xl font-bold text-[#1A202C]">Settings</h1>
        <p className="text-gray-500 mt-2">Manage your application settings and integrations.</p>
      </header>
      
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Trading API Keys</h2>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-semibold text-gray-700">API Endpoint</label>
              <input 
                type="text" 
                value={endpoint} 
                onChange={e => setEndpoint(e.target.value)}
                className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 bg-gray-50"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Key</label>
              <input 
                type="text" 
                value={key} 
                onChange={e => setKey(e.target.value)}
                placeholder="e.g., AKBKSKQEF3WPNYVATMQHVKORZT"
                className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700">Secret</label>
              <div className="relative">
                <input 
                  type={showSecret ? 'text' : 'password'}
                  value={secret} 
                  onChange={e => setSecret(e.target.value)}
                  placeholder="e.g., D5sdNQx1MFZCeGR6ne1G19YHosyLN3RS1b2sjyBgGVQ"
                  className="w-full mt-1 p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Note: Your secret key is not stored after you leave this page. It is only held in memory for your current session.</p>
            </div>
            {showConfirmation && (
                <div className="text-green-600 font-semibold p-2 bg-green-50 rounded-md animate-fade-in-fast">
                    API Keys saved successfully for this session!
                </div>
            )}
            <div className="flex justify-between items-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowSecret(s => !s)}
                  className="font-semibold text-gray-600 hover:text-gray-900"
                >
                  {showSecret ? 'Hide Secret' : 'Show Secret'}
                </button>
              <button 
                type="submit"
                className="bg-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-purple-700 transition-all"
              >
                Save Keys
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;