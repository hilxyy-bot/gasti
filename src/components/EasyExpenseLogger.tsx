import React, { useState } from 'react';
import { Plus, Zap, Check, ArrowRight, DollarSign, Calendar, Tag, CreditCard, Sparkles, Coffee, Utensils, ShoppingBag, Film, Home } from 'lucide-react';
import { Category, Currency, Expense } from '../types';
import { formatCurrency, calculateCategoryBudget } from '../utils/formatters';
import { CategoryIcon } from '../utils/iconMap';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCategoryName } from '../utils/categoryLocalization';

interface EasyExpenseLoggerProps {
  categories: Category[];
  currency: Currency;
  income: number;
  expenses: Expense[];
  onLogExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  onOpenDetailedModal: () => void;
}

const QUICK_AMOUNTS = [5, 10, 20, 50, 100];

export const EasyExpenseLogger: React.FC<EasyExpenseLoggerProps> = ({
  categories,
  currency,
  income,
  expenses,
  onLogExpense,
  onOpenDetailedModal,
}) => {
  const { t, language } = useLanguage();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories[0]?.id || ''
  );
  const [amount, setAmount] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || categories[0];
  
  // Calculate budget info for selected category
  const categoryBudget = selectedCategory ? calculateCategoryBudget(income, selectedCategory.percentage) : 0;
  const currentSpent = selectedCategory 
    ? expenses.filter((e) => e.categoryId === selectedCategory.id).reduce((s, e) => s + e.amount, 0)
    : 0;
  const numAmount = parseFloat(amount) || 0;
  const newSpent = currentSpent + numAmount;
  const remaining = Math.max(0, categoryBudget - newSpent);
  const willExceed = categoryBudget > 0 && newSpent > categoryBudget;

  const handleQuickAmountClick = (val: number) => {
    setAmount(val.toString());
  };

  const handleQuickAddPredefined = (val: number, catId: string, merchantName: string) => {
    const today = new Date().toISOString().split('T')[0];
    onLogExpense({
      categoryId: catId,
      amount: val,
      merchant: merchantName,
      date: today,
      paymentMethod: 'Credit Card',
    });
    setIsSuccessAnim(true);
    setTimeout(() => setIsSuccessAnim(false), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const defaultMerchant =
      merchant.trim() ||
      (selectedCategory ? getLocalizedCategoryName(selectedCategory, language) : 'Quick Spend');

    onLogExpense({
      categoryId: selectedCategoryId || categories[0]?.id,
      amount: parsedAmount,
      merchant: defaultMerchant,
      date: today,
      paymentMethod: 'Credit Card',
    });

    // Reset inputs & trigger visual feedback
    setAmount('');
    setMerchant('');
    setIsSuccessAnim(true);
    setTimeout(() => setIsSuccessAnim(false), 1500);
  };

  return (
    <div className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-md relative overflow-hidden text-zinc-100">
      {/* Top Banner with 1-Tap quick suggestions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/60">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{t('logger.quickLog')}</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-emerald-950 text-emerald-400 rounded-full border border-emerald-800">
                {t('logger.instant')}
              </span>
            </h3>
          </div>
        </div>

        {/* Quick Predefined Shortcut Badges */}
        {categories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            <span className="text-[11px] font-semibold text-zinc-400 shrink-0">{t('logger.oneTap')}</span>
            {categories.slice(0, 3).map((cat) => {
              const defaultAmt = cat.name.toLowerCase().includes('food') ? 5 : cat.name.toLowerCase().includes('entertainment') ? 15 : 20;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleQuickAddPredefined(defaultAmt, cat.id, `${cat.name} Quick`)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-950 hover:bg-zinc-800 hover:text-emerald-300 border border-zinc-800 hover:border-emerald-700/60 text-zinc-300 transition-all shrink-0 active:scale-95 cursor-pointer"
                >
                  <CategoryIcon name={cat.icon} className="w-3 h-3 text-emerald-400" />
                  <span>{cat.name}</span>
                  <span className="font-bold text-white">+{formatCurrency(defaultAmt, currency)}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-6 px-4">
          <p className="text-sm font-bold text-zinc-300">{t('logger.noCategoriesTitle')}</p>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            {t('logger.noCategoriesSubtitle')}
          </p>
        </div>
      ) : (
        /* Main Fast Input Form */
        <form onSubmit={handleSubmit} className="space-y-3">
        {/* Category Selector Chips */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            {t('logger.selectCategory')}
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-950 text-white border-zinc-700 shadow-md ring-2 ring-emerald-500'
                      : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" />
                  <span>{getLocalizedCategoryName(cat, language)}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-zinc-800 text-emerald-300 font-bold' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {cat.percentage}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Amount Input & Quick Amount Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              {t('logger.amount')}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-zinc-400">
                {currency.symbol}
              </span>
              <input
                type="number"
                min="0.01"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full pl-8 pr-3 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-base font-extrabold text-white focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1">
              {t('logger.noteMerchant')} <span className="text-zinc-500 font-normal">{t('logger.optional')}</span>
            </label>
            <input
              type="text"
              placeholder={t('logger.placeholderMerchant')}
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-700 rounded-xl text-sm font-medium text-white focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="sm:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              disabled={!amount || parseFloat(amount) <= 0}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                isSuccessAnim
                  ? 'bg-teal-600'
                  : !amount || parseFloat(amount) <= 0
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950 cursor-pointer'
              }`}
            >
              {isSuccessAnim ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t('logger.logged')}</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>{t('logger.saveSpend')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Amount Helper Buttons & Real-Time Impact Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-zinc-400">{t('logger.quickAmounts')}</span>
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAmountClick(val)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
              >
                +{currency.symbol}{val}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {numAmount > 0 && selectedCategory && (
              <span className={`text-xs font-semibold flex items-center gap-1 ${
                willExceed ? 'text-rose-400' : 'text-zinc-400'
              }`}>
                {willExceed ? (
                  t('logger.willExceed', {
                    cat: selectedCategory.name,
                    amt: formatCurrency(newSpent - categoryBudget, currency),
                  })
                ) : (
                  t('logger.willRemain', {
                    amt: formatCurrency(remaining, currency),
                    cat: selectedCategory.name,
                  })
                )}
              </span>
            )}

            <button
              type="button"
              onClick={onOpenDetailedModal}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 ml-auto cursor-pointer"
            >
              {t('logger.moreDetails')}
            </button>
          </div>
        </div>
      </form>
      )}
    </div>
  );
};

