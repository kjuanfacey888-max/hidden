import React, { useState, useEffect, useRef } from 'react';
import type { Conversation, ChatMessage } from '../types';
import { SnowflakeIcon, UserIcon, StarIcon, MessageSquareIcon, SearchIcon, MicIcon } from './icons';

interface AiChatPageProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    currentResponse: string;
    isLoading: boolean;
    onSendMessage: (message: string) => void;
    onSelectConversation: (id: string) => void;
    onNewConversation: () => void;
}

const ChatHistorySidebar: React.FC<{
    conversations: Conversation[];
    activeId: string | null;
    onNew: () => void;
    onSelect: (id: string) => void;
}> = ({ conversations, activeId, onNew, onSelect }) => {
    const favorites = conversations.filter(c => c.favorite);
    const recents = conversations.filter(c => !c.favorite);

    return (
        <aside className="w-80 bg-gray-50/50 border-r border-gray-200 flex flex-col p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Home</h2>
            </div>
            <button
                onClick={onNew}
                className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
                New Chat
            </button>
            <div className="flex-1 mt-6 overflow-y-auto space-y-4">
                {favorites.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Favorites</h3>
                        <div className="space-y-1">
                            {favorites.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => onSelect(c.id)}
                                    className={`w-full text-left flex items-center space-x-3 p-2 rounded-lg transition-colors ${activeId === c.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                                >
                                    <StarIcon className="w-4 h-4 text-yellow-500" />
                                    <span className="font-semibold text-gray-700 truncate">{c.title}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                )}
                 <section>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Recent Chats</h3>
                    <div className="space-y-1">
                        {recents.map(c => (
                            <button
                                key={c.id}
                                onClick={() => onSelect(c.id)}
                                className={`w-full text-left flex items-center space-x-3 p-2 rounded-lg transition-colors ${activeId === c.id ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                            >
                                <MessageSquareIcon className="w-4 h-4 text-gray-400" />
                                <span className="font-semibold text-gray-600 truncate">{c.title}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </aside>
    );
};

const AiChatPage: React.FC<AiChatPageProps> = ({ conversations, activeConversationId, currentResponse, isLoading, onSendMessage, onSelectConversation, onNewConversation }) => {
    const [input, setInput] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const activeConversation = conversations.find(c => c.id === activeConversationId);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeConversation?.messages, currentResponse]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        if (!isLoading) {
            onSendMessage(suggestion);
        }
    };

    const suggestions = {
        "Stock Market Updates": "Give me the latest stock market updates and trends.",
        "Budget Review": "Give me a summary of my spending this month and suggest areas for improvement.",
        "Savings Tips": "What are three creative ways I can save more money based on my spending habits?",
    };

    const WelcomeView = () => (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 mb-4"></div>
            <p className="text-sm font-semibold text-gray-500">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <h1 className="text-4xl font-bold text-gray-800 mt-2">What's on your mind today?</h1>
            
            <form onSubmit={handleSubmit} className="w-full max-w-2xl mt-8 relative">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask anything"
                    className="w-full pl-14 pr-28 py-5 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-purple-500 shadow-sm"
                    disabled={isLoading}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                    <button type="button" className="p-2 text-gray-500 hover:text-purple-600"><MicIcon className="w-5 h-5" /></button>
                    <button type="submit" disabled={isLoading || !input.trim()} className="w-10 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 disabled:opacity-50">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </form>
            
            <div className="w-full max-w-4xl mt-12">
                 <h2 className="text-xl font-bold text-gray-800 mb-4 text-left">Quick generate</h2>
                 <div className="grid grid-cols-3 gap-4">
                     {Object.entries(suggestions).map(([title, prompt]) => (
                         <button key={title} onClick={() => handleSuggestionClick(prompt)} className="text-left p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all">
                             <h3 className="font-bold text-gray-800">{title}</h3>
                             <p className="text-sm text-gray-500 mt-1">{prompt.substring(0, 50)}...</p>
                         </button>
                     ))}
                 </div>
            </div>
        </div>
    );
    
    const ChatView = () => (
        <div className="h-full flex flex-col">
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                 {(activeConversation?.messages || []).map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.speaker === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.speaker === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                            {msg.speaker === 'ai' ? <SnowflakeIcon className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
                        </div>
                        <div className={`py-3 px-4 rounded-2xl max-w-xl ${msg.speaker === 'ai' ? 'bg-gray-100 text-gray-800 rounded-bl-none' : 'bg-purple-600 text-white rounded-br-none'}`}>
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {currentResponse && (
                     <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-600">
                            <SnowflakeIcon className="w-5 h-5" />
                        </div>
                        <div className="py-3 px-4 rounded-2xl max-w-xl bg-gray-100 text-gray-800 rounded-bl-none">
                            <p className="whitespace-pre-wrap">{currentResponse}<span className="inline-block w-2 h-4 bg-gray-700 animate-pulse ml-1"></span></p>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
             <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200">
                <div className="relative">
                     <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
                        placeholder="Ask a follow-up..."
                        className="w-full p-4 pr-24 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 resize-none"
                        rows={1}
                        disabled={isLoading}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                        <button type="submit" disabled={isLoading || !input.trim()} className="w-10 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center hover:bg-orange-600 disabled:opacity-50">
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );

    return (
        <div className="h-full flex bg-white rounded-2xl">
            <ChatHistorySidebar 
                conversations={conversations}
                activeId={activeConversationId}
                onNew={onNewConversation}
                onSelect={onSelectConversation}
            />
            <main className="flex-1 relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50 opacity-30"></div>
                 <div className="relative h-full">
                    {activeConversationId ? <ChatView /> : <WelcomeView />}
                </div>
            </main>
        </div>
    );
};

export default AiChatPage;