import React, { useState, useEffect } from 'react';
import {
  Wallet,
  PieChart as PieChartIcon,
  TrendingDown,
  Sparkles,
  Edit2,
  Check,
  X,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Landmark,
  Coins,
  Briefcase,
  Layers,
  Tag,
  Plus,
  MinusCircle,
} from 'lucide-react';
import { Currency, CapitalSourceType } from '../types';
import { formatCurrency, getCapitalLabel } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCapitalSource } from '../utils/categoryLocalization';
import { motion } from 'motion/react';

interface OverviewCardsProps {
  income: number;
  onUpdateIncome: (newIncome: number) => void;
  baseCapital?: number;
  additionsTotal?: number;
  additionsCount?: number;
  onOpenAddCapital?: (initialTab?: 'add' | 'reduce' | 'base' | 'history') => void;
  totalAllocatedPercentage: number;
  totalAllocatedAmount: number;
  totalSpent: number;
  currency: Currency;
  currentYearMonth: string;
  financeMode?: 'personal' | 'business';
  onOpenBudgetManager: () => void;
  capitalType?: CapitalSourceType;
  capitalCustomLabel?: string;
  onUpdateCapitalSource?: (type: CapitalSourceType, customLabel?: string) => void;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  income,
  onUpdateIncome,
  baseCapital,
  additionsTotal = 0,
  additionsCount = 0,
  onOpenAddCapital,
  totalAllocatedPercentage,
  totalAllocatedAmount,
  totalSpent,
  currency,
  currentYearMonth,
  financeMode = 'personal',
  onOpenBudgetManager,
  capitalType = 'capital',
  capitalCustomLabel = '',
  onUpdateCapitalSource,
}) => {
  const { t, language } = useLanguage();
  const isBusiness = financeMode === 'business';
  const isEs = language === 'es';
  const [isEditingIncome, setIsEditingIncome] = useState(false);
  const [tempIncome, setTempIncome] = useState(income.toString());
  const [selectedType, setSelectedType] = useState<CapitalSourceType>(capitalType);
  const [tempCustomLabel, setTempCustomLabel] = useState(capitalCustomLabel);

  useEffect(() => {
    setSelectedType(capitalType);
  }, [capitalType]);

  useEffect(() => {
    setTempCustomLabel(capitalCustomLabel);
  }, [capitalCustomLabel]);

  const handleSaveIncome = () => {
    const parsed = parseFloat(tempIncome);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateIncome(parsed);
      if (onUpdateCapitalSource) {
        onUpdateCapitalSource(selectedType, selectedType === 'custom' ? tempCustomLabel : undefined);
      }
      setIsEditingIncome(false);
    }
  };

  const handleCancelIncome = () => {
    setTempIncome(income.toString());
    setSelectedType(capitalType);
    setTempCustomLabel(capitalCustomLabel);
    setIsEditingIncome(false);
  };

  const capitalTitle = getCapitalLabel(capitalType, capitalCustomLabel, language);

  const remainingIncome = Math.max(0, income - totalSpent);
  const isNetOverbudget = totalSpent > income;
  const netOverAmount = isNetOverbudget ? totalSpent - income : 0;
  const percentageSpentOfIncome = income > 0 ? (totalSpent / income) * 100 : 0;
  const unallocatedAmount = Math.max(0, income - totalAllocatedAmount);

  // Calculate days remaining in the current month for daily allowance
  const [year, month] = currentYearMonth.split('-');
  const daysInMonth = new Date(parseInt(year, 10), parseInt(month, 10), 0).getDate();
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === parseInt(year, 10) && today.getMonth() + 1 === parseInt(month, 10);
  const currentDay = isCurrentMonth ? today.getDate() : 1;
  const daysLeft = Math.max(1, daysInMonth - currentDay + 1);
  const dailyAllowance = remainingIncome > 0 ? remainingIncome / daysLeft : 0;

  const capitalTypesList: { id: CapitalSourceType; label: string; icon: string }[] = [
    { id: 'capital', label: getLocalizedCapitalSource('capital', undefined, language), icon: '🏦' },
    { id: 'salary', label: getLocalizedCapitalSource('salary', undefined, language), icon: '💵' },
    { id: 'investment', label: getLocalizedCapitalSource('investment', undefined, language), icon: '📈' },
    { id: 'project', label: getLocalizedCapitalSource('project', undefined, language), icon: '🚀' },
    { id: 'extra', label: getLocalizedCapitalSource('extra', undefined, language), icon: '🎁' },
    { id: 'custom', label: getLocalizedCapitalSource('custom', isEs ? 'Otro' : 'Custom', language), icon: '✏️' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Capital / Income Allocated */}
      <div className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-md relative overflow-hidden flex flex-col justify-between text-zinc-100">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 truncate">
                {capitalTitle}
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded">
                {capitalType === 'salary' ? '💵' : capitalType === 'investment' ? '📈' : capitalType === 'project' ? '🚀' : '🏦'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/60 shrink-0">
              <Coins className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            {isEditingIncome ? (
              <div className="space-y-2.5 mt-1">
                {/* Capital Source Selector */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {isEs ? 'Tipo de Fondo / Capital:' : 'Fund / Capital Type:'}
                  </span>
                  <div className="grid grid-cols-3 gap-1">
                    {capitalTypesList.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedType(item.id)}
                        className={`px-1.5 py-1 text-[11px] font-bold rounded-lg border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                          selectedType === item.id
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                            : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span className="truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                  {selectedType === 'custom' && (
                    <input
                      type="text"
                      value={tempCustomLabel}
                      onChange={(e) => setTempCustomLabel(e.target.value)}
                      placeholder={isEs ? 'Ej. Capital Semilla, Ahorros...' : 'e.g. Seed Fund, Savings...'}
                      className="w-full text-xs font-semibold text-white bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1 mt-1 focus:outline-none focus:border-emerald-500"
                    />
                  )}
                </div>

                {/* Amount Input */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    {isEs ? 'Monto Total a Repartir:' : 'Total Amount to Allocate:'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold text-zinc-400">{currency.symbol}</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={tempIncome}
                      onChange={(e) => setTempIncome(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveIncome()}
                      className="w-full text-xl font-extrabold text-white bg-zinc-950 border border-emerald-500 rounded-lg px-2 py-1 focus:outline-none ring-2 ring-emerald-500/30"
                    />
                    <button
                      onClick={handleSaveIncome}
                      className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-bold shadow-sm cursor-pointer shrink-0"
                      title={t('overview.save')}
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelIncome}
                      className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer shrink-0"
                      title={t('overview.cancel')}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick amount presets */}
                <div className="flex items-center gap-1 flex-wrap pt-0.5">
                  <span className="text-[10px] font-semibold text-zinc-400">{t('overview.quick')}</span>
                  {[1000, 2500, 5000, 10000, 25000, 50000].map((incVal) => (
                    <button
                      key={incVal}
                      type="button"
                      onClick={() => setTempIncome(incVal.toString())}
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-zinc-800 hover:bg-emerald-900/60 hover:text-emerald-300 text-zinc-300 border border-zinc-700 transition-colors cursor-pointer"
                    >
                      {currency.symbol}{incVal.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-baseline justify-between group">
                <div className="min-w-0 flex-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight block truncate">
                    {formatCurrency(income, currency)}
                  </span>
                  {additionsTotal !== 0 ? (
                    <div className="flex items-center gap-1.5 flex-wrap text-[11px] mt-0.5">
                      <span className="text-zinc-400">
                        {isEs ? 'Base:' : 'Base:'} <strong className="text-zinc-200">{formatCurrency(baseCapital ?? (income - additionsTotal), currency)}</strong>
                      </span>
                      <span className="text-zinc-600 font-bold">{additionsTotal > 0 ? '+' : '-'}</span>
                      <span className={`${additionsTotal > 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold flex items-center gap-0.5`}>
                        {additionsTotal > 0
                          ? (isBusiness ? (isEs ? 'Ventas:' : 'Sales:') : (isEs ? 'Extras:' : 'Extras:'))
                          : (isEs ? 'Ajustes:' : 'Deductions:')}{' '}
                        {additionsTotal > 0 ? '+' : ''}
                        {formatCurrency(additionsTotal, currency)}
                        {additionsCount > 0 && (
                          <span className={additionsTotal > 0 ? 'text-emerald-500 font-normal' : 'text-rose-500 font-normal'}>
                            ({additionsCount})
                          </span>
                        )}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-zinc-400 font-medium">
                      {isEs ? 'Monto a repartir en tus %' : 'Base for % distribution'}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (onOpenAddCapital) {
                      onOpenAddCapital('base');
                    } else {
                      setTempIncome(income.toString());
                      setSelectedType(capitalType);
                      setTempCustomLabel(capitalCustomLabel);
                      setIsEditingIncome(true);
                    }
                  }}
                  className="opacity-90 group-hover:opacity-100 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-zinc-700 cursor-pointer shadow-sm shrink-0 ml-2"
                  title={isEs ? 'Ajustar Capital Base' : 'Adjust Base Capital'}
                >
                  <Edit2 className="w-3 h-3 text-emerald-400" />
                  <span>{isEs ? 'Ajustar' : 'Adjust'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-1.5 flex-wrap text-xs">
          {onOpenAddCapital ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onOpenAddCapital('add')}
                className={`px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                  isBusiness
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {isBusiness ? t('quickAdd.addSale') : t('quickAdd.addIncome')}
                </span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onOpenAddCapital('reduce')}
                className="px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 transition-all cursor-pointer shadow-sm"
                title={isEs ? 'Restar al capital en caso de equivocación' : 'Deduct in case of mistake'}
              >
                <MinusCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>{t('quickAdd.deduct')}</span>
              </motion.button>
            </div>
          ) : (
            <span className="truncate text-zinc-400">{isEs ? 'Se divide en tus categorías' : 'Split across categories'}</span>
          )}

          <button
            onClick={() => {
              if (onOpenAddCapital) {
                onOpenAddCapital('base');
              } else {
                setTempIncome(income.toString());
                setSelectedType(capitalType);
                setTempCustomLabel(capitalCustomLabel);
                setIsEditingIncome(true);
              }
            }}
            className="text-zinc-400 hover:text-white font-medium cursor-pointer shrink-0 text-[11px] underline"
          >
            {isEs ? 'Configurar Base' : 'Set Base'}
          </button>
        </div>
      </div>

      {/* Card 2: Percentage Budget Allocated */}
      <div className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-md relative overflow-hidden flex flex-col justify-between text-zinc-100">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {t('overview.allocatedBudget')}
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                totalAllocatedPercentage > 100
                  ? 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                  : totalAllocatedPercentage === 100
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                  : 'bg-blue-950/80 text-blue-400 border-blue-800/60'
              }`}
            >
              <PieChartIcon className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalAllocatedPercentage.toFixed(0)}%
            </span>
            <span className="text-sm font-semibold text-zinc-300">
              {formatCurrency(totalAllocatedAmount, currency)}
            </span>
          </div>

          {/* Allocation status bar */}
          <div className="mt-2 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                totalAllocatedPercentage > 100
                  ? 'bg-rose-500'
                  : totalAllocatedPercentage === 100
                  ? 'bg-emerald-500'
                  : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, totalAllocatedPercentage)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
          {totalAllocatedPercentage > 100 ? (
            <span className="text-rose-400 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {t('overview.overBy')} {(totalAllocatedPercentage - 100).toFixed(0)}%
            </span>
          ) : totalAllocatedPercentage === 100 ? (
            <span className="text-emerald-400 font-semibold">{t('overview.incomeAllocated')}</span>
          ) : (
            <span className="text-blue-400 font-medium">
              {formatCurrency(unallocatedAmount, currency)} ({100 - totalAllocatedPercentage}%) {t('overview.buffer')}
            </span>
          )}
          <button
            onClick={onOpenBudgetManager}
            className="text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
          >
            {t('overview.adjustPercent')}
          </button>
        </div>
      </div>

      {/* Card 3: Total Spent Real-time */}
      <div className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-md relative overflow-hidden flex flex-col justify-between text-zinc-100">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {t('overview.totalSpending')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/80 text-amber-400 flex items-center justify-center border border-amber-800/60">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {formatCurrency(totalSpent, currency)}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              {percentageSpentOfIncome.toFixed(0)}% {t('overview.ofIncome')}
            </span>
          </div>

          {/* Spent vs Income progress bar */}
          <div className="mt-2 w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                percentageSpentOfIncome > 100
                  ? 'bg-rose-500'
                  : percentageSpentOfIncome >= 80
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, percentageSpentOfIncome)}%` }}
            />
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span>{t('overview.realtimeExpenses')}</span>
          <span className="font-semibold text-zinc-200">
            {formatCurrency(Math.max(0, totalAllocatedAmount - totalSpent), currency)} {t('overview.vsBudget')}
          </span>
        </div>
      </div>

      {/* Card 4: Remaining Balance / Net Cashflow */}
      <div className="bg-zinc-900/90 rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-md relative overflow-hidden flex flex-col justify-between text-zinc-100">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {isNetOverbudget ? t('overview.budgetDeficit') : t('overview.remainingCash')}
            </span>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                isNetOverbudget
                  ? 'bg-rose-950/80 text-rose-400 border-rose-800/60'
                  : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3">
            <span
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isNetOverbudget ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isNetOverbudget
                ? `-${formatCurrency(netOverAmount, currency)}`
                : formatCurrency(remainingIncome, currency)}
            </span>
          </div>

          <p className="text-xs text-zinc-400 mt-1">
            {isNetOverbudget
              ? t('overview.exceededTotalIncome')
              : `${formatCurrency(dailyAllowance, currency)}${t('overview.safeSpend')} (${daysLeft} ${t('overview.daysLeft')})`}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-zinc-500" /> {t('overview.day')} {currentDay} {t('overview.of')} {daysInMonth}
          </span>
          <span className={`font-semibold ${isNetOverbudget ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isNetOverbudget ? t('overview.reduceSpend') : t('overview.cashflowPositive')}
          </span>
        </div>
      </div>
    </div>
  );
};


