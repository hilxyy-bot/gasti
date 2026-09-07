import React, { useState, useEffect } from 'react';
import { X, Layers, Sparkles, Check, AlertTriangle, Palette, Building2, User } from 'lucide-react';
import { motion } from 'motion/react';
import { Category, CategoryIconName, FinanceMode, AccountingType } from '../types';
import { AVAILABLE_ICONS, AVAILABLE_COLORS, CategoryIcon } from '../utils/iconMap';
import { useLanguage } from '../context/LanguageContext';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCategory: (category: Omit<Category, 'id'>, categoryId?: string) => void;
  editingCategory?: Category | null;
  existingCategories: Category[];
  financeMode?: FinanceMode;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSaveCategory,
  editingCategory,
  existingCategories,
  financeMode = 'personal',
}) => {
  const { t, language } = useLanguage();
  useLockBodyScroll(isOpen);
  if (!isOpen) return null;

  const [name, setName] = useState(editingCategory?.name || '');
  const [percentage, setPercentage] = useState(
    editingCategory ? editingCategory.percentage.toString() : '10'
  );
  const [color, setColor] = useState(editingCategory?.color || AVAILABLE_COLORS[0]);
  const [icon, setIcon] = useState<CategoryIconName>(editingCategory?.icon || 'Utensils');
  const [description, setDescription] = useState(editingCategory?.description || '');
  const [mode, setMode] = useState<FinanceMode>(
    editingCategory?.mode || financeMode
  );
  const [accountingType, setAccountingType] = useState<AccountingType | undefined>(
    editingCategory?.accountingType || (financeMode === 'business' ? 'opex' : 'needs')
  );
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setPercentage(editingCategory.percentage.toString());
      setColor(editingCategory.color);
      setIcon(editingCategory.icon);
      setDescription(editingCategory.description || '');
      setMode(editingCategory.mode || financeMode);
      setAccountingType(editingCategory.accountingType);
    } else {
      setName('');
      setPercentage('10');
      setColor(AVAILABLE_COLORS[Math.floor(Math.random() * AVAILABLE_COLORS.length)]);
      setIcon(financeMode === 'business' ? 'Briefcase' : 'ShoppingBag');
      setDescription('');
      setMode(financeMode);
      setAccountingType(financeMode === 'business' ? 'opex' : 'needs');
    }
    setError('');
  }, [editingCategory, isOpen, financeMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('modal.errorCategoryName'));
      return;
    }
    const numPercent = parseFloat(percentage);
    if (isNaN(numPercent) || numPercent < 0 || numPercent > 100) {
      setError(t('modal.errorPercentage'));
      return;
    }

    onSaveCategory(
      {
        name: name.trim(),
        percentage: numPercent,
        color,
        icon,
        description: description.trim() || undefined,
        mode,
        accountingType,
        isCustom: true,
      },
      editingCategory?.id
    );
    onClose();
  };

  const isBusinessMode = mode === 'business';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 360 }}
        className="bg-zinc-950 rounded-t-3xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6 shadow-2xl border border-zinc-800 relative max-h-[88dvh] sm:max-h-[90vh] overflow-y-auto overscroll-contain text-zinc-100 flex flex-col"
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-zinc-700/80 rounded-full mx-auto mb-3 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: color }}
            >
              <CategoryIcon name={icon} className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {editingCategory ? t('modal.saveCategory') : t('modal.createCategory')}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isBusinessMode
                  ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/80'
                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
              }`}>
                {isBusinessMode ? t('mode.businessBadge') : t('mode.personalBadge')}
              </span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {error && (
          <div className="mt-3.5 p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              {language === 'es' ? 'Tipo de Cuenta / Ámbito' : 'Account Scope'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMode('personal');
                  if (!accountingType || accountingType === 'cogs' || accountingType === 'payroll') {
                    setAccountingType('needs');
                  }
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  mode === 'personal'
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{t('mode.personal')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('business');
                  if (!accountingType || accountingType === 'needs' || accountingType === 'wants') {
                    setAccountingType('opex');
                  }
                }}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  mode === 'business'
                    ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 ring-1 ring-indigo-500/40'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{t('mode.business')}</span>
              </button>
            </div>
          </div>

          {/* Accounting Classification */}
          {mode === 'business' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1.5">
                {language === 'es' ? 'Clasificación Contable' : 'Accounting Type'}
              </label>
              <select
                value={accountingType || 'opex'}
                onChange={(e) => setAccountingType(e.target.value as AccountingType)}
                className="w-full px-3.5 py-2 text-xs font-semibold bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-zinc-100 cursor-pointer"
              >
                <option value="cogs">COGS - Costo Directo de Ventas / Mercancía</option>
                <option value="payroll">Nómina - Sueldos, Equipo & Honorarios</option>
                <option value="opex">OPEX - Gastos Operativos, Renta & Software</option>
                <option value="marketing">Marketing - Publicidad, Ads & Ventas</option>
                <option value="taxes">Impuestos - IVA, ISR & Reserva Fiscal</option>
                <option value="profit">Utilidad Neta / Margen & Ganancia</option>
                <option value="capex">CAPEX - Inversión en Activos & Equipamiento</option>
              </select>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              {t('modal.categoryName')}
            </label>
            <input
              type="text"
              placeholder={
                mode === 'business'
                  ? (language === 'es' ? 'Ej: Servidores Cloud & SaaS' : 'e.g. Cloud Hosting & SaaS')
                  : t('modal.categoryPlaceholder')
              }
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Percentage */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              {t('modal.percentage')}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                style={{ accentColor: color }}
                className="w-full h-2 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="w-12 text-sm font-bold text-white text-right focus:outline-none bg-transparent"
                />
                <span className="text-xs font-bold text-zinc-400 ml-1">%</span>
              </div>
            </div>
          </div>

          {/* Color Selection with Color Picker & Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                {t('modal.colorTheme')}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-semibold text-zinc-400 uppercase">{color}</span>
                <label className="cursor-pointer inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-zinc-900 px-2 py-0.5 rounded-md border border-zinc-800">
                  <Palette className="w-3 h-3" />
                  <span>Custom</span>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-10 gap-2 p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80">
              {AVAILABLE_COLORS.map((c) => (
                <motion.button
                  key={c}
                  type="button"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    color.toLowerCase() === c.toLowerCase()
                      ? 'ring-2 ring-offset-2 ring-offset-zinc-950 ring-white scale-110 shadow-lg'
                      : 'opacity-90 hover:opacity-100'
                  }`}
                  title={c}
                >
                  {color.toLowerCase() === c.toLowerCase() && (
                    <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              {t('modal.icon')}
            </label>
            <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1.5 border border-zinc-800/80 rounded-xl bg-zinc-900/80">
              {AVAILABLE_ICONS.map((item) => {
                const isSelected = icon === item.name;
                return (
                  <motion.button
                    key={item.name}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIcon(item.name)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? isBusinessMode
                          ? 'bg-indigo-600 text-white shadow-sm font-bold'
                          : 'bg-emerald-600 text-white shadow-sm font-bold'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                    title={item.label}
                  >
                    <CategoryIcon name={item.name} className="w-4 h-4 mb-1" />
                    <span className="text-[9px] truncate max-w-full font-medium">
                      {item.label.split(' ')[0]}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
              {t('modal.description')}
            </label>
            <input
              type="text"
              placeholder={t('modal.descriptionPlaceholder')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white placeholder:text-zinc-500"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800/80">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {t('modal.cancel')}
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 text-sm font-bold text-white rounded-xl shadow-md transition-all cursor-pointer ${
                isBusinessMode
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950'
              }`}
            >
              {editingCategory ? t('modal.saveChanges') : t('modal.saveCategory')}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
