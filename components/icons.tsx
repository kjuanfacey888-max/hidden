import React from 'react';

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`w-10 h-10 rounded-lg bg-orange-400 flex items-center justify-center font-bold text-white text-xl shadow-md ${className}`}>
      S
    </div>
);

export const GridIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

export const FilterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

export const LocationIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export const WalletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10.5V6.5C22 5.39543 21.1046 4.5 20 4.5H4C2.89543 4.5 2 5.39543 2 6.5V17.5C2 18.6046 2.89543 19.5 4 19.5H12"></path><path d="M16 19.5L16 14.5M16 14.5C17.6569 14.5 19 15.8431 19 17.5C19 19.1569 17.6569 20.5 16 20.5C14.3431 20.5 13 19.1569 13 17.5C13 15.8431 14.3431 14.5 16 14.5Z"></path>
  </svg>
);

export const BrainIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.4.6 2.6 1.5 3.5-1 .9-1.5 2.1-1.5 3.5 0 1.9 1.1 3.5 2.5 4.3.1.5.2 1 .2 1.5v.7c0 1.7 1.3 3 3 3s3-1.3 3-3v-.7c0-.5.1-1 .2-1.5 1.4-.8 2.5-2.4 2.5-4.3 0-1.4-.5-2.6-1.5-3.5.9-.9 1.5-2.1 1.5-3.5A4.5 4.5 0 0 0 12 2z"></path>
  </svg>
);

export const SlidersIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14"></line>
        <line x1="4" y1="10" x2="4" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12" y2="3"></line>
        <line x1="20" y1="21" x2="20" y2="16"></line>
        <line x1="20" y1="12" x2="20" y2="3"></line>
        <line x1="1" y1="14" x2="7" y2="14"></line>
        <line x1="9" y1="8" x2="15" y2="8"></line>
        <line x1="17" y1="16" x2="23" y2="16"></line>
    </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export const ZapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

export const MoreHorizontalIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

export const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

export const ExportIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
    <line x1="16" y1="3" x2="22" y2="9"></line>
    <polyline points="17 9 22 9 22 4"></polyline>
  </svg>
);

export const MicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
  </svg>
);

export const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

export const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L14.39 8.39L21 9.61L16.5 14.39L18 21L12 17.77L6 21L7.5 14.39L3 9.61L9.61 8.39L12 2z"></path>
    </svg>
);

export const CreditCardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
    </svg>
);

export const SavingsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
);

export const BillsIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);

export const WifiIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
        <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
    </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export const PinIcon: React.FC<{ className?: string, filled?: boolean }> = ({ className, filled }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

export const GripVerticalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="12" r="1"></circle>
        <circle cx="9" cy="5" r="1"></circle>
        <circle cx="9" cy="19" r="1"></circle>
        <circle cx="15" cy="12" r="1"></circle>
        <circle cx="15" cy="5" r="1"></circle>
        <circle cx="15" cy="19" r="1"></circle>
    </svg>
);

export const HomeIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
export const CarIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 16.5V15a2 2 0 0 0-4 0v1.5m6.5 2H3.5A1.5 1.5 0 0 1 2 17V7a1.5 1.5 0 0 1 1.5-1.5h17A1.5 1.5 0 0 1 22 7v10a1.5 1.5 0 0 1-1.5 1.5z"></path><line x1="6" y1="10" x2="6.01" y2="10"></line><line x1="18" y1="10" x2="18.01" y2="10"></line></svg>;
export const GroceriesIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
export const HealthIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L12 22"></path><path d="M19 9L5 9"></path></svg>;
export const CoffeeIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>;
export const FilmIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>;
export const ShoppingBagIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>;
export const PlaneIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4.5 21 3c-1.5-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 5.2 5.2c.3.3.8.4 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"></path></svg>;
export const PiggyBankIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>;
export const GiftIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>;
export const DollarSignIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
export const LightbulbIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18h6v-2.18c0-.6.31-1.16.82-1.45.5-.29.82-.86.82-1.47V9.4c0-2.21-1.79-4-4-4H9.36c-2.21 0-4 1.79-4 4v3.5c0 .6.32 1.17.82 1.47.5.28.82.85.82 1.45V18z"></path><line x1="12" y1="22" x2="12" y2="18"></line><path d="M10 15h4"></path></svg>;

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

// --- ADDED & FIXED ICONS ---

// Fix: Add missing UsersIcon for family/team features
export const UsersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

export const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

export const TrendingUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

