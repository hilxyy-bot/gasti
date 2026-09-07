import React from 'react';
import { Plus, ArrowRight, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, Tag } from 'lucide-react';
import { Category, Expense, Currency, CategoryAlert, FinanceMode } from '../types';
import { formatCurrency, calculateCategoryBudget } from '../utils/formatters';
import { CategoryIcon } from '../utils/iconMap';
import { CategoryColorPicker } from './CategoryColorPicker';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCategoryName } from '../utils/categoryLocalization';

interface CategoryProgressListProps {
  categories: Category[];
  expenses: Expense[];
  income: number;
  currency: Currency;
  alerts: CategoryAlert[];
  financeMode?: FinanceMode;
  onOpenAddExpense: (categoryId?: string) => void;
  onFilterByCategory: (categoryId: string) => void;
  selectedCategoryFilter: string | null;
  onUpdateCategoryPercentage?: (categoryId: string, percentage: number) => void;
  onUpdateCategoryColor?: (categoryId: string, color: string) => void;
}

export const CategoryProgressList: React.FC<CategoryProgressListProps> = ({
  categories,
  expenses,
  income,
  currency,
  alerts,
  financeMode = 'personal',
  onOpenAddExpense,
  onFilterByCategory,
  selectedCategoryFilter,
  onUpdateCategoryPercentage,
  onUpdateCategoryColor,
}) => {
  const { t, language } = useLanguage();
  const alertMap = new Map<string, CategoryAlert>(alerts.map((a) => [a.categoryId, a]));
  const isBusiness = financeMode === 'business';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
            {isBusiness
              ? (language === 'es' ? 'Categorías del Negocio' : 'Business Categories')
              : t('trackers.title')}
          </h2>
          <p className="text-xs text-zinc-400">
            {isBusiness
              ? (language === 'es' ? 'Control de gastos y presupuesto asignado a cada categoría.' : 'Track expenses and allocated budget for each category.')
              : t('trackers.subtitle')}
          </p>
        </div>
        {selectedCategoryFilter && (
          <button
            onClick={() => onFilterByCategory('')}
            className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${
              isBusiness
                ? 'text-indigo-400 hover:text-indigo-300 bg-indigo-950/80 border-indigo-800/80'
                : 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 border-emerald-800/80'
            }`}
          >
            {t('trackers.clearFilter')}
          </button>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/60">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border ${
            isBusiness
              ? 'bg-indigo-950/80 border-indigo-800/80 text-indigo-300'
              : 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400'
          }`}>
            <Plus className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-200">{t('trackers.emptyTitle')}</h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-md mx-auto leading-relaxed">
            {t('trackers.emptySubtitle')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categories.map((cat) => {
            const alert = alertMap.get(cat.id);
            const spent = alert ? alert.spent : 0;
            const budget = alert ? alert.budget : calculateCategoryBudget(income, cat.percentage);
            const percentSpent = budget > 0 ? (spent / budget) * 100 : 0;
            const remaining = Math.max(0, budget - spent);
            const isOver = spent > budget;
            const overAmount = isOver ? spent - budget : 0;
            const isSelected = selectedCategoryFilter === cat.id;

            let statusColor = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
            let statusText = `${(100 - percentSpent).toFixed(0)}% ${t('trackers.left')}`;
            let progressBarColor = 'bg-emerald-500';

            if (isOver) {
              statusColor = 'bg-rose-950/80 text-rose-400 border-rose-800/80';
              statusText = t('trackers.overBy', { amt: formatCurrency(overAmount, currency) });
              progressBarColor = 'bg-rose-500';
            } else if (percentSpent >= 100) {
              statusColor = 'bg-amber-950/80 text-amber-400 border-amber-800/80';
              statusText = t('trackers.limitReached');
              progressBarColor = 'bg-amber-500';
            } else if (percentSpent >= 80) {
              statusColor = 'bg-amber-950/80 text-amber-400 border-amber-800/80';
              statusText = `${percentSpent.toFixed(0)}% ${t('trackers.usedAlert')}`;
              progressBarColor = 'bg-amber-500';
            }

            return (
              <div
                key={cat.id}
                className={`bg-zinc-900/90 rounded-2xl p-4 border transition-all duration-200 hover:shadow-md flex flex-col justify-between text-zinc-100 ${
                  isSelected
                    ? isBusiness
                      ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-zinc-900'
                      : 'border-emerald-500 ring-2 ring-emerald-500/30 bg-zinc-900'
                    : isOver
                    ? 'border-rose-900/80 hover:border-rose-700'
                    : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div>
                  {/* Header row */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative">
                        {onUpdateCategoryColor ? (
                          <CategoryColorPicker
                            color={cat.color}
                            categoryName={getLocalizedCategoryName(cat, language)}
                            onChangeColor={(newColor) => onUpdateCategoryColor(cat.id, newColor)}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-md"
                            style={{ backgroundColor: cat.color }}
                          >
                            <CategoryIcon name={cat.icon} className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-sm text-white truncate">
                            {getLocalizedCategoryName(cat, language)}
                          </h4>
                          <CategoryIcon name={cat.icon} className="w-3.5 h-3.5 text-zinc-400" />
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded border ${
                            isBusiness
                              ? 'text-indigo-300 bg-zinc-950 border-zinc-800'
                              : 'text-emerald-400 bg-zinc-950 border-zinc-800'
                          }`}>
                            {cat.percentage}%
                          </span>
                          <span className="text-[11px] font-medium text-zinc-400">
                            = {formatCurrency(budget, currency)}
                          </span>
                          {onUpdateCategoryPercentage && (
                            <div className="inline-flex items-center ml-1 bg-zinc-950 rounded border border-zinc-800">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateCategoryPercentage(cat.id, Math.max(1, cat.percentage - 5));
                                }}
                                className="px-1 text-[10px] font-bold text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 cursor-pointer"
                                title="Decrease percentage by 5%"
                              >
                                -5%
                              </button>
                              <span className="text-zinc-700 text-[10px]">|</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateCategoryPercentage(cat.id, Math.min(100, cat.percentage + 5));
                                }}
                                className="px-1 text-[10px] font-bold text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 cursor-pointer"
                                title="Increase percentage by 5%"
                              >
                                +5%
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 text-[11px] font-bold rounded-md border shrink-0 ${statusColor}`}
                    >
                      {statusText}
                    </span>
                  </div>

                  {/* Spent vs Budget numbers */}
                  <div className="flex items-baseline justify-between mt-3 text-xs">
                    <div>
                      <span className="text-zinc-400">{t('trackers.spent')}: </span>
                      <span className="font-extrabold text-sm text-white">
                        {formatCurrency(spent, currency)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-400">{t('trackers.remaining')}: </span>
                      <span
                        className={`font-extrabold text-sm ${
                          isOver ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {isOver ? `-${formatCurrency(overAmount, currency)}` : formatCurrency(remaining, currency)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800/80">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${progressBarColor}`}
                      style={{ width: `${Math.min(100, percentSpent)}%` }}
                    />
                  </div>
                </div>

                {/* Action buttons footer */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onFilterByCategory(isSelected ? '' : cat.id)}
                    className="font-bold text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {isSelected ? t('trackers.showingInTable') : t('trackers.viewExpenses')}
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => onOpenAddExpense(cat.id)}
                    className={`inline-flex items-center gap-1 font-bold px-2 py-1 rounded-lg border transition-colors cursor-pointer ${
                      isBusiness
                        ? 'text-indigo-300 hover:text-indigo-200 bg-indigo-950/80 hover:bg-indigo-900 border-indigo-800/80'
                        : 'text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 hover:bg-emerald-900 border-emerald-800/80'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('trackers.addExpense')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
