import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  User,
  Coins,
} from 'lucide-react';
import { Category, Expense, Currency, FinanceMode, CapitalSourceType } from '../types';
import { formatCurrency, getCapitalLabel } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { CategoryIcon } from '../utils/iconMap';
import { getLocalizedCategoryName } from '../utils/categoryLocalization';

interface MonthlyStatusBarProps {
  currentYearMonth: string;
  income: number;
  totalSpent: number;
  categories: Category[];
  expenses: Expense[];
  currency: Currency;
  financeMode?: FinanceMode;
  onOpenAddExpense?: () => void;
  onOpenBudgetManager?: () => void;
  capitalType?: CapitalSourceType;
  capitalCustomLabel?: string;
}

export const MonthlyStatusBar: React.FC<MonthlyStatusBarProps> = ({
  currentYearMonth,
  income,
  totalSpent,
  categories,
  expenses,
  currency,
  financeMode = 'personal',
  onOpenAddExpense,
  onOpenBudgetManager,
  capitalType = 'capital',
  capitalCustomLabel = '',
}) => {
  const { language, formatMonth, t } = useLanguage();
  const isEs = language === 'es';
  const isBusiness = financeMode === 'business';
  const capitalTitle = getCapitalLabel(capitalType, capitalCustomLabel, language);

  // Calculate calendar metrics for the active year-month
  const {
    totalDaysInMonth,
    currentDayNumber,
    monthProgressPercent,
    daysRemaining,
    isCurrentRealMonth,
    isPastMonth,
    isFutureMonth,
  } = useMemo(() => {
    const [yearStr, monthStr] = currentYearMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10); // 1-12

    const daysInMonth = new Date(year, month, 0).getDate();
    const today = new Date();
    const isThisYear = today.getFullYear() === year;
    const isThisMonth = today.getMonth() + 1 === month;
    const isRealCurrent = isThisYear && isThisMonth;

    let dayNumber = 1;
    let past = false;
    let future = false;

    if (isRealCurrent) {
      dayNumber = today.getDate();
    } else {
      const selectedDate = new Date(year, month - 1, 1);
      const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      if (selectedDate < currentMonthStart) {
        past = true;
        dayNumber = daysInMonth;
      } else {
        future = true;
        dayNumber = 0;
      }
    }

    const progressPct = isRealCurrent
      ? Math.min(100, Math.max(0, Math.round((dayNumber / daysInMonth) * 100)))
      : past
      ? 100
      : 0;

    const remaining = isRealCurrent
      ? Math.max(0, daysInMonth - dayNumber)
      : past
      ? 0
      : daysInMonth;

    return {
      totalDaysInMonth: daysInMonth,
      currentDayNumber: dayNumber,
      monthProgressPercent: progressPct,
      daysRemaining: remaining,
      isCurrentRealMonth: isRealCurrent,
      isPastMonth: past,
      isFutureMonth: future,
    };
  }, [currentYearMonth]);

  // Financial calculations
  const spentPercent = income > 0 ? (totalSpent / income) * 100 : 0;
  const remainingCash = Math.max(0, income - totalSpent);
  const isOverBudget = totalSpent > income;
  const overAmount = isOverBudget ? totalSpent - income : 0;

  // Daily budget calculations
  const suggestedDailyRemaining = useMemo(() => {
    if (daysRemaining <= 0) return 0;
    return remainingCash / (daysRemaining || 1);
  }, [remainingCash, daysRemaining]);

  const actualDailyPace = useMemo(() => {
    const elapsedDays = Math.max(1, currentDayNumber);
    return totalSpent / elapsedDays;
  }, [totalSpent, currentDayNumber]);

  // Pace health evaluation
  const healthStatus = useMemo(() => {
    if (income <= 0) {
      return {
        key: 'no-income',
        badge: isEs ? `Configura tu ${capitalTitle}` : `Set your ${capitalTitle}`,
        badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        message: isEs
          ? `Ingresa tu ${capitalTitle} a repartir para ver tu ritmo.`
          : `Enter your ${capitalTitle} to allocate to track your pace.`,
        icon: AlertTriangle,
        theme: 'neutral',
      };
    }

    if (isOverBudget) {
      return {
        key: 'over',
        badge: t('monthStatus.badgeOver'),
        badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-800',
        message: isEs
          ? `Te has excedido por ${formatCurrency(overAmount, currency)}. Revisa tus gastos.`
          : `Exceeded by ${formatCurrency(overAmount, currency)}. Review recent spending.`,
        icon: AlertTriangle,
        theme: 'danger',
      };
    }

    if (isFutureMonth) {
      return {
        key: 'future',
        badge: isEs ? '📅 Mes Futuro' : '📅 Upcoming Month',
        badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-800',
        message: isEs
          ? `Planificando presupuesto para ${formatMonth(currentYearMonth)}.`
          : `Planning budget for ${formatMonth(currentYearMonth)}.`,
        icon: Calendar,
        theme: 'info',
      };
    }

    if (isPastMonth) {
      const saved = income - totalSpent;
      return {
        key: 'past-closed',
        badge: isEs ? '🏁 Mes Finalizado' : '🏁 Month Completed',
        badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
        message:
          saved >= 0
            ? isEs
              ? `¡Logrado! Cerraste este mes con ${formatCurrency(saved, currency)} de ahorro libre.`
              : `Great! You closed this month with ${formatCurrency(saved, currency)} left.`
            : isEs
            ? `Cerraste este mes con un exceso de ${formatCurrency(Math.abs(saved), currency)}.`
            : `Closed this month with an excess of ${formatCurrency(Math.abs(saved), currency)}.`,
        icon: ShieldCheck,
        theme: saved >= 0 ? 'success' : 'danger',
      };
    }

    // Current real-time month comparison: Spent % vs Days %
    const paceDiff = spentPercent - monthProgressPercent;

    if (spentPercent >= 90 && monthProgressPercent < 75) {
      return {
        key: 'critical-pace',
        badge: t('monthStatus.badgePaceDanger'),
        badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
        message: isEs
          ? `Llevas el ${Math.round(spentPercent)}% gastado pero solo ha pasado el ${monthProgressPercent}% del mes.`
          : `You've spent ${Math.round(spentPercent)}% with only ${monthProgressPercent}% of month elapsed.`,
        icon: TrendingUp,
        theme: 'warning',
      };
    }

    if (paceDiff > 15) {
      return {
        key: 'warning-pace',
        badge: t('monthStatus.badgePaceWarning'),
        badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
        message: isEs
          ? `Vas un poco adelantado en gastos (+${Math.round(paceDiff)}% respecto a los días). Modera compras libres.`
          : `Spending is ahead (+${Math.round(paceDiff)}% vs elapsed days). Moderate discretionary expenses.`,
        icon: TrendingUp,
        theme: 'warning',
      };
    }

    if (paceDiff < -10) {
      return {
        key: 'excellent-pace',
        badge: t('monthStatus.badgePaceGreat'),
        badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-700',
        message: isEs
          ? `¡Vas genial! Has gastado el ${Math.round(spentPercent)}% en el día ${currentDayNumber} (${monthProgressPercent}% del mes).`
          : `Great pacing! You've spent ${Math.round(spentPercent)}% by day ${currentDayNumber} (${monthProgressPercent}% of month).`,
        icon: Sparkles,
        theme: 'success',
      };
    }

    return {
      key: 'on-track',
      badge: t('monthStatus.badgeOnTrack'),
      badgeColor: 'bg-teal-950/80 text-teal-300 border-teal-800',
      message: isEs
        ? `Tus gastos van alineados con los días del mes (${Math.round(spentPercent)}% gastado / ${monthProgressPercent}% transcurrido).`
        : `Your spending matches month progress (${Math.round(spentPercent)}% spent / ${monthProgressPercent}% elapsed).`,
      icon: CheckCircle2,
      theme: 'success',
    };
  }, [
    income,
    isOverBudget,
    overAmount,
    currency,
    isFutureMonth,
    isPastMonth,
    formatMonth,
    currentYearMonth,
    totalSpent,
    spentPercent,
    monthProgressPercent,
    currentDayNumber,
    isEs,
    t,
    capitalTitle,
  ]);

  // Top spending categories preview in this month
  const topSpentCategories = useMemo(() => {
    return categories
      .map((cat) => {
        const catSpent = expenses
          .filter((e) => e.categoryId === cat.id)
          .reduce((sum, e) => sum + e.amount, 0);
        const catBudget = (income * cat.percentage) / 100;
        const catPct = catBudget > 0 ? (catSpent / catBudget) * 100 : 0;
        return {
          ...cat,
          spent: catSpent,
          budget: catBudget,
          spentRatio: catPct,
        };
      })
      .filter((c) => c.spent > 0)
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 4);
  }, [categories, expenses, income]);

  // Progress Bar Gradient Color Logic
  const barGradient = useMemo(() => {
    if (isOverBudget) return 'from-rose-500 via-rose-600 to-red-600';
    if (spentPercent > 85) return 'from-amber-500 via-orange-500 to-rose-500';
    if (spentPercent > 65) return 'from-emerald-500 via-teal-500 to-amber-500';
    return 'from-emerald-400 via-teal-500 to-emerald-600';
  }, [isOverBudget, spentPercent]);

  const StatusIcon = healthStatus.icon;

  return (
    <motion.div
      id="monthly-status-bar-card"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/90 shadow-xl shadow-black/40 p-4 sm:p-6"
    >
      {/* Ambient background glow matching state */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 ${
          healthStatus.theme === 'danger'
            ? 'bg-rose-500'
            : healthStatus.theme === 'warning'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />

      {/* Header Row: Title, Date & Health Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${
              healthStatus.theme === 'danger'
                ? 'bg-rose-950/60 border-rose-700/60 text-rose-400'
                : healthStatus.theme === 'warning'
                ? 'bg-amber-950/60 border-amber-700/60 text-amber-400'
                : 'bg-emerald-950/60 border-emerald-700/60 text-emerald-400'
            }`}
          >
            <StatusIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                {t('monthStatus.title')}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                {formatMonth(currentYearMonth)}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                  isBusiness
                    ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                }`}
              >
                {isBusiness ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                <span>{isBusiness ? t('monthStatus.modeBusiness') : t('monthStatus.modePersonal')}</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">{healthStatus.message}</p>
          </div>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border shadow-sm ${healthStatus.badgeColor}`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            {healthStatus.badge}
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* THE MAIN INTERACTIVE MONTHLY PROGRESS BAR (BARRITA DEL MES) */}
      {/* ========================================================= */}
      <div className="space-y-2 my-4">
        {/* Metric labels above the bar */}
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
          <div className="flex items-center gap-2">
            <span className="text-zinc-400">
              {t('monthStatus.spentOf').replace('{capital}', capitalTitle)}
            </span>
            <span className="text-white font-mono font-extrabold">
              {formatCurrency(totalSpent, currency)}
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              / {formatCurrency(income, currency)}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span
              className={`text-sm sm:text-base font-extrabold ${
                isOverBudget
                  ? 'text-rose-400'
                  : spentPercent > 80
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {spentPercent.toFixed(1)}%
            </span>
            <span className="text-xs text-zinc-400 font-sans hidden xs:inline">
              {t('monthStatus.used')}
            </span>
          </div>
        </div>

        {/* The Bar Track */}
        <div className="relative h-6 sm:h-7 w-full bg-zinc-950 rounded-xl p-1 border border-zinc-800/90 shadow-inner overflow-visible">
          {/* Calendar Day Marker Indicator (Line + Pin) */}
          {isCurrentRealMonth && monthProgressPercent > 0 && monthProgressPercent < 100 && (
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none transition-all duration-500 flex flex-col items-center"
              style={{ left: `${monthProgressPercent}%` }}
            >
              {/* Vertical dotted guide line */}
              <div className="w-0.5 h-full bg-white/70 shadow-sm" />
              {/* Floating Pill for 'Today / Día X' */}
              <div className="absolute -top-6 -translate-x-1/2 bg-zinc-800 text-zinc-200 border border-zinc-600 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md whitespace-nowrap flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-emerald-400" />
                <span>
                  {t('overview.day')} {currentDayNumber} ({monthProgressPercent}%)
                </span>
              </div>
            </div>
          )}

          {/* Animated Fill Bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(spentPercent > 0 ? 3 : 0, spentPercent))}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-lg bg-gradient-to-r ${barGradient} shadow-md relative flex items-center justify-end pr-2 overflow-hidden`}
          >
            {/* Subtle light shimmer wave */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />

            {/* If there is enough room, show percentage inside the bar */}
            {spentPercent >= 15 && (
              <span className="text-[11px] font-extrabold text-white drop-shadow-md font-mono z-10">
                {spentPercent.toFixed(0)}%
              </span>
            )}
          </motion.div>
        </div>

        {/* Progress Bar Sub-legend / Time vs Spending alignment */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>
              {t('monthStatus.dayOf')
                .replace('{day}', currentDayNumber.toString())
                .replace('{total}', totalDaysInMonth.toString())}{' '}
              ({monthProgressPercent}% {t('monthStatus.ofMonth')})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isOverBudget ? (
              <span className="text-rose-400 font-bold">
                ⚠️ {t('monthStatus.exceeded')} {formatCurrency(overAmount, currency)}
              </span>
            ) : (
              <span>
                {t('monthStatus.remainingFree')}{' '}
                <strong className="text-emerald-400 font-mono font-bold">
                  {formatCurrency(remainingCash, currency)}
                </strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3 QUICK SMART SUMMARY PILLS (RITMO DIARIO & DÍAS) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-zinc-800/60 mt-4">
        {/* Card 1: Días Restantes */}
        <div className="bg-zinc-950/60 rounded-xl p-2.5 border border-zinc-800/70 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-900 text-teal-400 border border-zinc-800">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-400 font-medium">
              {t('monthStatus.timeRemaining')}
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-zinc-100 font-mono">
              {daysRemaining}{' '}
              <span className="font-normal text-xs text-zinc-400 font-sans">
                {daysRemaining === 1 ? t('monthStatus.dayLeft') : t('monthStatus.daysLeft')}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Ritmo Diario Sugerido */}
        <div className="bg-zinc-950/60 rounded-xl p-2.5 border border-zinc-800/70 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-900 text-emerald-400 border border-zinc-800">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-zinc-400 font-medium truncate">
              {t('monthStatus.safeDaily')}
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-emerald-400 font-mono">
              {isOverBudget ? '$0' : `${formatCurrency(suggestedDailyRemaining, currency)}`}
              <span className="font-normal text-xs text-zinc-400 font-sans">
                {' '}
                {t('monthStatus.perDay')}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Ritmo Actual Real */}
        <div className="bg-zinc-950/60 rounded-xl p-2.5 border border-zinc-800/70 flex items-center gap-3">
          <div
            className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${
              actualDailyPace > suggestedDailyRemaining && suggestedDailyRemaining > 0
                ? 'text-amber-400'
                : 'text-zinc-400'
            }`}
          >
            {actualDailyPace > suggestedDailyRemaining ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-zinc-400 font-medium truncate">
              {t('monthStatus.avgDaily')}
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-zinc-200 font-mono">
              {formatCurrency(actualDailyPace, currency)}
              <span className="font-normal text-xs text-zinc-400 font-sans">
                {' '}
                {t('monthStatus.perDay')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Categories Spending Mini Breakdown */}
      {topSpentCategories.length > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            <span className="text-[11px] font-bold text-zinc-400 whitespace-nowrap">
              {t('monthStatus.topSpendingIn')}
            </span>
            {topSpentCategories.map((cat) => {
              const localizedName = getLocalizedCategoryName(cat, language);
              return (
                <div
                  key={cat.id}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-200 shrink-0"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <CategoryIcon name={cat.icon} className="w-3 h-3 text-zinc-400" />
                  <span>{localizedName}</span>
                  <span className="text-zinc-400 font-mono">
                    ({formatCurrency(cat.spent, currency)})
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Action Button */}
          {onOpenAddExpense && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenAddExpense}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer shrink-0 self-end sm:self-center"
            >
              <span>{t('monthStatus.logExpense')}</span>
              <ArrowRight className="w-3 h-3" />
            </motion.button>
          )}
        </div>
      )}
    </motion.div>
  );
};
