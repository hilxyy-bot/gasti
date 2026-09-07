import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Plus,
  RefreshCw,
  Trash2,
  Edit,
  Sparkles,
  Percent,
  Building2,
  User,
  Wallet,
  DollarSign,
  Check,
  TrendingUp,
  Tag,
  Coins,
  Landmark,
  Briefcase,
  Layers,
  MinusCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Category, Currency, BudgetPreset, FinanceMode, CapitalSourceType } from '../types';
import {
  PERSONAL_BUDGET_PRESETS,
  BUSINESS_BUDGET_PRESETS,
  BUDGET_PRESETS,
} from '../data/initialData';
import { formatCurrency, calculateCategoryBudget, getCapitalLabel } from '../utils/formatters';
import { CategoryIcon } from '../utils/iconMap';
import { CategoryColorPicker } from './CategoryColorPicker';
import { useLanguage } from '../context/LanguageContext';
import {
  getLocalizedCategoryName,
  getLocalizedCategoryDescription,
  getLocalizedPreset,
  getLocalizedCapitalSource,
} from '../utils/categoryLocalization';

interface BudgetPercentageManagerProps {
  categories: Category[];
  income: number;
  currency: Currency;
  financeMode?: FinanceMode;
  baseCapital?: number;
  additionsTotal?: number;
  onOpenAddCapital?: (initialTab?: 'add' | 'reduce' | 'base' | 'history') => void;
  onQuickAddAddition?: (amount: number, description: string) => void;
  onUpdateIncome?: (newIncome: number) => void;
  onUpdateCategoryPercentage: (categoryId: string, percentage: number) => void;
  onUpdateCategoryColor?: (categoryId: string, color: string) => void;
  onApplyPreset: (preset: BudgetPreset) => void;
  onOpenAddCategory: () => void;
  onOpenEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onAutoNormalize: () => void;
  capitalType?: CapitalSourceType;
  capitalCustomLabel?: string;
  onUpdateCapitalSource?: (type: CapitalSourceType, customLabel?: string) => void;
}

