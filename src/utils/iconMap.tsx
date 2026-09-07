import React from 'react';
import {
  Utensils,
  Home,
  Zap,
  Film,
  PiggyBank,
  Car,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Plane,
  Coffee,
  Smartphone,
  Gift,
  Briefcase,
  Gamepad2,
  ShieldAlert,
  Building2,
  Users,
  Receipt,
  Scale,
  TrendingUp,
  Coins,
  FileSpreadsheet,
  Megaphone,
  Truck,
  Cpu,
  Layers,
  Landmark,
  ShieldCheck,
  DollarSign,
  Calculator,
  Store,
  Package,
  HelpCircle,
} from 'lucide-react';
import { CategoryIconName } from '../types';

export const ICON_MAP: Record<CategoryIconName, React.ElementType> = {
  Utensils,
  Home,
  Zap,
  Film,
  PiggyBank,
  Car,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Plane,
  Coffee,
  Smartphone,
  Gift,
  Briefcase,
  Gamepad2,
  ShieldAlert,
  Building2,
  Users,
  Receipt,
  Scale,
  TrendingUp,
  Coins,
  FileSpreadsheet,
  Megaphone,
  Truck,
  Cpu,
  Layers,
  Landmark,
  ShieldCheck,
  DollarSign,
  Calculator,
  Store,
  Package,
};

export function CategoryIcon({
  name,
  className = 'w-5 h-5',
}: {
  name: CategoryIconName | string;
  className?: string;
}) {
  const IconComponent = ICON_MAP[name as CategoryIconName] || HelpCircle;
  return <IconComponent className={className} />;
}

export const AVAILABLE_ICONS: { name: CategoryIconName; label: string; mode?: 'personal' | 'business' | 'both' }[] = [
  // Business Icons
  { name: 'Building2', label: 'Empresa / Oficinas', mode: 'business' },
  { name: 'Users', label: 'Nómina & Sueldos', mode: 'business' },
  { name: 'Receipt', label: 'Facturas & Proveedores', mode: 'business' },
  { name: 'TrendingUp', label: 'Crecimiento & Ventas', mode: 'business' },
  { name: 'Coins', label: 'Utilidad & Ganancias', mode: 'business' },
  { name: 'Landmark', label: 'Impuestos & Legal', mode: 'business' },
  { name: 'Megaphone', label: 'Marketing & Publicidad', mode: 'business' },
  { name: 'Truck', label: 'Logística & Envíos', mode: 'business' },
  { name: 'Store', label: 'Comercio / Tienda', mode: 'business' },
  { name: 'Package', label: 'Inventario / Mercancía', mode: 'business' },
  { name: 'Cpu', label: 'Software / Tecnología', mode: 'business' },
  { name: 'Scale', label: 'Contabilidad / Legal', mode: 'business' },
  { name: 'ShieldCheck', label: 'Fondo de Reserva', mode: 'business' },
  { name: 'Briefcase', label: 'Operaciones', mode: 'both' },
  { name: 'Calculator', label: 'Cálculo & Finanzas', mode: 'both' },
  { name: 'DollarSign', label: 'Caja & Flujo', mode: 'both' },
  // Personal Icons
  { name: 'Utensils', label: 'Alimentos & Super', mode: 'personal' },
  { name: 'Home', label: 'Vivienda & Renta', mode: 'personal' },
  { name: 'Zap', label: 'Servicios & Luz', mode: 'both' },
  { name: 'PiggyBank', label: 'Ahorro & Metas', mode: 'both' },
  { name: 'Car', label: 'Transporte & Auto', mode: 'both' },
  { name: 'Film', label: 'Entretenimiento', mode: 'personal' },
  { name: 'Gamepad2', label: 'Juegos & Ocio', mode: 'personal' },
  { name: 'ShoppingBag', label: 'Compras & Ropa', mode: 'personal' },
  { name: 'HeartPulse', label: 'Salud & Médico', mode: 'personal' },
  { name: 'Coffee', label: 'Café & Salidas', mode: 'personal' },
  { name: 'Smartphone', label: 'Telefonía & Gadgets', mode: 'both' },
  { name: 'Plane', label: 'Viajes & Vacaciones', mode: 'personal' },
  { name: 'GraduationCap', label: 'Educación & Cursos', mode: 'both' },
  { name: 'Gift', label: 'Regalos & Donaciones', mode: 'personal' },
  { name: 'ShieldAlert', label: 'Seguros & Emergencias', mode: 'both' },
];

export const AVAILABLE_COLORS = [
  '#10b981', // Emerald (Profit / Food)
  '#06b6d4', // Cyan
  '#3b82f6', // Electric Blue (Operations / Housing)
  '#6366f1', // Indigo (Payroll)
  '#8b5cf6', // Violet (Savings / Growth)
  '#d946ef', // Fuchsia
  '#ec4899', // Pink (Marketing / Leisure)
  '#f43f5e', // Rose
  '#ef4444', // Crimson Red (Taxes / Debt)
  '#f97316', // Orange
  '#f59e0b', // Amber / Gold (OPEX / Utilities)
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#14b8a6', // Teal
  '#2dd4bf', // Turquoise
  '#a855f7', // Purple
  '#fb7185', // Coral
  '#38bdf8', // Sky Blue
  '#4ade80', // Mint Green
  '#94a3b8', // Slate
];

