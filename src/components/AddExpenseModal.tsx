import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, CreditCard, AlertTriangle, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, Expense, Currency } from '../types';
import { formatCurrency, calculateCategoryBudget } from '../utils/formatters';
import { CategoryIcon } from '../utils/iconMap';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCategoryName } from '../utils/categoryLocalization';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: Omit<Expense, 'id' | 'createdAt'>, expenseId?: string) => void;
  categories: Category[];
  initialCategoryId?: string;
  editingExpense?: Expense | null;
  currency: Currency;
  income: number;
  expenses: Expense[];
  currentYearMonth: string;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
  categories,
  initialCategoryId,
  editingExpense,
  currency,
  income,
  expenses,
  currentYearMonth,
}) => {
  const { t, language } = useLanguage();
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDate = todayStr.startsWith(currentYearMonth)
    ? todayStr
    : `${currentYearMonth}-01`;

  const [amount, setAmount] = useState<string>(
    editingExpense ? editingExpense.amount.toString() : ''
  );
  const [categoryId, setCategoryId] = useState<string>(
    editingExpense ? editingExpense.categoryId : initialCategoryId || categories[0]?.id || ''
  );
  const [merchant, setMerchant] = useState<string>(editingExpense ? editingExpense.merchant : '');
  const [date, setDate] = useState<string>(editingExpense ? editingExpense.date : defaultDate);
  const [paymentMethod, setPaymentMethod] = useState<Expense['paymentMethod']>(
    editingExpense ? editingExpense.paymentMethod : 'Credit Card'
  );
  const [note, setNote] = useState<string>(editingExpense?.note || '');
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>(editingExpense?.tags || []);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategoryId(editingExpense.categoryId);
      setMerchant(editingExpense.merchant);
      setDate(editingExpense.date);
      setPaymentMethod(editingExpense.paymentMethod || 'Credit Card');
      setNote(editingExpense.note || '');
      setTags(editingExpense.tags || []);
    } else {
      setAmount('');
      setCategoryId(initialCategoryId || categories[0]?.id || '');
      setMerchant('');
      setDate(defaultDate);
      setPaymentMethod('Credit Card');
      setNote('');
      setTags([]);
    }
    setError('');
  }, [editingExpense, initialCategoryId, isOpen, defaultDate, categories]);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const categoryBudget = selectedCategory
    ? calculateCategoryBudget(income, selectedCategory.percentage)
    : 0;

  // Calculate current spent in this category (excluding the expense currently being edited)
  const currentSpent = expenses
    .filter((e) => e.categoryId === categoryId && e.id !== editingExpense?.id)
    .reduce((sum, e) => sum + e.amount, 0);

  const numAmount = parseFloat(amount) || 0;
  const projectedSpent = currentSpent + numAmount;
  const willExceed = categoryBudget > 0 && projectedSpent > categoryBudget;
  const overAmount = willExceed ? projectedSpent - categoryBudget : 0;
  const projectedPercent = categoryBudget > 0 ? (projectedSpent / categoryBudget) * 100 : 0;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || numAmount <= 0) {
      setError(t('modal.errorAmount'));
      return;
    }
    if (!merchant.trim()) {
      setError(t('modal.errorMerchant'));
      return;
    }
    if (!categoryId) {
      setError(t('modal.errorCategory'));
      return;
    }

    onSaveExpense(
      {
        amount: numAmount,
        categoryId,
        merchant: merchant.trim(),
        date,
        paymentMethod,
        note: note.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      },
      editingExpense?.id
    );
    onClose();
  };

  const quickAmounts = [5, 10, 25, 50, 100];

  const paymentOptions: { id: Expense['paymentMethod']; label: string }[] = [
    { id: 'Cash', label: t('payment.cash') },
    { id: 'Debit Card', label: t('payment.debitCard') },
    { id: 'Credit Card', label: t('payment.creditCard') },
    { id: 'Bank Transfer', label: t('payment.bankTransfer') },
    { id: 'Other', label: t('payment.other') },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 360 }}
        className="bg-zinc-950 rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-zinc-800 relative max-h-[88dvh] sm:max-h-[90vh] overflow-y-auto overscroll-contain text-zinc-100 flex flex-col"
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-zinc-700/80 rounded-full mx-auto mb-3 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/60">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {editingExpense ? t('modal.editExpense') : t('modal.addExpense')}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {language === 'es' ? 'Ingresa el monto y categoría para registrar' : 'Enter amount and category to record'}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-950/60 text-rose-300 text-xs font-semibold flex items-center gap-2 border border-rose-800 shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-3 flex-1 flex flex-col">
          {/* Amount input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
              {t('modal.amount')} ({currency.symbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-2xl font-bold text-zinc-500">
                {currency.symbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-3 sm:py-2.5 text-2xl sm:text-3xl font-extrabold text-white bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-zinc-600"
              />
            </div>

            {/* Quick add buttons */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-zinc-500 font-medium">{t('modal.quickAdd')}</span>
              {quickAmounts.map((q) => (
                <motion.button
                  key={q}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const current = parseFloat(amount) || 0;
                    setAmount((current + q).toFixed(2));
                  }}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-zinc-900 hover:bg-emerald-950 hover:text-emerald-300 text-zinc-300 border border-zinc-800 transition-colors cursor-pointer"
                >
                  +{currency.symbol}
                  {q}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
              {t('modal.category')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 sm:max-h-48 overflow-y-auto p-1 overscroll-contain">
              {categories.map((c) => {
                const isSelected = c.id === categoryId;
                const localizedName = getLocalizedCategoryName(c, language);
                return (
                  <motion.button
                    key={c.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setCategoryId(c.id)}
                    className={`flex items-center gap-2 p-2.5 sm:p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-950/50 ring-2 ring-emerald-500/40'
                        : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/80 hover:bg-zinc-900'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: c.color }}
                    >
                      <CategoryIcon name={c.icon} className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-white truncate block">
                        {localizedName}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-medium truncate block">
                        {c.percentage}% ({formatCurrency(calculateCategoryBudget(income, c.percentage), currency)})
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Real-time Budget Impact Preview */}
          {selectedCategory && numAmount > 0 && (
            <div
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                willExceed
                  ? 'bg-rose-950/60 border-rose-800 text-rose-200'
                  : projectedPercent >= 80
                  ? 'bg-amber-950/60 border-amber-800 text-amber-200'
                  : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between font-bold">
                <span>{t('modal.budgetImpact', { cat: getLocalizedCategoryName(selectedCategory, language) })}</span>
                <span>{projectedPercent.toFixed(0)}% {t('modal.ofLimit')}</span>
              </div>
              <p className="text-[11px] opacity-90">
                {t('modal.impactDesc', {
                  current: formatCurrency(currentSpent, currency),
                  projected: formatCurrency(projectedSpent, currency),
                  budget: formatCurrency(categoryBudget, currency),
                })}
              </p>
              {willExceed && (
                <p className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />{' '}
                  {t('modal.exceedWarning', {
                    cat: getLocalizedCategoryName(selectedCategory, language),
                    amt: formatCurrency(overAmount, currency),
                  })}
                </p>
              )}
            </div>
          )}

          {/* Merchant / Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
              {t('modal.merchant')}
            </label>
            <input
              type="text"
              placeholder={t('modal.placeholderMerchant')}
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full px-3.5 py-3 sm:py-2.5 text-base sm:text-sm bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-zinc-600"
            />
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                {t('modal.date')}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
                {t('modal.paymentMethod')}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white cursor-pointer font-medium"
              >
                {paymentOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
              {t('modal.notes')}
            </label>
            <input
              type="text"
              placeholder={t('modal.notesPlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-3 sm:py-2 text-base sm:text-sm bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-zinc-600"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">
              {t('modal.tags')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-2.5 sm:py-1.5 text-base sm:text-xs bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-zinc-600"
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTag}
                className="px-3.5 py-2.5 sm:py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg cursor-pointer shrink-0"
              >
                {t('modal.addTag')}
              </motion.button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <motion.span
                    key={tag}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-xs border border-zinc-700"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions (Sticky on Mobile) */}
          <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-md pt-3 pb-2 sm:pb-0 border-t border-zinc-800/80 flex items-center justify-end gap-3 mt-auto shrink-0">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-bold text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer text-center"
            >
              {t('modal.cancel')}
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 sm:flex-none px-5 py-3 sm:py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingExpense ? t('modal.saveChanges') : t('modal.recordExpense')}</span>
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
