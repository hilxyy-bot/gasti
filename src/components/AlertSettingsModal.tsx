import React from 'react';
import { X, Bell, ShieldAlert, Download, Upload, RotateCcw, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { AlertSettings, Currency } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useLockBodyScroll } from '../utils/useLockBodyScroll';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AlertSettings;
  onUpdateSettings: (settings: AlertSettings) => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetToDefaults: () => void;
  currency: Currency;
}

export const AlertSettingsModal: React.FC<AlertSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onExportCSV,
  onExportJSON,
  onImportJSON,
  onResetToDefaults,
}) => {
  const { t } = useLanguage();
  useLockBodyScroll(isOpen);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 360 }}
        className="bg-zinc-950 rounded-t-3xl sm:rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-zinc-800 relative max-h-[88dvh] sm:max-h-[90vh] overflow-y-auto overscroll-contain space-y-5 text-zinc-100 flex flex-col"
      >
        {/* Mobile Pull Handle */}
        <div className="w-12 h-1.5 bg-zinc-700/80 rounded-full mx-auto mb-2 sm:hidden shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center border border-amber-800/60">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-white">
              {t('modal.budgetSettings')}
            </h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Alert Thresholds */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {t('modal.automatedThresholds')}
          </h4>

          {/* Warning threshold slider */}
          <div className="bg-zinc-900/90 rounded-xl p-3.5 border border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber-300">
                {t('modal.warningThreshold')}
              </span>
              <span className="text-sm font-extrabold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800/60">
                {settings.warningThreshold}%
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {t('modal.warningDesc')}
            </p>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={settings.warningThreshold}
              onChange={(e) =>
                onUpdateSettings({ ...settings, warningThreshold: parseInt(e.target.value, 10) })
              }
              className="w-full h-2 bg-zinc-800 rounded-lg cursor-pointer accent-amber-500"
            />
          </div>

          {/* Danger threshold slider */}
          <div className="bg-zinc-900/90 rounded-xl p-3.5 border border-rose-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-rose-300">
                {t('modal.dangerThreshold')}
              </span>
              <span className="text-sm font-extrabold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-md border border-rose-800/60">
                {settings.dangerThreshold}%
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              {t('modal.dangerDesc')}
            </p>
            <input
              type="range"
              min="90"
              max="120"
              step="5"
              value={settings.dangerThreshold}
              onChange={(e) =>
                onUpdateSettings({ ...settings, dangerThreshold: parseInt(e.target.value, 10) })
              }
              className="w-full h-2 bg-zinc-800 rounded-lg cursor-pointer accent-rose-500"
            />
          </div>
        </div>

        {/* Data Backup & Export */}
        <div className="space-y-3 pt-2 border-t border-zinc-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            {t('modal.exportBackup')}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExportCSV}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>{t('modal.exportCSV')}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExportJSON}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-850 hover:border-zinc-700 text-zinc-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-400" />
              <span>{t('modal.backupJSON')}</span>
            </motion.button>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2">
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-bold cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-purple-400" />
              <span>{t('modal.restoreBackup')}</span>
              <input
                type="file"
                accept=".json"
                onChange={onImportJSON}
                className="hidden"
              />
            </label>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (window.confirm(t('modal.resetConfirm'))) {
                  onResetToDefaults();
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-rose-900/60 bg-zinc-900 hover:bg-rose-950/60 text-rose-400 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('modal.resetDefaults')}</span>
            </motion.button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-zinc-800/80">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-colors cursor-pointer"
          >
            {t('modal.done')}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