export const FileTextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export const VisaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" role="img" aria-labelledby="pi-visa">
    <title id="pi-visa">Visa</title>
    <g fill="none">
      <path fill="#282828" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" opacity=".07"/>
      <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
      <path fill="#142688" d="M13.6 17.2h2.4l1.1-4.7-2.3-.1.9-3.8c.1-.3.4-.5.7-.5.2 0 .4 0 .5.1V8.1c-.2 0-.4 0-.6 0-.7 0-1.3.4-1.5.9-.1.2-.3.7-.3.7L13.6 17.2zm11.2-7.1h-2c-.3 0-.5.2-.6.4l-2.2 6.5h2.2c.4 0 .7.3.7.7 0 .1 0 .2-.1.3h-2.9c-.5 0-.9-.3-1.1-.7l-3.3-8.8c-.3-.8-1-1.3-1.8-1.3h-2.4c-.5 0-.9.3-1.1.7L9 17.2h2.4l.6-2.3h2.6l-.4 2.3h2.4l3.1-7.4-.4-1.2s-.1 0-.1.1zm-8.8 2.6l.8-3.5.3 1.2.9 4.6-2 .1zM3.4 8.1H.9c-.4 0-.7.3-.7.7v.2c0 .4.3.7.7.7h1.6l1.3 7.5h2.4l-2-9.1z"/>
    </g>
  </svg>
);

export const MastercardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="38" height="24" viewBox="0 0 38 24" role="img" aria-labelledby="pi-mastercard">
    <title id="pi-mastercard">Mastercard</title>
    <path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" opacity=".07"/>
    <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
    <circle fill="#EB001B" cx="15" cy="12" r="7"/>
    <circle fill="#F79E1B" cx="23" cy="12" r="7"/>
    <path fill="#FF5F00" d="M22 12c0 .9-.2 1.8-.5 2.6-.4.8-1 1.5-1.7 2.1-.7.6-1.5 1-2.4 1.3-.9.3-1.8.4-2.8.4-.9 0-1.8-.1-2.7-.4-.9-.3-1.7-.7-2.4-1.3-.7-.6-1.3-1.3-1.7-2.1-.4-.8-.6-1.7-.6-2.6 0-1.1.2-2.1.7-3.1.5-1 .9-1.9 1.4-2.7.5-.8 1.1-1.5 1.7-2.1.6-.6 1.4-1.1 2.2-1.5.8-.4 1.7-.6 2.6-.6.9 0 1.8.2 2.7.6.9.4 1.7.9 2.4 1.5.7.6 1.3 1.3 1.7 2.1.5.8.7 1.7.7 2.7zm-7.6 2.3c0-.1 0-.1 0 0-.5.2-.9.5-1.2.9-.3.4-.6.8-.7 1.3-.1.5-.2 1-.2 1.5 0 .1 0 .2 0 .2.5-.2.9-.5 1.2-.9.3-.4.6-.8.7-1.3.1-.5.2-1 .2-1.5.1-.2.1-.3 0-.2zm-2.1-1.8c.4.7.7 1.4.9 2.2.2.8.3 1.6.3 2.4 0 .1 0 .1 0 .2-.4-.7-.9-1.3-1.4-1.8-.5-.5-1.1-.9-1.8-1.2-.7-.3-1.4-.4-2.1-.4-.8 0-1.5.1-2.2.4-.7.3-1.4.6-1.9 1.1-.6.5-1.1 1.1-1.5 1.8-.4.7-.6 1.5-.7 2.3 0 .1 0 .1 0 .2.4-.7.8-1.3 1.3-1.8s1-.9 1.6-1.2c.6-.3 1.3-.5 2-.5.8 0 1.6.2 2.3.5.7.3 1.4.7 2 1.2.6.5 1.1 1.1 1.5 1.8.4.7.6 1.4.7 2.2 0 .1 0 .1 0 .1z"/>
  </svg>
);

export const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);
export const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
export const PowerIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
);
export const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
);

export const ArrowUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
);

export const ArrowDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
);

export const WorkflowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h2m0 0h2a2 2 0 0 0 2-2v-2a2 2 0 0 1 2-2h2M8 12V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4m0 0h-2a2 2 0 0 0-2 2v2a2 2 0 0 1-2 2H8m0 0H6a2 2 0 0 1-2-2v-2a2 2 0 0 0-2-2h0"></path></svg>
);

export const SnowflakeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
);

export const MessageSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);

export const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);

export const PlayIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

export const WandIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4V2m0 20v-2m5-13h2M2 11h2m12.2-2.8L19 5.4M4.9 19.1L7.8 16.2m0-8.4L4.9 5.4M19 18.6L16.2 15.8M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path></svg>
);

export const ArrowLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);

export const SyncIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
);

export const RepeatIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
);


// --- ALL OTHER MISSING ICONS AS PLACEHOLDERS ---
const PlaceholderIcon: React.FC<{ className?: string }> = ({ className }) => <div className={`w-full h-full bg-gray-200 rounded ${className}`} />;

