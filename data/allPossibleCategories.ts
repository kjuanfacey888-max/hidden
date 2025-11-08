import type { PossibleCategory } from '../types';
import {
  HomeIcon, WifiIcon, CarIcon, GroceriesIcon, HealthIcon, CoffeeIcon,
  FilmIcon, ShoppingBagIcon, PlaneIcon, PiggyBankIcon, CreditCardIcon,
  GiftIcon, DollarSignIcon, UserIcon, WalletIcon, LightbulbIcon,
  SavingsIcon, BillsIcon, ZapIcon
} from '../components/icons';

export const allPossibleCategories: PossibleCategory[] = [
  // Needs
  { name: 'Rent / Mortgage', mainCategory: 'Needs', Icon: HomeIcon, color: '#4A5568', iconName: 'HomeIcon' },
  { name: 'Property Taxes / HOA Fees', mainCategory: 'Needs', Icon: HomeIcon, color: '#4A5568', iconName: 'HomeIcon' },
  { name: 'Home Insurance', mainCategory: 'Needs', Icon: HomeIcon, color: '#4A5568', iconName: 'HomeIcon' },
  { name: 'Repairs & Maintenance', mainCategory: 'Needs', Icon: HomeIcon, color: '#4A5568', iconName: 'HomeIcon' },
  { name: 'Furnishings / Home Goods', mainCategory: 'Needs', Icon: HomeIcon, color: '#4A5568', iconName: 'HomeIcon' },
  { name: 'Electricity / Gas', mainCategory: 'Needs', Icon: ZapIcon, color: '#ECC94B', iconName: 'ZapIcon' },
  { name: 'Water / Sewage', mainCategory: 'Needs', Icon: LightbulbIcon, color: '#4299E1', iconName: 'LightbulbIcon' },
  { name: 'Internet / Cable', mainCategory: 'Needs', Icon: WifiIcon, color: '#ED8936', iconName: 'WifiIcon' },
  { name: 'Mobile Phone', mainCategory: 'Needs', Icon: WifiIcon, color: '#ED8936', iconName: 'WifiIcon' },
  { name: 'Waste Disposal (Trash)', mainCategory: 'Needs', Icon: HomeIcon, color: '#A0AEC0', iconName: 'HomeIcon' },
  { name: 'Car Payment / Lease', mainCategory: 'Needs', Icon: CarIcon, color: '#F6E05E', iconName: 'CarIcon' },
  { name: 'Gas / Fuel', mainCategory: 'Needs', Icon: CarIcon, color: '#F6E05E', iconName: 'CarIcon' },
  { name: 'Auto Insurance', mainCategory: 'Needs', Icon: CarIcon, color: '#F6E05E', iconName: 'CarIcon' },
  { name: 'Public Transit', mainCategory: 'Needs', Icon: CarIcon, color: '#F6E05E', iconName: 'CarIcon' },
  { name: 'Car Maintenance & Repairs', mainCategory: 'Needs', Icon: CarIcon, color: '#F6E05E', iconName: 'CarIcon' },
  { name: 'Parking / Tolls', mainCategory: 'Needs', Icon: CarIcon, color: '#F6E05E', iconName: 'CarIcon' },
  { name: 'Groceries', mainCategory: 'Needs', Icon: GroceriesIcon, color: '#805AD5', iconName: 'GroceriesIcon' },
  { name: 'Household Supplies', mainCategory: 'Needs', Icon: GroceriesIcon, color: '#805AD5', iconName: 'GroceriesIcon' },
  { name: 'Pet Food & Supplies', mainCategory: 'Needs', Icon: GroceriesIcon, color: '#805AD5', iconName: 'GroceriesIcon' },
  { name: 'Baby Supplies', mainCategory: 'Needs', Icon: GroceriesIcon, color: '#805AD5', iconName: 'GroceriesIcon' },
  { name: 'Health Insurance Premiums', mainCategory: 'Needs', Icon: HealthIcon, color: '#F56565', iconName: 'HealthIcon' },
  { name: 'Doctor / Dental Visits', mainCategory: 'Needs', Icon: HealthIcon, color: '#F56565', iconName: 'HealthIcon' },
  { name: 'Medication / Pharmacy', mainCategory: 'Needs', Icon: HealthIcon, color: '#F56565', iconName: 'HealthIcon' },
  { name: 'Essential Self-Care', mainCategory: 'Needs', Icon: HealthIcon, color: '#F56565', iconName: 'HealthIcon' },
  
  // Wants
  { name: 'Restaurants / Takeout', mainCategory: 'Wants', Icon: CoffeeIcon, color: '#48BB78', iconName: 'CoffeeIcon' },
  { name: 'Coffee Shops / Bars', mainCategory: 'Wants', Icon: CoffeeIcon, color: '#48BB78', iconName: 'CoffeeIcon' },
  { name: 'Streaming Services', mainCategory: 'Wants', Icon: FilmIcon, color: '#38B2AC', iconName: 'FilmIcon' },
  { name: 'Concerts / Events / Movies', mainCategory: 'Wants', Icon: FilmIcon, color: '#38B2AC', iconName: 'FilmIcon' },
  { name: 'Hobbies & Activities', mainCategory: 'Wants', Icon: SavingsIcon, color: '#38B2AC', iconName: 'SavingsIcon' },
  { name: 'Gaming / App Purchases', mainCategory: 'Wants', Icon: FilmIcon, color: '#38B2AC', iconName: 'FilmIcon' },
  { name: 'Clothing & Shoes', mainCategory: 'Wants', Icon: ShoppingBagIcon, color: '#4299E1', iconName: 'ShoppingBagIcon' },
  { name: 'Electronics', mainCategory: 'Wants', Icon: ShoppingBagIcon, color: '#4299E1', iconName: 'ShoppingBagIcon' },
  { name: 'Personal Care (Non-essential)', mainCategory: 'Wants', Icon: ShoppingBagIcon, color: '#4299E1', iconName: 'ShoppingBagIcon' },
  { name: 'Books / Magazines', mainCategory: 'Wants', Icon: ShoppingBagIcon, color: '#4299E1', iconName: 'ShoppingBagIcon' },
  { name: 'Flights / Accommodation', mainCategory: 'Wants', Icon: PlaneIcon, color: '#0BC5EA', iconName: 'PlaneIcon' },
  { name: 'Gas / Transportation (Travel)', mainCategory: 'Wants', Icon: PlaneIcon, color: '#0BC5EA', iconName: 'PlaneIcon' },
  { name: 'Sightseeing & Activities', mainCategory: 'Wants', Icon: PlaneIcon, color: '#0BC5EA', iconName: 'PlaneIcon' },

  // Financial Goals
  { name: 'Emergency Fund Contribution', mainCategory: 'Financial Goals', Icon: PiggyBankIcon, color: '#3182CE', iconName: 'PiggyBankIcon' },
  { name: 'Retirement Contributions', mainCategory: 'Financial Goals', Icon: PiggyBankIcon, color: '#3182CE', iconName: 'PiggyBankIcon' },
  { name: 'Brokerage / Stock Investments', mainCategory: 'Financial Goals', Icon: PiggyBankIcon, color: '#3182CE', iconName: 'PiggyBankIcon' },
  { name: 'Vacation Fund', mainCategory: 'Financial Goals', Icon: PiggyBankIcon, color: '#3182CE', iconName: 'PiggyBankIcon' },
  { name: 'Large Purchase Fund', mainCategory: 'Financial Goals', Icon: PiggyBankIcon, color: '#3182CE', iconName: 'PiggyBankIcon' },
  { name: 'Credit Card Principal Paydown', mainCategory: 'Financial Goals', Icon: CreditCardIcon, color: '#2B6CB0', iconName: 'CreditCardIcon' },
  { name: 'Student Loan Extra Payments', mainCategory: 'Financial Goals', Icon: CreditCardIcon, color: '#2B6CB0', iconName: 'CreditCardIcon' },
  { name: 'Personal Loan Payoff', mainCategory: 'Financial Goals', Icon: CreditCardIcon, color: '#2B6CB0', iconName: 'CreditCardIcon' },

  // Miscellaneous
  { name: 'Gifts / Celebrations', mainCategory: 'Miscellaneous', Icon: GiftIcon, color: '#ED64A6', iconName: 'GiftIcon' },
  { name: 'Charitable Donations', mainCategory: 'Miscellaneous', Icon: DollarSignIcon, color: '#A0AEC0', iconName: 'DollarSignIcon' },
  { name: 'Subscriptions (Non-Entertainment)', mainCategory: 'Miscellaneous', Icon: BillsIcon, color: '#A0AEC0', iconName: 'BillsIcon' },
  { name: 'Taxes', mainCategory: 'Miscellaneous', Icon: BillsIcon, color: '#A0AEC0', iconName: 'BillsIcon' },
  { name: 'Cash / ATM Withdrawals', mainCategory: 'Miscellaneous', Icon: WalletIcon, color: '#A0AEC0', iconName: 'WalletIcon' },
];