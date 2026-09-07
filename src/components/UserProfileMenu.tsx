import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  LogOut,
  ChevronDown,
  UserPlus,
  Shield,
  Sparkles,
  Check,
  Building2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FinanceMode } from '../types';

interface UserProfileMenuProps {
  financeMode: FinanceMode;
  onChangeFinanceMode: (mode: FinanceMode) => void;
  onOpenRegisterModal?: () => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  financeMode,
  onChangeFinanceMode,
  onOpenRegisterModal,
}) => {
  const { t } = useLanguage();
  const { currentUser, users, logout, switchUser, updateProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(currentUser?.name || '');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsEditingName(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) return null;

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateProfile({ name: tempName.trim() });
      setIsEditingName(false);
    }
  };

  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Trigger Button in Navbar */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-1 px-2 sm:px-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer shadow-sm"
        title={currentUser.name}
      >
        <div
          className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shadow-inner shrink-0"
          style={{ backgroundColor: currentUser.avatarColor || '#10b981' }}
        >
          {currentUser.avatarEmoji || currentUser.name.charAt(0).toUpperCase()}
        </div>
        <div className="text-left hidden sm:block max-w-[100px] truncate">
          <span className="text-xs font-bold block truncate leading-tight">{currentUser.name}</span>
          <span className="text-[10px] text-emerald-400 block leading-none font-medium">{t('profile.active')}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 shadow-2xl z-50 text-zinc-100 backdrop-blur-md"
          >
            {/* User Details Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-800">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-black text-white shadow-md shrink-0"
                style={{ backgroundColor: currentUser.avatarColor || '#10b981' }}
              >
                {currentUser.avatarEmoji || currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                {isEditingName ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                      className="w-full text-xs font-bold text-white bg-zinc-950 border border-emerald-500 rounded px-1.5 py-0.5"
                    />
                    <button
                      onClick={handleSaveName}
                      className="p-1 rounded bg-emerald-600 text-white cursor-pointer"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-white truncate block">
                      {currentUser.name}
                    </span>
                    <button
                      onClick={() => {
                        setTempName(currentUser.name);
                        setIsEditingName(true);
                      }}
                      className="text-[10px] text-zinc-400 hover:text-emerald-400 cursor-pointer underline"
                    >
                      {t('profile.edit')}
                    </button>
                  </div>
                )}
                <span className="text-xs text-zinc-400 truncate block">
                  {currentUser.email}
                </span>
              </div>
            </div>

            {/* Quick Mode Status */}
            <div className="py-2.5 border-b border-zinc-800/80 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-semibold">{t('profile.financeMode')}</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onChangeFinanceMode('personal')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    financeMode === 'personal'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {t('profile.personal')}
                </button>
                <button
                  type="button"
                  onClick={() => onChangeFinanceMode('business')}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                    financeMode === 'business'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {t('profile.business')}
                </button>
              </div>
            </div>

            {/* Switch to Other Registered Account */}
            {otherUsers.length > 0 && (
              <div className="py-2.5 border-b border-zinc-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  {t('profile.switchAccount')}
                </span>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {otherUsers.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        switchUser(u.id);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-800 text-left transition-colors cursor-pointer text-xs text-zinc-300"
                    >
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ backgroundColor: u.avatarColor || '#10b981' }}
                      >
                        {u.avatarEmoji || u.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate font-semibold flex-1">{u.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions: Add New Account & Logout */}
            <div className="pt-2.5 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('profile.logout')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