export const BudgetPercentageManager: React.FC<BudgetPercentageManagerProps> = ({
  categories,
  income,
  currency,
  financeMode = 'personal',
  baseCapital,
  additionsTotal = 0,
  onOpenAddCapital,
  onQuickAddAddition,
  onUpdateIncome,
  onUpdateCategoryPercentage,
  onUpdateCategoryColor,
  onApplyPreset,
  onOpenAddCategory,
  onOpenEditCategory,
  onDeleteCategory,
  onAutoNormalize,
  capitalType = 'capital',
  capitalCustomLabel = '',
  onUpdateCapitalSource,
}) => {
  const { t, language } = useLanguage();
  const isBusiness = financeMode === 'business';
  const isEs = language === 'es';

  const [inputBudgetVal, setInputBudgetVal] = useState(income.toString());
  const [selectedType, setSelectedType] = useState<CapitalSourceType>(capitalType);
  const [tempCustomLabel, setTempCustomLabel] = useState(capitalCustomLabel);

  useEffect(() => {
    setInputBudgetVal(income.toString());
  }, [income]);

  useEffect(() => {
    setSelectedType(capitalType);
  }, [capitalType]);

  useEffect(() => {
    setTempCustomLabel(capitalCustomLabel);
  }, [capitalCustomLabel]);

  const totalPercentage = categories.reduce((sum, c) => sum + (c.percentage || 0), 0);
  const totalBudgetedDollars = (income * totalPercentage) / 100;
  const isOverallocated = totalPercentage > 100;
  const isExact100 = totalPercentage === 100;
  const unallocatedPercent = Math.max(0, 100 - totalPercentage);
  const unallocatedDollars = (income * unallocatedPercent) / 100;

  const currentPresets = isBusiness ? BUSINESS_BUDGET_PRESETS : PERSONAL_BUDGET_PRESETS;
  const capitalTitle = getCapitalLabel(capitalType, capitalCustomLabel, language);

  const capitalTypesList: { id: CapitalSourceType; label: string; icon: string }[] = [
    { id: 'capital', label: getLocalizedCapitalSource('capital', undefined, language), icon: '🏦' },
    { id: 'salary', label: getLocalizedCapitalSource('salary', undefined, language), icon: '💵' },
    { id: 'investment', label: getLocalizedCapitalSource('investment', undefined, language), icon: '📈' },
    { id: 'project', label: getLocalizedCapitalSource('project', undefined, language), icon: '🚀' },
    { id: 'extra', label: getLocalizedCapitalSource('extra', undefined, language), icon: '🎁' },
    { id: 'custom', label: getLocalizedCapitalSource('custom', isEs ? 'Otro' : 'Custom', language), icon: '✏️' },
  ];

  const handleSelectCapitalType = (type: CapitalSourceType) => {
    setSelectedType(type);
    if (onUpdateCapitalSource) {
      onUpdateCapitalSource(type, type === 'custom' ? tempCustomLabel : undefined);
    }
  };

  const handleCustomLabelChange = (val: string) => {
    setTempCustomLabel(val);
    if (onUpdateCapitalSource && selectedType === 'custom') {
      onUpdateCapitalSource('custom', val);
    }
  };

  return (
    <div className="bg-zinc-900/90 rounded-2xl p-5 sm:p-6 border border-zinc-800 shadow-md space-y-6 text-zinc-100">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                isBusiness
                  ? 'bg-indigo-950/80 text-indigo-400 border-indigo-800/60'
                  : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {isBusiness
                ? (language === 'es' ? 'Reparto de Presupuesto & Capital (%)' : 'Budget & Capital Allocator (%)')
                : (language === 'es' ? 'Reparto de Capital & Porcentajes (%)' : 'Capital & Percentage Allocator (%)')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {isEs
              ? 'Destina tu capital o ingresos y repártelo porcentualmente entre tus categorías.'
              : 'Allocate your capital or income and distribute it with percentages among categories.'}{' '}
            (<span className="text-white font-semibold">{capitalTitle}: {formatCurrency(income, currency)}</span>)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Add Category button */}
          <motion.button
            id="add-category-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenAddCategory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className={`w-4 h-4 ${isBusiness ? 'text-indigo-400' : 'text-emerald-400'}`} />
            <span>
              {isBusiness
                ? (language === 'es' ? 'Nueva Cuenta / Partida' : 'New Account')
                : t('manager.addCategory')}
            </span>
          </motion.button>

          {/* Auto Normalize button if not 100% */}
          {!isExact100 && categories.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAutoNormalize}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg border transition-colors cursor-pointer ${
                isBusiness
                  ? 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-800'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-400 border-emerald-800'
              }`}
              title={t('manager.autoBalance')}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('manager.autoBalance')}</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Interactive Capital & Budget Input Card (Direct Allocation) */}
      {onUpdateIncome && (
        <div className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 ${
          isBusiness
            ? 'bg-gradient-to-br from-indigo-950/40 via-zinc-950 to-zinc-900/90 border-indigo-800/60'
            : 'bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-900/90 border-emerald-800/60'
        }`}>
          {/* Row 1: Title & Capital Type Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-zinc-800/60">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${
                isBusiness
                  ? 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60'
                  : 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60'
              }`}>
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                    {isEs ? 'Capital / Fondo a Repartir' : 'Capital / Fund to Allocate'}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-emerald-300 border border-zinc-700">
                    {capitalTitle}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  {isEs
                    ? 'Define cuánto capital tienes y qué origen representa para repartirlo en % entre categorías.'
                    : 'Set your capital amount and source to distribute across categories by percentage.'}
                </p>
              </div>
            </div>

            {/* Quick Capital Origin Buttons */}
            <div className="flex items-center gap-1 flex-wrap">
              {capitalTypesList.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectCapitalType(item.id)}
                  className={`px-2 py-1 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                    selectedType === item.id
                      ? isBusiness
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Custom Label Input */}
          {selectedType === 'custom' && (
            <div className="flex items-center gap-2 bg-zinc-950/80 p-2 rounded-xl border border-zinc-800">
              <span className="text-xs font-semibold text-zinc-400">
                {isEs ? 'Nombre del Capital:' : 'Capital Name:'}
              </span>
              <input
                type="text"
                value={tempCustomLabel}
                onChange={(e) => handleCustomLabelChange(e.target.value)}
                placeholder={isEs ? 'Ej. Capital Semilla, Fondo de Ahorro, Bono...' : 'e.g. Seed Capital, Vacation Fund...'}
                className="flex-1 text-xs font-bold text-white bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Row 2: Breakdown, Amount Input & Quick Presets */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-400 whitespace-nowrap">
                  {isEs ? 'Capital Total:' : 'Total Capital:'}
                </span>
                <span className="text-xl font-extrabold text-white font-mono">
                  {formatCurrency(income, currency)}
                </span>
              </div>

              {additionsTotal !== 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs">
                  <span className="text-zinc-400">
                    {isEs ? 'Base:' : 'Base:'} <strong className="text-zinc-200 font-mono">{formatCurrency(baseCapital ?? (income - additionsTotal), currency)}</strong>
                  </span>
                  <span className="text-zinc-600 font-bold">{additionsTotal > 0 ? '+' : '-'}</span>
                  <span className={`${additionsTotal > 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold font-mono`}>
                    {additionsTotal > 0
                      ? (isBusiness ? (isEs ? 'Ventas:' : 'Sales:') : (isEs ? 'Extras:' : 'Extras:'))
                      : (isEs ? 'Ajustes:' : 'Deductions:')}{' '}
                    {additionsTotal > 0 ? '+' : ''}
                    {formatCurrency(additionsTotal, currency)}
                  </span>
                </div>
              )}

              {onOpenAddCapital && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenAddCapital('add')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer ${
                      isBusiness
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-950'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>
                      {isBusiness
                        ? (isEs ? '+ Sumar Venta' : '+ Add Sale')
                        : (isEs ? '+ Sumar Ingreso' : '+ Add Income')}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAddCapital('reduce')}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 shadow-md flex items-center gap-1 transition-all cursor-pointer"
                    title={isEs ? 'Restar capital si hubo equivocación' : 'Deduct capital if mistake made'}
                  >
                    <MinusCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>{isEs ? '- Reducir' : '- Deduct'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Quick Add Pill Buttons */}
            {onQuickAddAddition && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-zinc-400 font-semibold mr-0.5">
                  {isEs ? 'Sumar directo:' : 'Quick add:'}
                </span>
                {(isBusiness ? [100, 250, 500, 1000, 2500] : [50, 100, 200, 500, 1000]).map((amt) => (
                  <button
                    key={`quick-add-${amt}`}
                    type="button"
                    onClick={() =>
                      onQuickAddAddition(
                        amt,
                        isBusiness
                          ? (isEs ? 'Venta rápida' : 'Quick sale')
                          : (isEs ? 'Ingreso extra' : 'Extra income')
                      )
                    }
                    className="px-2 py-1 text-xs font-bold rounded-lg bg-zinc-950 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 border border-zinc-800 transition-colors cursor-pointer active:scale-95"
                    title={isEs ? `Sumar ${currency.symbol}${amt} de inmediato al capital` : `Add ${currency.symbol}${amt}`}
                  >
                    +{currency.symbol}{amt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preset Distribution Models */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {isBusiness
              ? (language === 'es' ? 'Modelos Contables & Reparto Estratégico' : 'Accounting & Allocation Models')
              : t('manager.presets')}
          </span>
          <span className={`text-[11px] font-semibold ${isBusiness ? 'text-indigo-400' : 'text-emerald-400'}`}>
            {isBusiness ? '🏢 Negocio' : '👤 Personal'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {currentPresets.map((preset) => {
            const locPreset = getLocalizedPreset(preset, language);
            return (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onApplyPreset(preset)}
                className={`text-left p-3 rounded-xl border transition-all group cursor-pointer ${
                  isBusiness
                    ? 'border-zinc-800 bg-zinc-950/80 hover:border-indigo-500 hover:bg-zinc-900'
                    : 'border-zinc-800 bg-zinc-950/80 hover:border-emerald-500 hover:bg-zinc-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold text-zinc-200 transition-colors ${
                      isBusiness ? 'group-hover:text-indigo-300' : 'group-hover:text-emerald-300'
                    }`}
                  >
                    {locPreset.name}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
                  {locPreset.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Visual Stacked Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-bold text-zinc-300">{t('manager.totalAllocated')}</span>
          <div className="flex items-center gap-2">
            <span
              className={`font-bold px-2.5 py-0.5 rounded-full text-xs border ${
                isOverallocated
                  ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                  : isExact100
                  ? isBusiness
                    ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700'
                    : 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                  : 'bg-blue-950/80 text-blue-400 border-blue-800'
              }`}
            >
              {totalPercentage.toFixed(0)}% ({formatCurrency(totalBudgetedDollars, currency)})
            </span>
            {!isExact100 && (
              <span className="text-xs text-zinc-400">
                {isOverallocated
                  ? t('manager.overLimit')
                  : `${t('manager.underLimit')} ${unallocatedPercent}% (${formatCurrency(unallocatedDollars, currency)})`}
              </span>
            )}
            {isExact100 && (
              <span className={`text-xs font-semibold ${isBusiness ? 'text-indigo-300' : 'text-emerald-400'}`}>
                {isBusiness ? '✓ 100% Reparto Contable Perfecto' : t('manager.perfectSplit')}
              </span>
            )}
          </div>
        </div>

        {/* Stacked bar visualization */}
        <div className="w-full h-4 bg-zinc-950 rounded-full overflow-hidden flex shadow-inner border border-zinc-800">
          {categories.map((cat) => {
            if (cat.percentage <= 0) return null;
            const widthPercent = isOverallocated
              ? (cat.percentage / totalPercentage) * 100
              : cat.percentage;

            return (
              <div
                key={cat.id}
                style={{
                  width: `${widthPercent}%`,
                  backgroundColor: cat.color,
                }}
                className="h-full transition-all duration-300 relative group cursor-pointer"
                title={`${cat.name}: ${cat.percentage}% (${formatCurrency(
                  calculateCategoryBudget(income, cat.percentage),
                  currency
                )})`}
              />
            );
          })}
          {!isOverallocated && unallocatedPercent > 0 && (
            <div
              style={{ width: `${unallocatedPercent}%` }}
              className="h-full bg-zinc-800 opacity-60"
              title={`Buffer: ${unallocatedPercent}% (${formatCurrency(
                unallocatedDollars,
                currency
              )})`}
            />
          )}
        </div>
      </div>

      {/* Categories Sliders & Inputs */}
      <div className="space-y-3 pt-2">
        {categories.length === 0 ? (
          <div className="text-center py-10 px-4 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/60">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner border ${
              isBusiness
                ? 'bg-indigo-950/80 border-indigo-800/80 text-indigo-300'
                : 'bg-emerald-950/80 border-emerald-800/80 text-emerald-400'
            }`}>
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-200">{t('manager.emptyTitle')}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-md mx-auto leading-relaxed">
              {t('manager.emptySubtitle')}
            </p>
            <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenAddCategory}
                className={`px-4 py-2 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all cursor-pointer inline-flex items-center gap-2 ${
                  isBusiness
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{t('manager.addFirstCategory')}</span>
              </motion.button>
            </div>
          </div>
        ) : (
          categories.map((cat) => {
            const categoryBudget = calculateCategoryBudget(income, cat.percentage);

            return (
              <div
                key={cat.id}
                className="bg-zinc-950/90 hover:bg-zinc-950 rounded-xl p-3.5 sm:p-4 border border-zinc-800/90 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                  {/* Category info + Color Picker */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {onUpdateCategoryColor ? (
                        <CategoryColorPicker
                          color={cat.color}
                          categoryName={getLocalizedCategoryName(cat, language)}
                          onChangeColor={(newColor) => onUpdateCategoryColor(cat.id, newColor)}
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                          style={{ backgroundColor: cat.color }}
                        >
                          <CategoryIcon name={cat.icon} className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm sm:text-base text-white">
                          {getLocalizedCategoryName(cat, language)}
                        </span>
                        {cat.isCustom && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">
                        {getLocalizedCategoryDescription(cat, language) || `${cat.percentage}% of total monthly budget`}
                      </p>
                    </div>
                  </div>

                  {/* Percentage & Dollar controls */}
                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    {/* Percentage number input */}
                    <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-700 px-2 py-1 shadow-inner">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={cat.percentage}
                        onChange={(e) => {
                          const val = Math.max(0, Math.min(100, parseFloat(e.target.value) || 0));
                          onUpdateCategoryPercentage(cat.id, val);
                        }}
                        className="w-12 text-sm font-bold text-white text-right focus:outline-none bg-transparent"
                      />
                      <span className="text-xs font-bold text-zinc-400 ml-1">%</span>
                    </div>

                    {/* Calculated Dollar Value (editable) */}
                    <div className="flex items-center bg-zinc-900 rounded-lg border border-zinc-700 px-2.5 py-1 shadow-inner">
                      <span className="text-xs font-bold text-zinc-400 mr-1">{currency.symbol}</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={categoryBudget.toFixed(0)}
                        onChange={(e) => {
                          const dollarVal = parseFloat(e.target.value) || 0;
                          const newPercent = income > 0 ? (dollarVal / income) * 100 : 0;
                          onUpdateCategoryPercentage(cat.id, Math.round(newPercent));
                        }}
                        className={`w-16 text-sm font-extrabold text-right focus:outline-none bg-transparent ${
                          isBusiness ? 'text-indigo-400' : 'text-emerald-400'
                        }`}
                      />
                    </div>

                    {/* Edit / Delete actions */}
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onOpenEditCategory(cat)}
                        className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        title={t('manager.editCategory')}
                      >
                        <Edit className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                        title={t('manager.deleteCategory')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Range Slider & quick adjustments */}
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={cat.percentage}
                    onChange={(e) => onUpdateCategoryPercentage(cat.id, parseFloat(e.target.value))}
                    style={{ accentColor: cat.color }}
                    className="w-full h-2 bg-zinc-800 rounded-lg cursor-pointer transition-all"
                  />
                  {/* Step buttons (+5% / -5%) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        onUpdateCategoryPercentage(cat.id, Math.max(0, cat.percentage - 5))
                      }
                      className="px-2 py-0.5 text-xs font-bold rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 cursor-pointer"
                    >
                      -5%
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() =>
                        onUpdateCategoryPercentage(cat.id, Math.min(100, cat.percentage + 5))
                      }
                      className="px-2 py-0.5 text-xs font-bold rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 cursor-pointer"
                    >
                      +5%
                    </motion.button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
