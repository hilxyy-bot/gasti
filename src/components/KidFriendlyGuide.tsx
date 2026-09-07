import React from 'react';
import { Sparkles, HelpCircle, Check, X, ArrowRight, Smile, Heart, Gift, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface KidFriendlyGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadKidDemo?: () => void;
}

export const KidFriendlyGuide: React.FC<KidFriendlyGuideProps> = ({
  isOpen,
  onClose,
  onLoadKidDemo,
}) => {
  const { t, language } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-zinc-950 rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-emerald-500/40 relative max-h-[90vh] overflow-y-auto text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {t('kid.title')}
              </h3>
              <p className="text-xs text-emerald-400 font-semibold">
                {t('kid.subtitle')}
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

        {/* Steps */}
        <div className="space-y-4 my-6">
          {/* Step 1 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-900/90 border border-emerald-900/40"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500/30">
              1
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t('kid.step1Title')}</span>
                <span className="text-base">💵</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {t('kid.step1Desc')}
              </p>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-900/90 border border-purple-900/40"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 font-black text-sm flex items-center justify-center shrink-0 border border-purple-500/30">
              2
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t('kid.step2Title')}</span>
                <span className="text-base">🏺</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {t('kid.step2Desc')}
              </p>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-900/90 border border-amber-900/40"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center shrink-0 border border-amber-500/30">
              3
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{t('kid.step3Title')}</span>
                <span className="text-base">📝</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {t('kid.step3Desc')}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Tip Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-teal-950/40 border border-emerald-800/40 text-xs text-emerald-300 flex items-center gap-2.5">
          <Smile className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>
            {language === 'es'
              ? '¡Regla de oro: Si la barra se pone roja, significa que esa alcancía se quedó vacía!'
              : 'Golden rule: If a bar turns red, that piggy bank is empty! Keep them in the green.'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-zinc-800 mt-6">
          {onLoadKidDemo && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onLoadKidDemo();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-emerald-400 border border-emerald-500/30 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Gift className="w-4 h-4" />
              <span>{language === 'es' ? 'Cargar ejemplo de prueba' : 'Load sample demo'}</span>
            </motion.button>
          )}

          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('kid.gotIt')}</span>
            <Check className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
