import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CreditCard,
  Tag,
  Receipt,
  FileText,
  DollarSign,
} from 'lucide-react';
import { Category, Expense, Currency } from '../types';
import { formatCurrency, formatDateDisplay } from '../utils/formatters';
import { CategoryIcon } from '../utils/iconMap';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCategoryName } from '../utils/categoryLocalization';

interface ExpenseTrackerProps {
  expenses: Expense[];
  categories: Category[];
  currency: Currency;
  onOpenAddExpense: (categoryId?: string) => void;
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  selectedCategoryFilter: string | null;
  onSelectCategoryFilter: (categoryId: string) => void;
}

export const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({
  expenses,
  categories,
  currency,
  onOpenAddExpense,
  onEditExpense,
  onDeleteExpense,
  selectedCategoryFilter,
  onSelectCategoryFilter,
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'>('date-desc');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');

  const categoryMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => {
        // Category filter
        if (selectedCategoryFilter && e.categoryId !== selectedCategoryFilter) {
          return false;
        }
        // Payment method filter
        if (paymentMethodFilter !== 'all' && e.paymentMethod !== paymentMethodFilter) {
          return false;
        }
        // Search term (merchant, note, tags, category name)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const cat = categoryMap.get(e.categoryId);
          const matchMerchant = e.merchant.toLowerCase().includes(term);
          const matchNote = (e.note || '').toLowerCase().includes(term);
          const matchCategory = (cat?.name || '').toLowerCase().includes(term);
          const matchTags = (e.tags || []).some((t) => t.toLowerCase().includes(term));
          return matchMerchant || matchNote || matchCategory || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'amount-desc') {
          return b.amount - a.amount;
        }
        if (sortBy === 'amount-asc') {
          return a.amount - b.amount;
        }
        return 0;
      });
  }, [expenses, selectedCategoryFilter, paymentMethodFilter, searchTerm, sortBy, categoryMap]);

  const totalFilteredAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-zinc-900/90 rounded-2xl p-5 sm:p-6 border border-zinc-800 shadow-md space-y-4 text-zinc-100">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/60">
              <Receipt className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {t('expenses.title')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            {t('expenses.subtitle')}
          </p>
        </div>

        <button
          onClick={() => onOpenAddExpense()}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('expenses.newExpenseBtn')}</span>
        </button>
      </div>

      {/* Controls: Search, Category Filter, Sort, Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 pt-2">
        {/* Search bar */}
        <div className="lg:col-span-4 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('expenses.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder:text-zinc-600 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-zinc-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {t('expenses.clearSearch')}
            </button>
          )}
        </div>

        {/* Category dropdown */}
        <div className="lg:col-span-3">
          <select
            value={selectedCategoryFilter || 'all'}
            onChange={(e) => onSelectCategoryFilter(e.target.value === 'all' ? '' : e.target.value)}
            className="w-full py-2 px-3 text-sm bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-200 cursor-pointer font-medium"
          >
            <option value="all">{t('expenses.allCategories')} ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {getLocalizedCategoryName(c, language)} ({c.percentage}%)
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method filter */}
        <div className="lg:col-span-2">
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="w-full py-2 px-3 text-sm bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-200 cursor-pointer font-medium"
          >
            <option value="all">{t('expenses.allPayments')}</option>
            <option value="Cash">{t('expenses.paymentCash')}</option>
            <option value="Credit Card">{t('expenses.paymentCreditCard')}</option>
            <option value="Debit Card">{t('expenses.paymentDebitCard')}</option>
            <option value="Bank Transfer">{t('expenses.paymentBankTransfer')}</option>
            <option value="Other">{t('expenses.paymentOther')}</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="lg:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full py-2 px-3 text-sm bg-zinc-950 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-200 cursor-pointer font-medium"
          >
            <option value="date-desc">{t('expenses.sortNewest')}</option>
            <option value="date-asc">{t('expenses.sortOldest')}</option>
            <option value="amount-desc">{t('expenses.sortHighest')}</option>
            <option value="amount-asc">{t('expenses.sortLowest')}</option>
          </select>
        </div>
      </div>

      {/* Filter Summary Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-950 px-3.5 py-2 rounded-xl border border-zinc-800/80">
        <span>
          {t('expenses.showingCount', { count: filteredExpenses.length, total: expenses.length })}
        </span>
        <span>
          {t('expenses.subtotal')}:{' '}
          <strong className="text-emerald-400 font-extrabold">
            {formatCurrency(totalFilteredAmount, currency)}
          </strong>
        </span>
      </div>

      {/* Expenses Table / Cards */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40">
          <Receipt className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-zinc-300">{t('expenses.noExpensesFound')}</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedCategoryFilter
              ? t('expenses.noExpensesSearch')
              : t('expenses.noExpensesEmpty')}
          </p>
          <button
            onClick={() => onOpenAddExpense()}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> {t('expenses.newExpenseBtn')}
          </button>
        </div>
      ) : (
        <div className="divide-y divide-zinc-800/80 border border-zinc-800/90 rounded-xl overflow-hidden">
          {filteredExpenses.map((expense) => {
            const cat = categoryMap.get(expense.categoryId);

            return (
              <div
                key={expense.id}
                className="p-3 sm:p-4 hover:bg-zinc-800/40 transition-colors flex items-center justify-between gap-3 bg-zinc-950/80"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                    style={{ backgroundColor: cat?.color || '#52525b' }}
                  >
                    <CategoryIcon name={cat?.icon || 'HelpCircle'} className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-white truncate">
                        {expense.merchant}
                      </h4>
                      {cat && (
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-zinc-700/60"
                          style={{
                            backgroundColor: `${cat.color}25`,
                            color: cat.color,
                          }}
                        >
                          {getLocalizedCategoryName(cat, language)} ({cat.percentage}%)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 flex-wrap">
                      <span>{formatDateDisplay(expense.date)}</span>
                      {expense.paymentMethod && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-zinc-500" />
                            {expense.paymentMethod}
                          </span>
                        </>
                      )}
                      {expense.note && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[200px] italic text-zinc-400">
                            "{expense.note}"
                          </span>
                        </>
                      )}
                    </div>

                    {expense.tags && expense.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {expense.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-1.5 py-0.5 text-[10px] font-medium bg-zinc-900 text-zinc-400 rounded border border-zinc-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-extrabold text-white">
                      {formatCurrency(expense.amount, currency)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditExpense(expense)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                      title="Edit expense"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteExpense(expense.id)}
                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

