import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Sliders,
  Sparkles,
  DollarSign,
  Bell,
  LayoutDashboard,
  Zap,
  BarChart3,
  Globe,
  Check,
  HelpCircle,
  Activity,
  Download,
  Building2,
  User,
  Coins,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Currency, LanguageCode, FinanceMode } from '../types';
import { SUPPORTED_CURRENCIES } from '../data/initialData';
import { useLanguage } from '../context/LanguageContext';
import { AppLogo } from './AppLogo';
import { UserProfileMenu } from './UserProfileMenu';

export type ViewMode =
  | 'status'
  | 'quick-spend'
  | 'budget-percentages'
  | 'downloads';

interface NavbarProps {
  currentYearMonth: string;
  onChangeMonth: (yearMonth: string) => void;
  currency: Currency;
  onChangeCurrency: (currency: Currency) => void;
  financeMode: FinanceMode;
  onChangeFinanceMode: (mode: FinanceMode) => void;
  onOpenAddExpense: () => void;
  onOpenAddCapital?: (initialTab?: 'add' | 'reduce' | 'base' | 'history') => void;
  onOpenBudgetManager: () => void;
  onOpenAlertSettings: () => void;
  onOpenKidGuide?: () => void;
  onResetData: () => void;
  onExportData: () => void;
  alertCount: number;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentYearMonth,
  onChangeMonth,
  currency,
  onChangeCurrency,
  financeMode,
  onChangeFinanceMode,
  onOpenAddExpense,
  onOpenAddCapital,
  onOpenBudgetManager,
  onOpenAlertSettings,
  onOpenKidGuide,
  onResetData,
  onExportData,
  alertCount,
  viewMode,
  onChangeViewMode,
}) => {
  const { language, currentLanguage, setLanguage, t, formatMonth, supportedLanguages } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const isBusiness = financeMode === 'business';

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = () => {
    const [year, month] = currentYearMonth.split('-');
    let y = parseInt(year, 10);
    let m = parseInt(month, 10) - 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    onChangeMonth(`${y}-${m.toString().padStart(2, '0')}`);
  };

  const handleNextMonth = () => {
    const [year, month] = currentYearMonth.split('-');
    let y = parseInt(year, 10);
    let m = parseInt(month, 10) + 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    onChangeMonth(`${y}-${m.toString().padStart(2, '0')}`);
  };

  const handleCurrentMonth = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = (now.getMonth() + 1).toString().padStart(2, '0');
    onChangeMonth(`${y}-${m}`);
  };

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo & Brand */}
          <div
            onClick={() => onChangeViewMode('status')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <motion.div
              whileHover={{ scale: 1.08, rotate: [0, -6, 6, 0] }}
              transition={{ duration: 0.4 }}
              className={`w-10 h-10 rounded-xl overflow-hidden shadow-md flex-shrink-0 ${
                isBusiness ? 'shadow-indigo-950' : 'shadow-emerald-950'
              }`}
            >
              <AppLogo className="w-10 h-10" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className={`text-xl font-black text-white tracking-tight transition-colors ${
                    isBusiness ? 'group-hover:text-indigo-400' : 'group-hover:text-emerald-400'
                  }`}
                >
                  {t('app.title')}
                </h1>
                <span
                  className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                    isBusiness
                      ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/80'
                      : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                  }`}
                >
                  {isBusiness ? t('mode.businessBadge') : t('mode.personalBadge')}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden md:block">
                {isBusiness ? t('mode.businessTagline') : t('mode.personalTagline')}
              </p>
            </div>
          </div>

          {/* Mode Switcher Pill (Modo Personal 👤 vs Modo Negocio 🏢) */}
          <div className="flex items-center p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl shadow-inner">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onChangeFinanceMode('personal')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isBusiness
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
              title={t('mode.personalTagline')}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('mode.personal')}</span>
              <span className="sm:hidden">{t('mode.personalShort')}</span>
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => onChangeFinanceMode('business')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isBusiness
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
              title={t('mode.businessTagline')}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('mode.business')}</span>
              <span className="sm:hidden">{t('mode.businessShort')}</span>
            </motion.button>
          </div>

          {/* Month Navigation */}
          <div className="hidden lg:flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <motion.button
              id="prev-month-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              title={t('nav.prevMonth')}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              id="current-month-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCurrentMonth}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold text-zinc-100 transition-colors whitespace-nowrap cursor-pointer capitalize ${
                isBusiness ? 'hover:text-indigo-400' : 'hover:text-emerald-400'
              }`}
            >
              {formatMonth(currentYearMonth)}
            </motion.button>
            <motion.button
              id="next-month-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer"
              title={t('nav.nextMonth')}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Controls & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Kid Guide Button */}
            {onOpenKidGuide && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenKidGuide}
                className="hidden xl:inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-lg px-2.5 py-1.5 transition-all cursor-pointer"
                title={t('guide.title')}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'es' ? '¿Cómo funciona?' : 'Guide'}</span>
              </motion.button>
            )}

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <motion.button
                id="language-selector-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 bg-zinc-900 text-zinc-200 hover:text-white text-xs sm:text-sm font-semibold rounded-lg px-2.5 py-1.5 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
                title={t('nav.language')}
              >
                <Globe className={`w-3.5 h-3.5 ${isBusiness ? 'text-indigo-400' : 'text-emerald-400'}`} />
                <span className="text-sm">{currentLanguage.flag}</span>
                <span className="hidden md:inline text-xs font-bold">{currentLanguage.code.toUpperCase()}</span>
              </motion.button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl py-1.5 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-850 mb-1">
                      {t('nav.language')} / Language
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {supportedLanguages.map((lang) => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
                            language === lang.code
                              ? 'bg-zinc-800 text-white font-bold'
                              : 'text-zinc-300 hover:bg-zinc-900 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                            <span className="text-[10px] text-zinc-500">({lang.name})</span>
                          </div>
                          {language === lang.code && (
                            <Check className={`w-3.5 h-3.5 ${isBusiness ? 'text-indigo-400' : 'text-emerald-400'}`} />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Currency selector */}
            <select
              id="currency-selector"
              value={currency.code}
              onChange={(e) => {
                const found = SUPPORTED_CURRENCIES.find((c) => c.code === e.target.value);
                if (found) onChangeCurrency(found);
              }}
              className="bg-zinc-900 text-zinc-200 text-xs sm:text-sm font-semibold rounded-lg px-2 sm:px-2.5 py-1.5 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-zinc-900 text-zinc-100">
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>

            {/* Alert Settings button */}
            <motion.button
              id="alerts-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onOpenAlertSettings}
              className="relative p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              title={t('nav.alerts')}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {alertCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-zinc-950 animate-pulse" />
              )}
            </motion.button>

            {/* Add Capital / Sales Quick Button */}
            {onOpenAddCapital && (
              <motion.button
                id="add-capital-nav-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenAddCapital}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold border transition-all cursor-pointer shadow-xs ${
                  isBusiness
                    ? 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-700/80 hover:border-indigo-500'
                    : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700/80 hover:border-emerald-500'
                }`}
                title={
                  isBusiness
                    ? t('nav.saleIncomeTooltip')
                    : t('nav.saleIncomeTooltip')
                }
              >
                <Coins className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isBusiness
                    ? t('nav.addSale')
                    : t('nav.addIncome')}
                </span>
              </motion.button>
            )}

            {/* Add Expense Primary Button */}
            <motion.button
              id="add-expense-nav-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAddExpense}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold text-white shadow-md transition-all cursor-pointer ${
                isBusiness
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden xs:inline">
                {isBusiness
                  ? t('nav.invoiceSpend')
                  : t('nav.addExpense')}
              </span>
            </motion.button>

            {/* User Profile & Account Menu */}
            <UserProfileMenu
              financeMode={financeMode}
              onChangeFinanceMode={onChangeFinanceMode}
            />
          </div>
        </div>

        {/* Segregated Section Navigation Tabs */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 py-2 gap-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
            {/* 1. Resumen / Estado */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChangeViewMode('status')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                viewMode === 'status'
                  ? isBusiness
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 ring-1 ring-indigo-400/30'
                    : 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-400/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t('nav.tabSummary')}</span>
            </motion.button>

            {/* 2. Gastos */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChangeViewMode('quick-spend')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                viewMode === 'quick-spend'
                  ? isBusiness
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 ring-1 ring-indigo-400/30'
                    : 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-400/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{t('nav.tabExpenses')}</span>
            </motion.button>

            {/* 3. Porcentajes % */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChangeViewMode('budget-percentages')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                viewMode === 'budget-percentages'
                  ? isBusiness
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 ring-1 ring-indigo-400/30'
                    : 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-400/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{t('nav.tabPercentages')}</span>
            </motion.button>

            {/* 4. Reportes & Descargas */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChangeViewMode('downloads')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                viewMode === 'downloads'
                  ? isBusiness
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950 ring-1 ring-indigo-400/30'
                    : 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-400/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('nav.tabReports')}</span>
            </motion.button>
          </div>

          <div className="hidden lg:flex items-center text-[11px] font-medium text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-lg border border-zinc-800">
            <span>
              {isBusiness
                ? (language === 'es'
                    ? '🏢 Modo Negocio: Control de gastos de tu emprendimiento.'
                    : '🏢 Business Mode: Track your business expenses.')
                : t('nav.tip')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

