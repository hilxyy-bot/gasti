import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  Zap,
  Coins,
  ShieldCheck,
  ChevronRight,
  Wallet,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { FinanceMode, Currency } from '../types';
import { AppLogo } from './AppLogo';
import { formatCurrency } from '../utils/formatters';

interface AuthScreenProps {
  currency: Currency;
  onInitialCapitalSet?: (amount: number) => void;
  suggestedEmail?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currency,
  onInitialCapitalSet,
  suggestedEmail = 'hilxyy@gmail.com',
}) => {
  const { register, login, quickGuestLogin, users } = useAuth();

  const [tab, setTab] = useState<'register' | 'login'>(users.length > 0 ? 'login' : 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(suggestedEmail);
  const [pin, setPin] = useState('');
  const [mode, setMode] = useState<FinanceMode>('personal');
  const [initialCapital, setInitialCapital] = useState<number>(2500);

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState(users[0]?.email || '');
  const [loginPin, setLoginPin] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Por favor ingresa tu nombre o apodo para continuar.');
      return;
    }

    setIsSubmitting(true);
    const result = register({
      name,
      email: email.trim() || suggestedEmail,
      pin: pin.trim() || undefined,
      mode,
    });

    if (result.success) {
      if (onInitialCapitalSet && initialCapital > 0) {
        onInitialCapitalSet(initialCapital);
      }
    } else {
      setErrorMessage(result.message || 'Error al crear la cuenta.');
      setIsSubmitting(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginIdentifier.trim()) {
      setErrorMessage('Ingresa tu correo o nombre.');
      return;
    }

    setIsSubmitting(true);
    const result = login(loginIdentifier, loginPin);
    if (!result.success) {
      setErrorMessage(result.message || 'Error al iniciar sesión.');
      setIsSubmitting(false);
    }
  };

  const handleQuickProfileClick = (userEmail: string) => {
    setErrorMessage(null);
    login(userEmail);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-hidden">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-md"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-inner mb-3">
            <AppLogo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Bienvenido a <span className="text-emerald-400">gasti</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Reparte tu capital en porcentajes inteligentes y controla tus gastos con total claridad.
          </p>
        </div>

        {/* Tab Switcher (Registro vs Iniciar Sesión) */}
        <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Registro Fácil
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Iniciar Sesión {users.length > 0 && `(${users.length})`}
          </button>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-rose-950/70 border border-rose-800 text-rose-300 text-xs font-semibold px-3 py-2 rounded-xl mb-4"
            >
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* REGISTER FORM */}
        {tab === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Tu Nombre o Apodo <span className="text-emerald-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Hilxy"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                {suggestedEmail && email !== suggestedEmail && (
                  <button
                    type="button"
                    onClick={() => setEmail(suggestedEmail)}
                    className="text-[10px] text-emerald-400 hover:underline font-semibold cursor-pointer"
                  >
                    Usar {suggestedEmail}
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Simple PIN or Password (Optional for quick entry) */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                PIN o Contraseña rápida <span className="text-[10px] text-zinc-500 font-normal">(Opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Ej. 1234 (o déjalo vacío para entrar directo)"
                  maxLength={12}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Choice: Mode (Personal vs Negocio) */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                ¿Cómo quieres comenzar?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('personal')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer text-left ${
                    mode === 'personal'
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <User className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold block">Personal</span>
                    <span className="text-[10px] text-zinc-400">Gastos diarios</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('business')}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer text-left ${
                    mode === 'business'
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm ring-1 ring-indigo-500/50'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold block">Negocio</span>
                    <span className="text-[10px] text-zinc-400">Proveedores & Caja</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Capital Preset */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Capital o Fondo a Repartir
                </label>
                <span className="text-xs font-extrabold text-emerald-400">
                  {formatCurrency(initialCapital, currency)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1000, 2500, 5000, 10000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setInitialCapital(amt)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                      initialCapital === amt
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-zinc-950 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                    }`}
                  >
                    {currency.symbol}{amt.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Crear Cuenta y Comenzar</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>
        ) : (
          /* LOGIN FORM */
          <div className="space-y-4">
            {/* Quick Profile Selection if existing users */}
            {users.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Cuentas Registradas en este dispositivo:
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickProfileClick(u.email)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-800 transition-colors text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-inner shrink-0"
                          style={{ backgroundColor: u.avatarColor || '#10b981' }}
                        >
                          {u.avatarEmoji || u.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-white block truncate group-hover:text-emerald-400">
                            {u.name}
                          </span>
                          <span className="text-[10px] text-zinc-400 block truncate">
                            {u.email}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Manual Email/PIN Login */}
            <form onSubmit={handleLogin} className="space-y-3 pt-2 border-t border-zinc-800/80">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  Correo o Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="tu@correo.com o nombre"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                  PIN <span className="text-[10px] text-zinc-500 font-normal">(si configuraste uno)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder="PIN"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                Ingresar a mi Cuenta
              </motion.button>
            </form>
          </div>
        )}

        {/* Quick Instant Test Button (No Registration Friction) */}
        <div className="mt-5 pt-4 border-t border-zinc-800/80 flex flex-col items-center gap-2 text-center">
          <button
            type="button"
            onClick={() => {
              quickGuestLogin('Hilxy Demo', mode);
              if (onInitialCapitalSet) onInitialCapitalSet(initialCapital);
            }}
            className="w-full py-2 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>⚡ Probar al instante (1 Clic sin esperar)</span>
          </button>
          <span className="text-[11px] text-zinc-500">
            Tus datos se guardan de forma privada en tu navegador.
          </span>
        </div>
      </motion.div>
    </div>
  );
};