export const AppleIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M16.5,13.62A3.33,3.33,0,0,1,19.83,17,3.33,3.33,0,0,1,16.5,20.33,3.33,3.33,0,0,1,13.17,17,3.33,3.33,0,0,1,16.5,13.62m0-11.2A5.43,5.43,0,0,1,22,7.85a5.29,5.29,0,0,1-5.08,5.4A5.36,5.36,0,0,1,12,7.77,5.33,5.33,0,0,1,16.5,2.42M13.88,1c-.69,0-1.33.31-1.89.89a3.84,3.84,0,0,0-1.2,2.83,4.4,4.4,0,0,0,1.3,3.3A3.87,3.87,0,0,0,14,9.25c.68,0,1.31-.3,1.88-.87a3.85,3.85,0,0,0,1.19-2.83,4.38,4.38,0,0,0-1.3-3.3A3.89,3.89,0,0,0,13.88,1Z" /></svg>;
export const MicrosoftIcon = PlaceholderIcon;
export const AmazonIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M20.2,12.51a.58.58,0,0,0-.5-.43H18.25V10.63a.58.58,0,0,0-.58-.58H16.22a.58.58,0,0,0-.58.58v1.45H14.19a.58.58,0,0,0-.58.58v1.45h-1.6a.58.58,0,0,0-.58.58v1.45H9.69a.58.58,0,0,0-.58.57v1.45H7.21a.58.58,0,0,0-.58.58v1.84a5.13,5.13,0,0,0,4.8,4.8,5.13,5.13,0,0,0,4.8-4.8.58.58,0,0,0-.58-.58h-1.9a.58.58,0,0,0-.58.58,1.84,1.84,0,0,1-3.68,0,.58.58,0,0,0-.58-.58H9.12a.58.58,0,0,1,0-1.15h1.84a.58.58,0,0,0,.58-.58V17.2h1.6a.58.58,0,0,0,.58-.58V15.17h1.45a.58.58,0,0,0,.58-.58V13.14h1.45a.58.58,0,0,0,.58-.58V11.11h1.45a.58.58,0,0,0,.43-.53V10.4a4.13,4.13,0,0,0-3.3-3.88A4.4,4.4,0,0,0,10.61,2a4.33,4.33,0,0,0-3,1.26,4.12,4.12,0,0,0-1.38,3.1A.58.58,0,0,0,6.81,7h1.6a.58.58,0,0,0,.58-.58,1.84,1.84,0,0,1,1.84-1.84,1.84,1.84,0,0,1,1.84,1.84.58.58,0,0,0,.58.58H15a.58.58,0,0,0,.58-.58A1.84,1.84,0,0,1,17.4,4.58a1.84,1.84,0,0,1,1.84,1.84.58.58,0,0,0,.58.58h.92A1.84,1.84,0,0,1,22,8.84,1.75,1.75,0,0,1,20.2,10.4Z" /></svg>;
export const MetaIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2c-.55,0-1,.45-1,1v2h3v3h-3v6.95C18.05,21.45,22,17.19,22,12Z" /></svg>;
export const JNJIcon = PlaceholderIcon;
export const JPMIcon = PlaceholderIcon;
export const WalmartIcon = PlaceholderIcon;
export const PGIcon = PlaceholderIcon;
export const UNHIcon = PlaceholderIcon;
export const HDIcon = PlaceholderIcon;
export const BACIcon = PlaceholderIcon;
export const VZIcon = PlaceholderIcon;
export const KOIcon = PlaceholderIcon;
export const PFEIcon = PlaceholderIcon;
export const DISIcon = PlaceholderIcon;
export const NKEIcon = PlaceholderIcon;
export const IBMIcon = PlaceholderIcon;
export const IntelIcon = PlaceholderIcon;
export const CiscoIcon = PlaceholderIcon;
export const OracleIcon = PlaceholderIcon;
export const SalesforceIcon = PlaceholderIcon;
export const PepsiCoIcon = PlaceholderIcon;
export const TMobileIcon = PlaceholderIcon;
export const ComcastIcon = PlaceholderIcon;
export const AmgenIcon = PlaceholderIcon;
export const BroadcomIcon = PlaceholderIcon;
export const CostcoIcon = PlaceholderIcon;
export const McDonaldIcon = PlaceholderIcon;
export const QualcommIcon = PlaceholderIcon;
export const TexasInstrumentsIcon = PlaceholderIcon;
export const GeneralElectricIcon = PlaceholderIcon;
export const FordIcon = PlaceholderIcon;
export const ATandTIcon = PlaceholderIcon;
export const ExxonMobilIcon = PlaceholderIcon;
export const ChevronIcon = PlaceholderIcon;
export const PfizerIcon = PlaceholderIcon;
export const BoeingIcon = PlaceholderIcon;
export const GoldmanSachsIcon = PlaceholderIcon;
export const CaterpillarIcon = PlaceholderIcon;
export const HomeDepotIcon = PlaceholderIcon;
export const LowesIcon = PlaceholderIcon;
export const TargetIcon = PlaceholderIcon;
export const UPSIcon = PlaceholderIcon;
export const FedExIcon = PlaceholderIcon;
export const StockIcon = PlaceholderIcon;
export const FreedomIcon = PlaceholderIcon;
export const AvalancheIcon = PlaceholderIcon;
export const LadderIcon = PlaceholderIcon;
export const ShieldCheckIcon = PlaceholderIcon;
export const BriefcaseIcon = PlaceholderIcon;
export const TaxGuardIcon = PlaceholderIcon;
export const SnowballIcon = PlaceholderIcon;
export const OptimizeIcon = PlaceholderIcon;
export const HomePlusIcon = PlaceholderIcon;
export const SinkingFundIcon = PlaceholderIcon;
export const ShopifyIcon = PlaceholderIcon;
export const TeslaIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M16.1,3.4l-1.3,4.3h3.4L14,14.6l3.7,0l-6.8,7l-1-7.9h-3.4L11.7,3.4H16.1z" /></svg>;
export const GoogleIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" /></svg>;
export const NvidiaIcon: React.FC<{ className?: string }> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M11.5,4.23L3.41,9.39V15.7L10.34,12V14.5L3.41,18.25V20.76L11.5,15.6V20.76L20.59,15.6V9.39L12.5,14.55V12L20.59,6.84V4.23L11.5,9.39V4.23Z" /></svg>;
export const AdobeIcon = PlaceholderIcon;
export const NetflixIcon = PlaceholderIcon;
export const StarbucksIcon = PlaceholderIcon;
export const BitcoinIcon = PlaceholderIcon;
export const EthereumIcon = PlaceholderIcon;
export const BNBIcon = PlaceholderIcon;

