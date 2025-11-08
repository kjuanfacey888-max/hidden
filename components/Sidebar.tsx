import React from 'react';
import { LogoIcon, GridIcon, SettingsIcon, FilterIcon, LocationIcon, UserIcon, WalletIcon, BrainIcon, SlidersIcon, CalendarIcon, ShieldIcon, TrendingUpIcon, FileTextIcon } from './icons';

const NavItem: React.FC<{
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}> = ({ children, active, onClick }) => {
  return (
    <div className="relative flex justify-center items-center py-4">
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-purple-600 rounded-r-full transition-all duration-300"></div>}
      <div onClick={onClick} className={`cursor-pointer transition-all duration-300 ${active ? 'text-purple-600' : 'text-gray-400 hover:text-purple-500'}`}>
        {children}
      </div>
    </div>
  );
};

type View = 'dashboard' | 'categories' | 'wallet' | 'automations' | 'calendar' | 'credit' | 'stocks' | 'ai-chat' | 'settings' | 'stock-detail' | 'profile' | 'tax';

interface SidebarProps {
  onNavigate: (view: View) => void;
  currentView: View;
  avatarUrl: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentView, avatarUrl }) => {
    
  return (
    <aside className="bg-white w-28 flex flex-col items-center justify-between py-10 px-4 shrink-0">
      <div className="flex flex-col items-center space-y-8">
        <div className="cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <LogoIcon />
        </div>
        <div className="space-y-4">
          <NavItem onClick={() => onNavigate('categories')} active={currentView === 'categories'}><GridIcon className="w-7 h-7" /></NavItem>
          <NavItem onClick={() => onNavigate('automations')} active={currentView === 'automations'}><SlidersIcon className="w-7 h-7" /></NavItem>
          <NavItem onClick={() => onNavigate('calendar')} active={currentView === 'calendar'}><CalendarIcon className="w-7 h-7" /></NavItem>
          <NavItem onClick={() => onNavigate('credit')} active={currentView === 'credit'}><ShieldIcon className="w-7 h-7" /></NavItem>
          <NavItem onClick={() => onNavigate('stocks')} active={currentView === 'stocks' || currentView === 'stock-detail'}><TrendingUpIcon className="w-7 h-7" /></NavItem>
          <NavItem onClick={() => onNavigate('tax')} active={currentView === 'tax'}><FileTextIcon className="w-7 h-7" /></NavItem>
          <NavItem onClick={() => onNavigate('settings')} active={currentView === 'settings'}><SettingsIcon className="w-7 h-7" /></NavItem>
          <NavItem active={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')}><LocationIcon className="w-7 h-7" /></NavItem>
          <NavItem onClick={() => onNavigate('wallet')} active={currentView === 'wallet'}><WalletIcon className="w-7 h-7" /></NavItem>
          <NavItem onClick={() => onNavigate('ai-chat')} active={currentView === 'ai-chat'}><BrainIcon className="w-7 h-7"/></NavItem>
        </div>
      </div>
      <div className="cursor-pointer" onClick={() => onNavigate('profile')}>
        <img src={avatarUrl} alt="User" className="w-14 h-14 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110" />
      </div>
    </aside>
  );
};

export default Sidebar;