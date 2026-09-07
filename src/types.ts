export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'it' | 'ja' | 'zh' | 'id';

export type FinanceMode = 'personal' | 'business';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  pin?: string;
  avatarColor: string;
  avatarEmoji?: string;
  preferredMode: FinanceMode;
  createdAt: number;
  lastLoginAt: number;
}

export type CapitalSourceType =
  | 'capital'
  | 'salary'
  | 'investment'
  | 'project'
  | 'extra'
  | 'budget'
  | 'custom';

export interface CapitalAddition {
  id: string;
  amount: number;
  description: string;
  date: string; // YYYY-MM-DD
  mode?: FinanceMode; // 'personal' | 'business'
  categorySource?: string;
  createdAt: number;
}

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export type CategoryIconName =
  | 'Utensils'
  | 'Home'
  | 'Zap'
  | 'Film'
  | 'PiggyBank'
  | 'Car'
  | 'ShoppingBag'
  | 'HeartPulse'
  | 'GraduationCap'
  | 'Plane'
  | 'Coffee'
  | 'Smartphone'
  | 'Gift'
  | 'Briefcase'
  | 'Gamepad2'
  | 'ShieldAlert'
  | 'Building2'
  | 'Users'
  | 'Receipt'
  | 'Scale'
  | 'TrendingUp'
  | 'Coins'
  | 'FileSpreadsheet'
  | 'Megaphone'
  | 'Truck'
  | 'Cpu'
  | 'Layers'
  | 'Landmark'
  | 'ShieldCheck'
  | 'DollarSign'
  | 'Calculator'
  | 'Store'
  | 'Package';

export type AccountingType =
  | 'general'
  | 'cogs' // Cost of Goods Sold / Proveedores
  | 'opex' // Operating Expenses
  | 'payroll' // Sueldos y Nómina
  | 'taxes' // Impuestos & Retenciones
  | 'profit' // Ganancia Neta / Utilidad
  | 'marketing' // Publicidad y Ventas
  | 'reserve' // Fondo de Reserva
  | 'needs' // Personal Needs
  | 'wants' // Personal Wants
  | 'savings'; // Personal Savings

export interface Category {
  id: string;
  name: string;
  percentage: number; // e.g. 50 for 50%
  color: string; // Hex color code
  icon: CategoryIconName;
  description?: string;
  isCustom?: boolean;
  accountingType?: AccountingType;
  mode?: FinanceMode;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string; // YYYY-MM-DD
  merchant: string;
  note?: string;
  paymentMethod?: 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Other';
  tags?: string[];
  createdAt: number;
  mode?: FinanceMode;
  invoiceNumber?: string;
  isTaxDeductible?: boolean;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  position: 'prefix' | 'suffix';
}

export type AlertLevel = 'safe' | 'warning' | 'limit' | 'exceeded';

export interface CategoryAlert {
  categoryId: string;
  categoryName: string;
  color: string;
  icon: CategoryIconName;
  level: AlertLevel;
  spent: number;
  budget: number;
  percentageSpent: number; // spent / budget * 100
  percentageOfIncome: number;
  overAmount: number;
  message: string;
}

export interface BudgetPreset {
  id: string;
  name: string;
  description: string;
  mode?: FinanceMode;
  allocations: Record<string, number>; // categoryName -> percentage
}

export interface AlertSettings {
  warningThreshold: number; // e.g., 80%
  dangerThreshold: number; // e.g., 100%
  enableSound: boolean;
  enableBanner: boolean;
}