export const TransactionIconMap = {
    GroceriesIcon,
    CarIcon,
    CoffeeIcon,
    ShoppingBagIcon,
    ZapIcon,
    HomeIcon,
    HealthIcon,
    FilmIcon,
    PlaneIcon,
};

export const BillIconMap = {
    ZapIcon,
    WifiIcon,
    BillsIcon
};

export const IconMap: { [key: string]: React.FC<{ className?: string }> } = {
    GridIcon, SettingsIcon, FilterIcon, LocationIcon, UserIcon, WalletIcon, BrainIcon, SlidersIcon,
    CreditCardIcon, PiggyBankIcon, DollarSignIcon, HomeIcon, WifiIcon, CarIcon, GroceriesIcon,
    HealthIcon, CoffeeIcon, FilmIcon, ShoppingBagIcon, PlaneIcon, GiftIcon, LightbulbIcon,
    SavingsIcon, BillsIcon, ZapIcon, CalendarIcon, ShieldIcon, TrendingUpIcon, FileTextIcon,
    // Stocks
    AppleIcon, MicrosoftIcon, GoogleIcon, AmazonIcon, NvidiaIcon, MetaIcon, TeslaIcon, VisaIcon,
    MastercardIcon, JNJIcon, JPMIcon, WalmartIcon, PGIcon, UNHIcon, HDIcon, BACIcon, VZIcon,
    KOIcon, PFEIcon, DISIcon, NKEIcon, IBMIcon, IntelIcon, CiscoIcon, OracleIcon, SalesforceIcon,
    AdobeIcon, NetflixIcon, PepsiCoIcon, TMobileIcon, ComcastIcon, AmgenIcon, BroadcomIcon,
    CostcoIcon, McDonaldIcon, QualcommIcon, StarbucksIcon, TexasInstrumentsIcon, GeneralElectricIcon,
    FordIcon, ATandTIcon, ExxonMobilIcon, ChevronIcon, PfizerIcon, BoeingIcon, GoldmanSachsIcon,
    CaterpillarIcon, HomeDepotIcon, LowesIcon, TargetIcon, UPSIcon, FedExIcon, StockIcon,
    // Templates
    FreedomIcon, AvalancheIcon, LadderIcon, ShieldCheckIcon, BriefcaseIcon, TaxGuardIcon, SnowballIcon,
    OptimizeIcon, HomePlusIcon, SinkingFundIcon,
    // UI
    WorkflowIcon, CheckCircleIcon, WandIcon, BotIcon, PlayIcon, SyncIcon, RepeatIcon,
    // Crypto
    BitcoinIcon, EthereumIcon, BNBIcon
};