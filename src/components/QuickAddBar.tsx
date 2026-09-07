import React from 'react';
import { Plus, Coffee, Utensils, ShoppingBag, Zap, Fuel, Sparkles, Coins, TrendingUp, MinusCircle } from 'lucide-react';
import { Category, Currency, FinanceMode } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';

interface QuickAddBarProps {
  categories: Category[];
  currency: Currency;
  financeMode?: FinanceMode;
  onQuickAdd: (amount: number, categoryId: string, merchant: string) => void;
  onOpenAddExpense: () => void;
  onOpenAddCapital?: (initialTab?: 'add' | 'reduce' | 'base' | 'history') => void;
  onQuickAddCapital?: (amount: number, description: string) => void;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({
  categories,
  currency,
  financeMode = 'personal',
  onQuickAdd,
  onOpenAddExpense,
  onOpenAddCapital,
  onQuickAddCapital,
}) => {
  const { t } = useLanguage();
  const isBusiness = financeMode === 'business';

  const foodCat =
    categories.find(
      (c) =>
        c.name.toLowerCase().includes('food') ||
        c.name.toLowerCase().includes('alimentación') ||
        c.name.toLowerCase().includes('insumos') ||
        c.name.toLowerCase().includes('proveedores')
    ) || categories[0];

  const entCat =
    categories.find(
      (c) =>
        c.name.toLowerCase().includes('entertainment') ||
        c.name.toLowerCase().includes('ocio') ||
        c.name.toLowerCase().includes('marketing')
    ) ||
    categories[1] ||
    categories[0];

  const utilCat =
    categories.find(
      (c) =>
        c.name.toLowerCase().includes('util') ||
        c.name.toLowerCase().includes('servicios') ||
        c.name.toLowerCase().includes('oficina')
    ) ||
    categories[2] ||
    categories[0];

  const expensePresets = isBusiness
    ? [
        { label: t('quickAdd.delivery'), amount: 15.0, cat: utilCat, icon: ShoppingBag },
        { label: t('quickAdd.workLunch'), amount: 35.0, cat: foodCat, icon: Utensils },
        { label: t('quickAdd.software'), amount: 29.0, cat: utilCat, icon: Zap },
        { label: t('quickAdd.transitBiz'), amount: 40.0, cat: utilCat, icon: Fuel },
      ].filter((p) => p.cat)
    : [
        { label: t('quickAdd.coffee'), amount: 4.5, cat: foodCat, icon: Coffee },
        { label: t('quickAdd.lunch'), amount: 15.0, cat: foodCat, icon: Utensils },
        { label: t('quickAdd.groceries'), amount: 45.0, cat: foodCat, icon: ShoppingBag },
        { label: t('quickAdd.streaming'), amount: 12.99, cat: entCat, icon: Sparkles },
        { label: t('quickAdd.transit'), amount: 5.0, cat: utilCat, icon: Fuel },
      ].filter((p) => p.cat);

  const capitalSalePresets = isBusiness
    ? [
        { label: t('quickAdd.saleStore'), amount: 50 },
        { label: t('quickAdd.saleOnline'), amount: 120 },
        { label: t('quickAdd.saleInvoice'), amount: 300 },
      ]
    : [
        { label: t('quickAdd.extraSale'), amount: 30 },
        { label: t('quickAdd.freelance'), amount: 100 },
        { label: t('quickAdd.bonusTip'), amount: 50 },
      ];

  return (
    <div className="bg-zinc-900/90 rounded-2xl p-3 sm:p-3.5 border border-zinc-800 shadow-md flex items-center justify-between gap-3 overflow-hidden text-zinc-100 w-full max-w-full">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">{t('quickAdd.title')}</span>
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-0.5 scrollbar-none touch-pan-x flex-1">
        {/* Quick Capital / Sales Addition Buttons */}
        {onQuickAddCapital &&
          capitalSalePresets.map((preset, idx) => (
            <button
              key={`sale-${idx}`}
              onClick={() => onQuickAddCapital(preset.amount, preset.label)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all shrink-0 active:scale-95 cursor-pointer shadow-xs ${
                isBusiness
                  ? 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-800/80 hover:border-indigo-600'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-800/80 hover:border-emerald-600'
              }`}
              title={`+${preset.label} (+${formatCurrency(preset.amount, currency)})`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{preset.label}</span>
              <span className="font-extrabold text-white">
                +{formatCurrency(preset.amount, currency)}
              </span>
            </button>
          ))}

        {/* Custom Sale / Add Capital Button */}
        {onOpenAddCapital && (
          <>
            <button
              onClick={() => onOpenAddCapital('add')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm transition-all shrink-0 active:scale-95 cursor-pointer ${
                isBusiness
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>{isBusiness ? t('quickAdd.addSale') : t('quickAdd.addIncome')}</span>
            </button>

            <button
              onClick={() => onOpenAddCapital('reduce')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 shadow-xs transition-all shrink-0 active:scale-95 cursor-pointer"
              title={t('capital.reduceReasonPlaceholder')}
            >
              <MinusCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>{t('quickAdd.deduct')}</span>
            </button>
          </>
        )}

        <div className="h-5 w-px bg-zinc-800 shrink-0 mx-0.5" />

        {/* Expense Presets */}
        {expensePresets.map((preset, idx) => {
          const Icon = preset.icon;
          return (
            <button
              key={idx}
              onClick={() => onQuickAdd(preset.amount, preset.cat.id, preset.label)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-all shrink-0 active:scale-95 cursor-pointer"
            >
              <Icon className="w-3.5 h-3.5 text-zinc-400" />
              <span>{preset.label}</span>
              <span className="font-bold text-zinc-200 ml-0.5">
                -{formatCurrency(preset.amount, currency)}
              </span>
            </button>
          );
        })}

        <button
          onClick={onOpenAddExpense}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 shadow-xs transition-all shrink-0 active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-zinc-400" />
          <span>{t('quickAdd.customExpense')}</span>
        </button>
      </div>
    </div>
  );
};
