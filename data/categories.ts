
import type { BudgetCategory } from '../types';
import {
  HomeIcon,
  WifiIcon,
  CarIcon,
  GroceriesIcon,
  HealthIcon,
  CoffeeIcon,
  FilmIcon,
  ShoppingBagIcon,
  PlaneIcon,
  PiggyBankIcon,
  CreditCardIcon,
  GiftIcon,
  DollarSignIcon
} from '../components/icons';

export const initialCategoriesData: BudgetCategory[] = [
  // --- NEEDS ---
  {
    id: 'housing-rent',
    name: 'Rent / Mortgage',
    spent: 1250,
    goal: 1250,
    Icon: HomeIcon,
    color: '#4A5568', // gray-700
    pacing: 'danger',
    transactions: [],
    isShortcut: false,
    mainCategory: 'Needs',
  },
  {
    id: 'utils-internet',
    name: 'Internet',
    spent: 46.80,
    goal: 60,
    Icon: WifiIcon,
    color: '#ED8936', // orange-400
    pacing: 'good',
    transactions: [{ id: 't5', description: 'Internet Provider', amount: 46.80, date: '2024-07-15' }],
    isShortcut: true,
    mainCategory: 'Needs',
  },
  {
    id: 'transport-gas',
    name: 'Gas / Fuel',
    spent: 94.00,
    goal: 150,
    Icon: CarIcon,
    color: '#F6E05E', // yellow-300
    pacing: 'warning',
    transactions: [
        { id: 't6', description: 'Gas Station', amount: 55.00, date: '2024-07-27' },
        { id: 't7', description: 'Shell', amount: 39.00, date: '2024-07-22' },
    ],
    isShortcut: true,
    mainCategory: 'Needs',
  },
  {
    id: 'food-groceries',
    name: 'Groceries',
    spent: 485.50,
    goal: 600,
    Icon: GroceriesIcon,
    color: '#805AD5', // purple-600
    pacing: 'danger',
    transactions: [
        { id: 't1', description: 'SuperMart', amount: 85.20, date: '2024-07-28' },
        { id: 't2', description: 'Local Farmer\'s Market', amount: 45.00, date: '2024-07-26' },
        { id: 't3', description: 'Corner Store', amount: 12.75, date: '2024-07-25' },
    ],
    isShortcut: true,
    mainCategory: 'Needs',
  },
  {
    id: 'health-pharmacy',
    name: 'Health & Wellness',
    spent: 55.20,
    goal: 100,
    Icon: HealthIcon,
    color: '#F56565', // red-500
    pacing: 'good',
    transactions: [],
    isShortcut: false,
    mainCategory: 'Needs',
  },
  
  // --- WANTS ---
  {
    id: 'dining-restaurants',
    name: 'Restaurants',
    spent: 124.50,
    goal: 200,
    Icon: CoffeeIcon,
    color: '#48BB78', // green-500
    pacing: 'warning',
    transactions: [],
    isShortcut: false,
    mainCategory: 'Wants',
  },
  {
    id: 'entertainment-streaming',
    name: 'Streaming Services',
    spent: 29.98,
    goal: 30,
    Icon: FilmIcon,
    color: '#38B2AC', // teal-500
    pacing: 'danger',
    transactions: [],
    isShortcut: false,
    mainCategory: 'Wants',
  },
  {
    id: 'shopping-clothes',
    name: 'Shopping',
    spent: 78.00,
    goal: 150,
    Icon: ShoppingBagIcon,
    color: '#4299E1', // blue-500
    pacing: 'good',
    transactions: [],
    isShortcut: false,
    mainCategory: 'Wants',
  },
  {
    id: 'travel-vacation',
    name: 'Travel',
    spent: 0,
    goal: 1000,
    Icon: PlaneIcon,
    color: '#0BC5EA', // cyan-500
    pacing: 'good',
    transactions: [],
    isShortcut: false,
    mainCategory: 'Wants',
  },
  
  // --- FINANCIAL GOALS ---
  {
    id: 'savings-emergency',
    name: 'Emergency Fund',
    spent: 250,
    goal: 250,
    Icon: PiggyBankIcon,
    color: '#3182CE', // blue-600
    pacing: 'danger',
    transactions: [],
    isShortcut: false,
    mainCategory: 'Financial Goals',
  },
  {
    id: 'debt-creditcard',
    name: 'Credit Card Paydown',
    spent: 400,
    goal: 400,
    Icon: CreditCardIcon,
    color: '#2B6CB0', // blue-700
    pacing: 'danger',
    transactions: [],
    isShortcut: false,
    mainCategory: 'Financial Goals',
  },
  
  // --- MISC ---
  {
    id: 'misc-gifts',
    name: 'Gifts & Celebrations',
    spent: 50,
    goal: 100,
    Icon: GiftIcon,
    color: '#ED64A6', // pink-500
    pacing: 'good',
    transactions: [],
    isShortcut: false,
    mainCategory: 'Miscellaneous',
  },
  {
    id: 'misc-donations',
    name: 'Donations',
    spent: 25,
    goal: 50,
    Icon: DollarSignIcon,
    color: '#A0AEC0', // gray-500
    pacing: 'good',
    transactions: [],
    isShortcut: false,
    mainCategory: 'Miscellaneous',
  },
];