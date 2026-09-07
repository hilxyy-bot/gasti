import React, { useState, useEffect } from 'react';
import {
  X,
  Coins,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Calendar,
  Sparkles,
  History,
  Sliders,
  MinusCircle,
  AlertCircle,
  RefreshCcw,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { CapitalAddition, Currency, FinanceMode, CapitalSourceType } from '../types';
import { formatCurrency, getCapitalLabel } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';

interface AddCapitalModalProps {
  isOpen: boolean;
  onClose: () => void;
  financeMode: FinanceMode;
  currency: Currency;
  baseCapital: number;
  totalCapital: number;
  additions: CapitalAddition[];
  capitalType: CapitalSourceType;
  capitalCustomLabel: string;
  currentYearMonth: string;
  initialTab?: 'add' | 'reduce' | 'base' | 'history';
  onAddAddition: (addition: Omit<CapitalAddition, 'id' | 'createdAt'>) => void;
  onDeleteAddition: (id: string) => void;
  onUpdateBaseCapital: (newBase: number) => void;
  onUpdateCapitalSource: (type: CapitalSourceType, customLabel?: string) => void;
}

export const AddCapitalModal: React.FC<AddCapitalModalProps> = ({
  isOpen,
  onClose,
  financeMode,
  currency,
  baseCapital,
  totalCapital,
  additions,
  capitalType,
  capitalCustomLabel,
  currentYearMonth,
  initialTab = 'add',
  onAddAddition,
  onDeleteAddition,
  onUpdateBaseCapital,
  onUpdateCapitalSource,
}) => {
  const { language } = useLanguage();
  useLockBodyScroll(isOpen);
  const isEs = language === 'es';
  const isBusiness = financeMode === 'business';

  const [activeTab, setActiveTab] = useState<'add' | 'reduce' | 'base' | 'history'>(initialTab);

  // Today string for defaults
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultDate = todayStr.startsWith(currentYearMonth)
    ? todayStr
    : `${currentYearMonth}-01`;

  // Add addition form state
  const [amountStr, setAmountStr] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categorySource, setCategorySource] = useState<string>(
    isBusiness ? 'Venta Mostrador' : 'Ingreso Extra'
  );
  const [date, setDate] = useState<string>(defaultDate);

  // Reduce / Correction form state
  const [reduceAmountStr, setReduceAmountStr] = useState<string>('');
  const [reduceDescription, setReduceDescription] = useState<string>('');
  const [reduceReason, setReduceReason] = useState<string>(
    isBusiness ? 'Corrección por error de tipeo' : 'Corrección por error de tipeo'
  );
  const [reduceDate, setReduceDate] = useState<string>(defaultDate);

  const [error, setError] = useState<string>('');

  // Base capital form state
  const [tempBaseStr, setTempBaseStr] = useState<string>(baseCapital.toString());
  const [selectedType, setSelectedType] = useState<CapitalSourceType>(capitalType);
  const [tempCustomLabel, setTempCustomLabel] = useState<string>(capitalCustomLabel);
  const [directTargetTotalStr, setDirectTargetTotalStr] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'add');
      setTempBaseStr(baseCapital.toString());
      setSelectedType(capitalType);
      setTempCustomLabel(capitalCustomLabel);
      setError('');
    }
  }, [isOpen, initialTab, baseCapital, capitalType, capitalCustomLabel]);

  if (!isOpen) return null;

  const capitalTitle = getCapitalLabel(capitalType, capitalCustomLabel, language);

  // Presets for adding
  const businessSourcePresets = [
    { label: isEs ? 'Venta Mostrador / Tienda' : 'Counter / Store Sale', icon: '🛍️' },
    { label: isEs ? 'Venta Online / Web' : 'Online Sale', icon: '🌐' },
    { label: isEs ? 'Cobro Factura / Cliente' : 'Client Invoice Paid', icon: '🧾' },
    { label: isEs ? 'Servicios / Asesoría' : 'Service / Advisory', icon: '🤝' },
    { label: isEs ? 'Inyección de Capital / Socio' : 'Capital Injection / Partner', icon: '💼' },
    { label: isEs ? 'Otro Ingreso' : 'Other Income', icon: '✨' },
  ];

  const personalSourcePresets = [
    { label: isEs ? 'Freelance / Trabajo Extra' : 'Freelance / Extra Work', icon: '💼' },
    { label: isEs ? 'Venta de Artículo / Usado' : 'Item Sold', icon: '🛍️' },
    { label: isEs ? 'Bono / Gratificación' : 'Bonus / Reward', icon: '🎁' },
    { label: isEs ? 'Comisión o Propina' : 'Commission or Tip', icon: '💰' },
    { label: isEs ? 'Rendimiento Inversión' : 'Investment Return', icon: '📈' },
    { label: isEs ? 'Otro Ingreso' : 'Other Income', icon: '✨' },
  ];

  // Presets for reducing / mistakes
  const businessReducePresets = [
    { label: isEs ? 'Corrección de error de tipeo' : 'Typo / Input correction', icon: '✏️' },
    { label: isEs ? 'Devolución a cliente' : 'Client refund / Return', icon: '↩️' },
    { label: isEs ? 'Venta anulada / Cancelada' : 'Cancelled sale', icon: '❌' },
    { label: isEs ? 'Descuento posterior aplicado' : 'Post-discount adjustment', icon: '🏷️' },
    { label: isEs ? 'Ajuste de arqueo de caja' : 'Cash register adjustment', icon: '⚖️' },
  ];

  const personalReducePresets = [
    { label: isEs ? 'Corrección por error de tipeo' : 'Typo correction', icon: '✏️' },
    { label: isEs ? 'Devolución / Reembolso' : 'Refund', icon: '↩️' },
    { label: isEs ? 'Ajuste de saldo real' : 'Balance adjustment', icon: '⚖️' },
    { label: isEs ? 'Descuento no contemplado' : 'Unexpected deduction', icon: '📉' },
    { label: isEs ? 'Otro ajuste de salida' : 'Other adjustment', icon: '✨' },
  ];

  const sourcePresets = isBusiness ? businessSourcePresets : personalSourcePresets;
  const reducePresets = isBusiness ? businessReducePresets : personalReducePresets;

  const quickAmounts = isBusiness
    ? [100, 250, 500, 1000, 2500, 5000]
    : [20, 50, 100, 250, 500, 1000];

  const quickReduceAmounts = isBusiness
    ? [50, 100, 250, 500, 1000]
    : [20, 50, 100, 200, 500];

  const handleQuickAddAmount = (val: number) => {
    const current = parseFloat(amountStr) || 0;
    setAmountStr((current + val).toString());
  };

  const handleQuickReduceAmount = (val: number) => {
    const current = parseFloat(reduceAmountStr) || 0;
    setReduceAmountStr((current + val).toString());
  };

  const handleSubmitAddition = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = parseFloat(amountStr);
    if (isNaN(parsed) || parsed <= 0) {
      setError(isEs ? 'Ingresa un monto válido mayor a 0' : 'Enter a valid amount greater than 0');
      return;
    }

    const cleanDesc = description.trim() || categorySource;

    onAddAddition({
      amount: parsed,
      description: cleanDesc,
      date,
      mode: financeMode,
      categorySource,
    });

    setAmountStr('');
    setDescription('');
    onClose();
  };

  const handleSubmitReduction = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsed = parseFloat(reduceAmountStr);
    if (isNaN(parsed) || parsed <= 0) {
      setError(isEs ? 'Ingresa un monto válido mayor a 0 para reducir' : 'Enter a valid amount greater than 0');
      return;
    }

    if (totalCapital - parsed < 0) {
      setError(
        isEs
          ? `No puedes reducir más de lo que tienes disponible (${formatCurrency(totalCapital, currency)})`
          : `Cannot reduce more than available capital (${formatCurrency(totalCapital, currency)})`
      );
      return;
    }

    const cleanDesc = reduceDescription.trim() || reduceReason;

    onAddAddition({
      amount: -parsed,
      description: cleanDesc,
      date: reduceDate,
      mode: financeMode,
      categorySource: reduceReason,
    });

    setReduceAmountStr('');
    setReduceDescription('');
    onClose();
  };

  const handleSaveBaseCapital = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(tempBaseStr);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateBaseCapital(parsed);
      onUpdateCapitalSource(selectedType, selectedType === 'custom' ? tempCustomLabel : undefined);
      onClose();
    }
  };

  const handleApplyDirectTotal = () => {
    const target = parseFloat(directTargetTotalStr);
    if (isNaN(target) || target < 0) {
      setError(isEs ? 'Ingresa un capital total objetivo válido' : 'Enter a valid target total');
      return;
    }
    // Calculate new base needed so base + additionsTotal = target
    const currentAdditionsSum = additions.reduce((sum, a) => sum + a.amount, 0);
    const newBase = Math.max(0, target - currentAdditionsSum);
    onUpdateBaseCapital(newBase);
    setDirectTargetTotalStr('');
    onClose();
  };

  const totalAdditions = additions.reduce((sum, a) => sum + a.amount, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 360 }}
        className="bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col text-zinc-100 max-h-[88dvh] sm:max-h-[92vh] overscroll-contain"
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-zinc-700/80 rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Header */}
        <div
          className={`p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between ${
            isBusiness ? 'bg-indigo-950/40' : 'bg-emerald-950/40'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-sm ${
                activeTab === 'reduce'
                  ? 'bg-rose-950/70 text-rose-300 border-rose-700/70'
                  : isBusiness
                  ? 'bg-indigo-900/60 text-indigo-300 border-indigo-700/60'
                  : 'bg-emerald-900/60 text-emerald-300 border-emerald-700/60'
              }`}
            >
              {activeTab === 'reduce' ? (
                <MinusCircle className="w-5 h-5" />
              ) : (
                <Coins className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                  {activeTab === 'reduce'
                    ? isEs
                      ? 'Reducir Capital o Corregir Error'
                      : 'Reduce Capital or Fix Error'
                    : isBusiness
                    ? isEs
                      ? 'Gestionar Capital y Ventas'
                      : 'Manage Capital & Sales'
                    : isEs
                    ? 'Gestionar Capital e Ingresos'
                    : 'Manage Capital & Income'}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    isBusiness
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}
                >
                  {isBusiness ? (isEs ? 'Negocio' : 'Business') : (isEs ? 'Personal' : 'Personal')}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isEs
                  ? 'Suma ventas, resta en caso de equivocación o ajusta tu balance base.'
                  : 'Add sales, deduct corrections or adjust your baseline balance.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Capital Summary Strip */}
        <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                {isEs ? 'Base Inicial:' : 'Base Capital:'}
              </span>
              <span className="font-mono font-bold text-zinc-300">
                {formatCurrency(baseCapital, currency)}
              </span>
            </div>
            <div className="text-zinc-600 font-bold">
              {totalAdditions >= 0 ? '+' : ''}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold block text-zinc-400">
                {isBusiness
                  ? isEs
                    ? 'Ventas / Movimientos:'
                    : 'Sales / Flows:'
                  : isEs
                  ? 'Extras / Movimientos:'
                  : 'Additions:'}
              </span>
              <span
                className={`font-mono font-bold ${
                  totalAdditions >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {totalAdditions >= 0 ? '+' : ''}
                {formatCurrency(totalAdditions, currency)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-zinc-400 block">
              {isEs ? 'Total Disponible:' : 'Total Available:'}
            </span>
            <span className="font-mono text-sm font-extrabold text-white">
              {formatCurrency(totalCapital, currency)}
            </span>
          </div>
        </div>

        {/* 4 Tabs: Sumar Venta | Reducir / Restar | Historial | Base */}
        <div className="grid grid-cols-4 p-1.5 bg-zinc-950/80 border-b border-zinc-800 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer truncate ${
              activeTab === 'add'
                ? isBusiness
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{isEs ? 'Sumar (+)' : 'Add (+)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reduce')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer truncate ${
              activeTab === 'reduce'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white hover:text-rose-300'
            }`}
          >
            <MinusCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{isEs ? 'Restar (-)' : 'Deduct (-)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer truncate ${
              activeTab === 'history'
                ? isBusiness
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {isEs ? 'Historial' : 'History'} ({additions.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('base')}
            className={`py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer truncate ${
              activeTab === 'base'
                ? isBusiness
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-emerald-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{isEs ? 'Base' : 'Base'}</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: ADD CAPITAL / SALES */}
          {activeTab === 'add' && (
            <form onSubmit={handleSubmitAddition} className="space-y-4">
              {/* Amount Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {isBusiness
                      ? isEs
                        ? 'Monto de la Venta o Cobro'
                        : 'Sale or Inflow Amount'
                      : isEs
                      ? 'Monto a Sumar al Capital'
                      : 'Amount to Add'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reduce')}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <MinusCircle className="w-3 h-3" />
                    <span>{isEs ? '¿Te equivocaste? Restar aquí' : 'Need to deduct?'}</span>
                  </button>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xl font-bold text-zinc-500">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    required
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-2xl pl-9 pr-4 py-3 text-2xl font-black text-white placeholder-zinc-600 transition-colors"
                  />
                </div>
              </div>

              {/* Quick Increment Buttons */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">
                  {isEs ? 'Sumar rápidamente:' : 'Quick add:'}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {quickAmounts.map((qVal) => (
                    <button
                      key={qVal}
                      type="button"
                      onClick={() => handleQuickAddAmount(qVal)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-950 hover:bg-zinc-800 text-emerald-400 hover:text-emerald-300 border border-zinc-800 transition-colors cursor-pointer"
                    >
                      +{currency.symbol}
                      {qVal}
                    </button>
                  ))}
                  {amountStr && (
                    <button
                      type="button"
                      onClick={() => setAmountStr('')}
                      className="px-2 py-1 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 cursor-pointer"
                    >
                      {isEs ? 'Limpiar' : 'Clear'}
                    </button>
                  )}
                </div>
              </div>

              {/* Source Presets */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isBusiness
                    ? isEs
                      ? 'Origen / Tipo de Venta'
                      : 'Sale Source'
                    : isEs
                    ? 'Origen del Ingreso'
                    : 'Income Source'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {sourcePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setCategorySource(preset.label);
                        if (!description) {
                          setDescription(preset.label);
                        }
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-1.5 transition-all cursor-pointer ${
                        categorySource === preset.label
                          ? isBusiness
                            ? 'bg-indigo-950 border-indigo-500 text-white'
                            : 'bg-emerald-950 border-emerald-500 text-white'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-sm">{preset.icon}</span>
                      <span className="text-xs font-bold truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Description Note */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isEs ? 'Detalle o Concepto (Opcional)' : 'Details or Client (Optional)'}
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    isBusiness
                      ? isEs
                        ? 'Ej. Factura #142 - Cliente Carlos'
                        : 'e.g. Invoice #142 - Client Acme'
                      : isEs
                      ? 'Ej. Venta bicicleta, bono semanal'
                      : 'e.g. Sold old laptop, extra shift'
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isEs ? 'Fecha de Entrada' : 'Date'}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Impact Calculation Preview */}
              {parseFloat(amountStr) > 0 && (
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    isBusiness
                      ? 'bg-indigo-950/40 border-indigo-800 text-indigo-200'
                      : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>
                      {isEs
                        ? 'Nuevo Capital Total tras esta suma:'
                        : 'New Total Capital after addition:'}
                    </span>
                  </div>
                  <span className="font-mono font-black text-sm text-white">
                    {formatCurrency(totalCapital + (parseFloat(amountStr) || 0), currency)}
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 px-4 rounded-xl text-white font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  isBusiness
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-950'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isBusiness
                    ? isEs
                      ? 'Sumar Venta al Capital'
                      : 'Add Sale to Capital'
                    : isEs
                    ? 'Sumar Ingreso al Capital'
                    : 'Add Income to Capital'}
                </span>
              </motion.button>
            </form>
          )}

          {/* TAB 2: REDUCE CAPITAL / FIX MISTAKES */}
          {activeTab === 'reduce' && (
            <form onSubmit={handleSubmitReduction} className="space-y-4">
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-xs text-rose-200 flex items-start gap-2.5">
                <MinusCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-rose-100 block">
                    {isEs ? 'Corrección o Reducción de Capital' : 'Capital Deduction / Correction'}
                  </strong>
                  <span>
                    {isEs
                      ? 'Si te equivocaste digitando de más, hubo una devolución de dinero a un cliente o una anulación, resta aquí la cantidad deseada.'
                      : 'If you made an input mistake, processed a customer refund, or cancelled a sale, subtract here.'}
                  </span>
                </div>
              </div>

              {/* Amount to Deduct */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-rose-300">
                  {isEs ? 'Monto a Restar / Reducir' : 'Amount to Deduct'}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xl font-bold text-rose-400">
                    -{currency.symbol}
                  </span>
                  <input
                    type="number"
                    step="any"
                    min="0.01"
                    required
                    value={reduceAmountStr}
                    onChange={(e) => setReduceAmountStr(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-zinc-950 border border-rose-900/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-2xl pl-10 pr-4 py-3 text-2xl font-black text-white placeholder-zinc-600 transition-colors"
                  />
                </div>
              </div>

              {/* Quick Subtraction Buttons */}
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-zinc-400">
                  {isEs ? 'Restar rápidamente:' : 'Quick deduct:'}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {quickReduceAmounts.map((qVal) => (
                    <button
                      key={`reduce-${qVal}`}
                      type="button"
                      onClick={() => handleQuickReduceAmount(qVal)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-zinc-950 hover:bg-zinc-800 text-rose-400 hover:text-rose-300 border border-rose-900/50 transition-colors cursor-pointer"
                    >
                      -{currency.symbol}
                      {qVal}
                    </button>
                  ))}
                  {reduceAmountStr && (
                    <button
                      type="button"
                      onClick={() => setReduceAmountStr('')}
                      className="px-2 py-1 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 cursor-pointer"
                    >
                      {isEs ? 'Limpiar' : 'Clear'}
                    </button>
                  )}
                </div>
              </div>

              {/* Motivo o Razón de la Corrección */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isEs ? 'Motivo de la Reducción o Error' : 'Reason for Deduction'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {reducePresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setReduceReason(preset.label);
                        if (!reduceDescription) {
                          setReduceDescription(preset.label);
                        }
                      }}
                      className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        reduceReason === preset.label
                          ? 'bg-rose-950/80 border-rose-600 text-white'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="text-sm">{preset.icon}</span>
                      <span className="text-xs font-bold truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Note */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isEs ? 'Nota o Aclaración (Opcional)' : 'Note or Reason (Optional)'}
                </label>
                <input
                  type="text"
                  value={reduceDescription}
                  onChange={(e) => setReduceDescription(e.target.value)}
                  placeholder={
                    isEs
                      ? 'Ej. Puse un cero de más, devolución al cliente Pedro'
                      : 'e.g. Extra zero by mistake, client return'
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {isEs ? 'Fecha de la Corrección' : 'Date of Correction'}
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={reduceDate}
                    onChange={(e) => setReduceDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Impact Calculation Preview */}
              {parseFloat(reduceAmountStr) > 0 && (
                <div className="p-3 rounded-xl border border-rose-800 bg-rose-950/40 flex items-center justify-between text-xs text-rose-200">
                  <div className="flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-rose-400" />
                    <span>
                      {isEs ? 'Capital tras la reducción:' : 'Capital after deduction:'}
                    </span>
                  </div>
                  <span className="font-mono font-black text-sm text-white">
                    {formatCurrency(
                      Math.max(0, totalCapital - (parseFloat(reduceAmountStr) || 0)),
                      currency
                    )}
                  </span>
                </div>
              )}

              {/* Submit Deduction */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-xl text-white font-black text-sm bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-950 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <MinusCircle className="w-4 h-4" />
                <span>
                  {isEs
                    ? `Restar ${
                        parseFloat(reduceAmountStr) > 0
                          ? formatCurrency(parseFloat(reduceAmountStr), currency)
                          : ''
                      } al Capital`
                    : `Deduct from Capital`}
                </span>
              </motion.button>
            </form>
          )}

          {/* TAB 3: HISTORY WITH INSTANT UNDO / DELETE */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-300 block">
                    {isEs ? 'Entradas y Ajustes del Mes' : 'Month Movements & Inflows'}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {isEs
                      ? '💡 Si te equivocaste en alguna entrada, pulsa Eliminar para anularla.'
                      : '💡 If you logged something wrong, tap Delete to revert.'}
                  </span>
                </div>
                <span
                  className={`text-xs font-extrabold font-mono ${
                    totalAdditions >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {totalAdditions >= 0 ? '+' : ''}
                  {formatCurrency(totalAdditions, currency)}
                </span>
              </div>

              {additions.length === 0 ? (
                <div className="text-center py-8 bg-zinc-950 rounded-2xl border border-zinc-800/80 p-4 space-y-2">
                  <Sparkles className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs font-bold text-zinc-300">
                    {isEs
                      ? 'Aún no hay entradas ni correcciones registradas este mes.'
                      : 'No additions or adjustments logged yet this month.'}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    {isEs
                      ? 'Usa la pestaña "Sumar" para registrar ventas o "Restar" para corregir.'
                      : 'Use "Add" to record sales or "Deduct" to fix errors.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {additions.map((item) => {
                    const isNegative = item.amount < 0;
                    return (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl bg-zinc-950 border flex items-center justify-between gap-3 group transition-colors ${
                          isNegative
                            ? 'border-rose-900/60 hover:border-rose-700'
                            : 'border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-white truncate">
                              {item.description}
                            </span>
                            {item.categorySource && (
                              <span
                                className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 font-medium ${
                                  isNegative
                                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                                }`}
                              >
                                {item.categorySource}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">
                            {item.date}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          <span
                            className={`text-sm font-extrabold font-mono ${
                              isNegative ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {isNegative ? '-' : '+'}
                            {formatCurrency(Math.abs(item.amount), currency)}
                          </span>
                          <button
                            type="button"
                            onClick={() => onDeleteAddition(item.id)}
                            className="px-2 py-1 text-[11px] font-bold text-rose-400 hover:text-white hover:bg-rose-600/80 bg-rose-950/40 border border-rose-900/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            title={isEs ? 'Eliminar / Deshacer esta entrada' : 'Delete / Revert this entry'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">
                              {isEs ? 'Eliminar' : 'Delete'}
                            </span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BASE CONFIG & DIRECT TOTAL OVERRIDE */}
          {activeTab === 'base' && (
            <div className="space-y-5">
              {/* Option A: Adjust Base Capital */}
              <form onSubmit={handleSaveBaseCapital} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    {isEs ? 'Ajustar Capital Base Inicial' : 'Adjust Base Capital'}
                  </label>
                  <p className="text-[11px] text-zinc-400">
                    {isBusiness
                      ? isEs
                        ? 'Es el fondo inicial de apertura del negocio antes de registrar las ventas del mes.'
                        : 'Starting cash reserve before daily sales.'
                      : isEs
                      ? 'Es tu fondo base o sueldo fijo inicial antes de sumar extras o ingresos adicionales.'
                      : 'Fixed starting budget or baseline salary.'}
                  </p>
                  <div className="relative flex items-center mt-2">
                    <span className="absolute left-3.5 text-xl font-bold text-zinc-500">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      required
                      value={tempBaseStr}
                      onChange={(e) => setTempBaseStr(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-2xl pl-9 pr-4 py-2.5 text-xl font-extrabold text-white"
                    />
                  </div>
                </div>

                {/* Capital Type Selector */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    {isEs ? 'Tipo de Capital:' : 'Capital Nature / Type:'}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'capital', label: isEs ? 'Capital' : 'Capital', icon: '🏦' },
                      { id: 'salary', label: isEs ? 'Sueldo' : 'Salary', icon: '💵' },
                      { id: 'investment', label: isEs ? 'Inversión' : 'Investment', icon: '📈' },
                      { id: 'project', label: isEs ? 'Proyecto' : 'Project', icon: '🚀' },
                      { id: 'extra', label: isEs ? 'Bono/Extra' : 'Extra', icon: '🎁' },
                      { id: 'custom', label: isEs ? 'Personalizado' : 'Custom', icon: '✏️' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedType(item.id as CapitalSourceType)}
                        className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                          selectedType === item.id
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
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
                      placeholder={
                        isEs ? 'Ej. Capital Semilla, Caja Chica...' : 'e.g. Seed Fund, Petty Cash...'
                      }
                      className="w-full text-xs font-semibold text-white bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 mt-2 focus:outline-none focus:border-emerald-500"
                    />
                  )}
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  {isEs ? 'Guardar Configuración Base' : 'Save Base Configuration'}
                </motion.button>
              </form>

              {/* Option B: Direct Desired Total Override */}
              <div className="pt-4 border-t border-zinc-800 space-y-2">
                <div className="flex items-center gap-1.5 text-zinc-300 text-xs font-bold">
                  <RefreshCcw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {isEs
                      ? '¿Prefieres fijar el Total Exacto directamente?'
                      : 'Or set Exact Total Directly?'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  {isEs
                    ? 'Si hubo confusiones en las sumas y sabes que tu total real debe ser un monto específico, escribe el total exacto aquí:'
                    : 'If you want to set your exact target total, enter it here and the base will adjust:'}
                </p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={directTargetTotalStr}
                      onChange={(e) => setDirectTargetTotalStr(e.target.value)}
                      placeholder={totalCapital.toString()}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-2 text-sm font-extrabold text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyDirectTotal}
                    disabled={!directTargetTotalStr}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    {isEs ? 'Fijar Total' : 'Set Total'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
