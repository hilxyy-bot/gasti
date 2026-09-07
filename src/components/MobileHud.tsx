import React from 'react';
import { Plus, Coins, PieChart, Layers, ArrowUpRight, TrendingUp, Sparkles, LayoutDashboard } from 'lucide-react';
import { motion } from 'motion/react';
import { Currency, FinanceMode } from '../types';
import { formatCurrency } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { ViewMode } from './Navbar';

interface MobileHudProps {
  onAddExpense: () => void;
  onAddCapital: () => void;
  onOpenCategories: () => void;
  remaining: number;
  income: number;
  totalSpent: number;
  currency: Currency;
  financeMode: FinanceMode;
  viewMode: ViewMode;
  onSelectViewMode: (view: ViewMode) => void;
}

export const MobileHud: React.FC<MobileHudProps> = ({
  onAddExpense,
  onAddCapital,
  onOpenCategories,
  remaining,
  income,
  totalSpent,
  currency,
  financeMode,
  viewMode,
  onSelectViewMode,
}) => {
  const { t } = useLanguage();
  const isBusiness = financeMode === 'business';

  const spentPercent = income > 0 ? Math.min(100, Math.round((totalSpent / income) * 100)) : 0;
  const isOverBudget = remaining < 0;

  return (
    <nav
      aria-label="Mobile Navigation HUD"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/90 shadow-[0_-8px_30px_rgba(0,0,0,0.6)] px-3 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]"
    >
      {/* Mini Financial Glance Strip */}
      <div className="flex items-center justify-between px-2 pb-1.5 mb-1.5 border-b border-zinc-800/60 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-emerald-500" />
          <span className="text-zinc-400 font-medium">
            {isBusiness ? t('hud.availableCash') : t('hud.remaining')}:
          </span>
          <span
            className={`font-mono font-black ${
              isOverBudget ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {formatCurrency(remaining, currency)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-400">
          <span>{spentPercent}%</span>
          <div className="w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isOverBudget
                  ? 'bg-rose-500'
                  : spentPercent > 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, spentPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main HUD Action Controls */}
      <div className="grid grid-cols-5 items-center gap-1 text-center">
        {/* Tab 1: Dashboard / Status */}
        <button
          onClick={() => onSelectViewMode(viewMode === 'status' ? 'all' : 'status')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            viewMode === 'status' || viewMode === 'all'
              ? 'text-emerald-400'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">
            {viewMode === 'status' ? t('hud.status') : t('hud.viewAll')}
          </span>
        </button>

        {/* Tab 2: Categorías / Porcentajes */}
        <button
          onClick={() => onSelectViewMode('budget-percentages')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            viewMode === 'budget-percentages'
              ? 'text-emerald-400'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <PieChart className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">
            {t('hud.limits')}
          </span>
        </button>

        {/* Center Primary Action: + GASTO */}
        <div className="flex justify-center -mt-4">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={onAddExpense}
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-lg shadow-emerald-500/40 flex flex-col items-center justify-center border-2 border-zinc-950 cursor-pointer"
            title={t('nav.addExpense')}
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
            <span className="text-[9px] font-black uppercase tracking-tight -mt-0.5">
              {t('hud.spend')}
            </span>
          </motion.button>
        </div>

        {/* Tab 4: + Capital / Ventas */}
        <button
          onClick={onAddCapital}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-zinc-300 hover:text-amber-400 transition-all cursor-pointer"
          title={isBusiness ? t('nav.addSale') : t('nav.addIncome')}
        >
          <Coins className="w-4 h-4 mb-0.5 text-amber-400" />
          <span className="text-[10px] font-bold tracking-tight text-amber-300">
            {isBusiness ? t('hud.addSale') : t('hud.addCapital')}
          </span>
        </button>

        {/* Tab 5: Gráficos / Visuals */}
        <button
          onClick={() => onSelectViewMode('visuals')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            viewMode === 'visuals'
              ? 'text-emerald-400'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-bold tracking-tight">
            {t('hud.charts')}
          </span>
        </button>
      </div>
    </nav>
  );
};
