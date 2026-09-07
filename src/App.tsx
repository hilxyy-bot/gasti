import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import {
  Category,
  Expense,
  Currency,
  AlertSettings,
  BudgetPreset,
  CategoryAlert,
  FinanceMode,
  CapitalSourceType,
  CapitalAddition,
} from './types';
import {
  INITIAL_CATEGORIES,
  INITIAL_INCOME,
  INITIAL_ALERT_SETTINGS,
  SUPPORTED_CURRENCIES,
  DEFAULT_BUSINESS_CATEGORIES,
  getSampleExpenses,
} from './data/initialData';
import {
  getCurrentYearMonth,
  calculateCategoryBudget,
  calculateCategoryAlerts,
  generateCSV,
  formatCurrency,
} from './utils/formatters';
import { Navbar, ViewMode } from './components/Navbar';
import { MonthlyStatusBar } from './components/MonthlyStatusBar';
import { AlertsBanner } from './components/AlertsBanner';
import { OverviewCards } from './components/OverviewCards';
import { QuickAddBar } from './components/QuickAddBar';
import { EasyExpenseLogger } from './components/EasyExpenseLogger';
import { BudgetPercentageManager } from './components/BudgetPercentageManager';
import { VisualCharts } from './components/VisualCharts';
import { CategoryProgressList } from './components/CategoryProgressList';
import { ExpenseTracker } from './components/ExpenseTracker';
import { AddExpenseModal } from './components/AddExpenseModal';
import { AddCapitalModal } from './components/AddCapitalModal';
import { CategoryModal } from './components/CategoryModal';
import { AlertSettingsModal } from './components/AlertSettingsModal';
import { KidFriendlyGuide } from './components/KidFriendlyGuide';
import { DownloadCenter } from './components/DownloadCenter';
import { AuthScreen } from './components/AuthScreen';
import { MobileHud } from './components/MobileHud';
import { Plus, Sparkles, HelpCircle } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { t, language } = useLanguage();
  const { currentUser, isAuthenticated } = useAuth();

  // Current active period (YYYY-MM)
  const [currentYearMonth, setCurrentYearMonth] = useState<string>(getCurrentYearMonth);

  // Active View Mode ('status' | 'quick-spend' | 'budget-percentages' | 'visuals' | 'downloads' | 'all')
  const [viewMode, setViewMode] = useState<ViewMode>('status');

  // Finance Mode ('personal' | 'business')
  const [financeMode, setFinanceMode] = useState<FinanceMode>(() => {
    const saved = localStorage.getItem('gasti_finance_mode');
    return saved === 'business' || saved === 'personal' ? (saved as FinanceMode) : 'personal';
  });

  // Core State: Base Capital & Dynamic Capital Additions (Sales / Inflows)
  const [baseCapital, setBaseCapital] = useState<number>(() => {
    const savedBase = localStorage.getItem('gasti_base_capital');
    if (savedBase) return parseFloat(savedBase);
    const savedIncome = localStorage.getItem('gasti_income');
    return savedIncome ? parseFloat(savedIncome) : INITIAL_INCOME;
  });

  const [capitalAdditions, setCapitalAdditions] = useState<CapitalAddition[]>(() => {
    const saved = localStorage.getItem('gasti_capital_additions');
    return saved ? JSON.parse(saved) : [];
  });

  const [capitalType, setCapitalType] = useState<CapitalSourceType>(() => {
    const saved = localStorage.getItem('gasti_capital_type');
    return (saved as CapitalSourceType) || 'capital';
  });

  const [capitalCustomLabel, setCapitalCustomLabel] = useState<string>(() => {
    return localStorage.getItem('gasti_capital_custom_label') || '';
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('gasti_currency');
    return saved ? JSON.parse(saved) : SUPPORTED_CURRENCIES[0];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('gasti_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('gasti_expenses');
    return saved ? JSON.parse(saved) : getSampleExpenses(getCurrentYearMonth());
  });

  const [alertSettings, setAlertSettings] = useState<AlertSettings>(() => {
    const saved = localStorage.getItem('gasti_alert_settings');
    return saved ? JSON.parse(saved) : INITIAL_ALERT_SETTINGS;
  });

  // Modal States
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddCapitalOpen, setIsAddCapitalOpen] = useState(false);
  const [addCapitalInitialTab, setAddCapitalInitialTab] = useState<'add' | 'reduce' | 'base' | 'history'>('add');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedCategoryForExpense, setSelectedCategoryForExpense] = useState<string | undefined>(
    undefined
  );

  const handleOpenAddCapital = (tab: 'add' | 'reduce' | 'base' | 'history' = 'add') => {
    setAddCapitalInitialTab(tab);
    setIsAddCapitalOpen(true);
  };

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [isAlertSettingsOpen, setIsAlertSettingsOpen] = useState(false);
  const [isKidGuideOpen, setIsKidGuideOpen] = useState(false);

  // Filter selection
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Current Month Additions (Sales / Extra Inflows) filtered by current month and active finance mode
  const currentMonthAdditions = useMemo(() => {
    return capitalAdditions.filter(
      (a) =>
        a.date.startsWith(currentYearMonth) &&
        (a.mode ? a.mode === financeMode : financeMode === 'personal')
    );
  }, [capitalAdditions, currentYearMonth, financeMode]);

  const additionsTotal = useMemo(() => {
    return currentMonthAdditions.reduce((sum, a) => sum + a.amount, 0);
  }, [currentMonthAdditions]);

  // Dynamically Calculated Total Available Capital (Base + Sum of Additions/Sales)
  const totalCapital = useMemo(() => {
    return baseCapital + additionsTotal;
  }, [baseCapital, additionsTotal]);

  // Income alias so all existing percentage distribution and remaining balance logic works seamlessly
  const income = totalCapital;
  const setIncome = (val: number) => {
    setBaseCapital(val);
  };

  // Safe LocalStorage Helper
  const safeSetLocalStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`Could not save ${key} to localStorage:`, e);
    }
  };

  // Save to LocalStorage
  useEffect(() => {
    safeSetLocalStorage('gasti_finance_mode', financeMode);
  }, [financeMode]);

  useEffect(() => {
    safeSetLocalStorage('gasti_base_capital', baseCapital.toString());
    safeSetLocalStorage('gasti_income', totalCapital.toString());
  }, [baseCapital, totalCapital]);

  useEffect(() => {
    safeSetLocalStorage('gasti_capital_additions', JSON.stringify(capitalAdditions));
  }, [capitalAdditions]);

  useEffect(() => {
    safeSetLocalStorage('gasti_capital_type', capitalType);
  }, [capitalType]);

  useEffect(() => {
    safeSetLocalStorage('gasti_capital_custom_label', capitalCustomLabel);
  }, [capitalCustomLabel]);

  const handleUpdateCapitalSource = (type: CapitalSourceType, customLabel?: string) => {
    setCapitalType(type);
    if (customLabel !== undefined) {
      setCapitalCustomLabel(customLabel);
    }
  };

  useEffect(() => {
    safeSetLocalStorage('gasti_currency', JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    safeSetLocalStorage('gasti_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    safeSetLocalStorage('gasti_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    safeSetLocalStorage('gasti_alert_settings', JSON.stringify(alertSettings));
  }, [alertSettings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Active Categories filtered by current mode (Personal vs Business)
  const activeCategories = useMemo(() => {
    const filtered = categories.filter((c) =>
      c.mode ? c.mode === financeMode : financeMode === 'personal'
    );
    if (filtered.length === 0) {
      return financeMode === 'business' ? DEFAULT_BUSINESS_CATEGORIES : INITIAL_CATEGORIES;
    }
    return filtered;
  }, [categories, financeMode]);

  const activeCategoryIds = useMemo(() => {
    return new Set(activeCategories.map((c) => c.id));
  }, [activeCategories]);

  // Filter expenses for current month and active mode
  const currentMonthExpenses = useMemo(() => {
    return expenses.filter(
      (e) => e.date.startsWith(currentYearMonth) && activeCategoryIds.has(e.categoryId)
    );
  }, [expenses, currentYearMonth, activeCategoryIds]);

  // Aggregate Calculations
  const totalAllocatedPercentage = useMemo(() => {
    return activeCategories.reduce((sum, c) => sum + (c.percentage || 0), 0);
  }, [activeCategories]);

  const totalAllocatedAmount = useMemo(() => {
    return (income * totalAllocatedPercentage) / 100;
  }, [income, totalAllocatedPercentage]);

  const totalSpent = useMemo(() => {
    return currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthExpenses]);

  // Automated Budget Alerts
  const alerts: CategoryAlert[] = useMemo(() => {
    return calculateCategoryAlerts(activeCategories, currentMonthExpenses, income, alertSettings);
  }, [activeCategories, currentMonthExpenses, income, alertSettings]);

  const urgentAlertCount = useMemo(() => {
    return alerts.filter((a) => a.level === 'exceeded' || a.level === 'limit' || a.level === 'warning')
      .length;
  }, [alerts]);

  // Mode switcher handler
  const handleToggleFinanceMode = (newMode: FinanceMode) => {
    setFinanceMode(newMode);
    const hasCats = categories.some((c) => (c.mode ? c.mode === newMode : newMode === 'personal'));
    if (!hasCats) {
      if (newMode === 'business') {
        setCategories((prev) => [...prev, ...DEFAULT_BUSINESS_CATEGORIES]);
        if (income < 5000) {
          setIncome(10000);
        }
        showToast(
          language === 'es'
            ? '🏢 Modo Negocio Activado: Cuentas de Costos (COGS), Nómina, OPEX y Utilidad cargadas.'
            : '🏢 Business Mode Activated: COGS, Payroll, OPEX & Profit accounts loaded.'
        );
      }
    } else {
      showToast(
        language === 'es'
          ? newMode === 'business'
            ? '🏢 Modo Negocio Contable'
            : '👤 Modo Personal'
          : newMode === 'business'
          ? '🏢 Business Accounting Mode'
          : '👤 Personal Mode'
      );
    }
  };

  // Expense Handlers
  const handleSaveExpense = (
    expenseData: Omit<Expense, 'id' | 'createdAt'>,
    expenseId?: string
  ) => {
    try {
      const validAmount = Number(expenseData.amount) || 0;
      const validMerchant = (expenseData.merchant || '').trim() || (language === 'es' ? 'Gasto' : 'Expense');
      const validCategoryId = expenseData.categoryId || activeCategories[0]?.id || '';
      const todayStr = new Date().toISOString().split('T')[0];
      const validDate = expenseData.date || (todayStr.startsWith(currentYearMonth) ? todayStr : `${currentYearMonth}-01`);

      const cleanExpenseData = {
        ...expenseData,
        amount: validAmount,
        merchant: validMerchant,
        categoryId: validCategoryId,
        date: validDate,
      };

      if (expenseId) {
        // Edit
        setExpenses((prev) =>
          prev.map((e) =>
            e.id === expenseId
              ? { ...e, ...cleanExpenseData }
              : e
          )
        );
        showToast(
          t('toast.expenseUpdated', {
            name: validMerchant,
            merchant: validMerchant,
          })
        );
      } else {
        // New
        const newExpense: Expense = {
          ...cleanExpenseData,
          id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          createdAt: Date.now(),
        };
        setExpenses((prev) => [newExpense, ...prev]);
        showToast(
          t('toast.expenseLogged', {
            amt: formatCurrency(validAmount, currency),
            name: validMerchant,
            merchant: validMerchant,
          })
        );
      }
    } catch (err) {
      console.error('Error saving expense:', err);
      showToast(language === 'es' ? 'Gasto registrado correctamente.' : 'Expense logged successfully.');
    }
  };

  const handleDeleteExpense = (id: string) => {
    const toDelete = expenses.find((e) => e.id === id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (toDelete) {
      showToast(t('toast.expenseDeleted', { name: toDelete.merchant }));
    }
  };

  // Category Handlers
  const handleUpdateCategoryPercentage = (categoryId: string, newPercentage: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, percentage: newPercentage } : c))
    );
  };

  const handleUpdateCategoryColor = (categoryId: string, newColor: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, color: newColor } : c))
    );
    showToast(t('toast.categoryColorUpdated'));
  };

  const handleSaveCategory = (
    categoryData: Omit<Category, 'id'>,
    categoryId?: string
  ) => {
    if (categoryId) {
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, ...categoryData } : c))
      );
      showToast(t('toast.categoryUpdated', { name: categoryData.name }));
    } else {
      const newCat: Category = {
        ...categoryData,
        mode: categoryData.mode || financeMode,
        id: `cat-${Date.now()}`,
      };
      setCategories((prev) => [...prev, newCat]);
      showToast(
        t('toast.categoryCreated', {
          name: categoryData.name,
          pct: categoryData.percentage.toString(),
        })
      );
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (activeCategories.length <= 1) {
      alert(
        language === 'es'
          ? 'Debes conservar al menos una categoría en este modo.'
          : 'You must keep at least one category in this mode.'
      );
      return;
    }
    const cat = categories.find((c) => c.id === categoryId);
    const confirmMsg =
      language === 'es'
        ? `¿Eliminar "${cat?.name}"? Los gastos existentes en esta categoría se mantendrán.`
        : `Delete "${cat?.name}"? Existing expenses in this category will remain.`;
    if (window.confirm(confirmMsg)) {
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      showToast(t('toast.categoryDeleted', { name: cat?.name || '' }));
    }
  };

  const handleAutoNormalize = () => {
    const currentSum = activeCategories.reduce((s, c) => s + (c.percentage || 0), 0);
    if (currentSum === 0) {
      const equalSplit = Math.floor(100 / (activeCategories.length || 1));
      setCategories((prev) =>
        prev.map((c) => {
          const cMode = c.mode || 'personal';
          if (cMode === financeMode) {
            return { ...c, percentage: equalSplit };
          }
          return c;
        })
      );
      showToast(t('toast.balancedEqually'));
      return;
    }

    let allocated = 0;
    const normalizedMap = new Map<string, number>();

    activeCategories.forEach((c, index) => {
      if (index === activeCategories.length - 1) {
        const lastPercentage = Math.max(0, 100 - allocated);
        normalizedMap.set(c.id, lastPercentage);
      } else {
        const proportional = Math.round((c.percentage / currentSum) * 100);
        allocated += proportional;
        normalizedMap.set(c.id, proportional);
      }
    });

    setCategories((prev) =>
      prev.map((c) => {
        if (normalizedMap.has(c.id)) {
          return { ...c, percentage: normalizedMap.get(c.id)! };
        }
        return c;
      })
    );
    confetti({ particleCount: 35, spread: 70, origin: { y: 0.6 } });
    showToast(t('toast.normalizedSuccess'));
  };

  const handleApplyPreset = (preset: BudgetPreset) => {
    const targetMode = preset.mode || financeMode;
    if (targetMode !== financeMode) {
      setFinanceMode(targetMode);
    }

    const hasModeCats = categories.some((c) =>
      c.mode ? c.mode === targetMode : targetMode === 'personal'
    );
    if (!hasModeCats && targetMode === 'business') {
      setCategories((prev) => [...prev, ...DEFAULT_BUSINESS_CATEGORIES]);
    }

    setCategories((prev) => {
      return prev.map((c) => {
        const cMode = c.mode || 'personal';
        if (cMode === targetMode) {
          const match = preset.allocations[c.name];
          if (match !== undefined) {
            return { ...c, percentage: match };
          }
        }
        return c;
      });
    });

    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    showToast(t('toast.presetApplied', { name: preset.name }));
  };

  const handleLoadKidDemo = () => {
    const isSpanish = language === 'es';
    setIncome(100);
    const kidCategories: Category[] = [
      {
        id: 'cat-games',
        name: isSpanish ? '🎮 Videojuegos y Juguetes' : '🎮 Games & Toys',
        percentage: 40,
        color: '#8B5CF6',
        icon: 'Gamepad2',
        description: isSpanish ? 'Mis juegos favoritos y juguetes' : 'My favorite games and toys',
        mode: 'personal',
      },
      {
        id: 'cat-snacks',
        name: isSpanish ? '🍦 Dulces y Salidas' : '🍦 Snacks & Treats',
        percentage: 30,
        color: '#EC4899',
        icon: 'Coffee',
        description: isSpanish ? 'Helados, golosinas y paseos' : 'Ice cream, treats and fun',
        mode: 'personal',
      },
      {
        id: 'cat-piggy',
        name: isSpanish ? '🐷 Alcancía / Ahorros' : '🐷 Piggy Bank Savings',
        percentage: 30,
        color: '#10B981',
        icon: 'PiggyBank',
        description: isSpanish ? 'Dinero guardado para mi meta' : 'Money saved for my goals',
        mode: 'personal',
      },
    ];
    setCategories((prev) => [
      ...prev.filter((c) => c.mode === 'business'),
      ...kidCategories,
    ]);
    setFinanceMode('personal');
    setExpenses([]);
    confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
    showToast(
      isSpanish
        ? '¡Presupuesto para niños cargado! ($100 y 3 alcancías)'
        : 'Kid-friendly budget loaded! ($100 & 3 piggy banks)'
    );
  };

  // Export / Import
  const handleExportCSV = () => {
    const csv = generateCSV(currentMonthExpenses, activeCategories, income);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gasti-${financeMode}-budget-${currentYearMonth}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(t('toast.exportedCSV'));
  };

  const handleExportJSON = () => {
    const backupData = {
      income,
      currency,
      categories,
      expenses,
      alertSettings,
      financeMode,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gasti-backup-${currentYearMonth}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(t('toast.backupDownloaded'));
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.income !== undefined) setIncome(data.income);
        if (data.currency) setCurrency(data.currency);
        if (data.categories) setCategories(data.categories);
        if (data.expenses) setExpenses(data.expenses);
        if (data.alertSettings) setAlertSettings(data.alertSettings);
        if (data.financeMode) setFinanceMode(data.financeMode);
        showToast(t('toast.backupRestored'));
        setIsAlertSettingsOpen(false);
      } catch (err) {
        alert(language === 'es' ? 'Archivo de respaldo JSON no válido.' : 'Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetToDefaults = () => {
    setIncome(INITIAL_INCOME);
    setCategories(INITIAL_CATEGORIES);
    setExpenses(getSampleExpenses(currentYearMonth));
    setAlertSettings(INITIAL_ALERT_SETTINGS);
    setCurrency(SUPPORTED_CURRENCIES[0]);
    setFinanceMode('personal');
    localStorage.clear();
    showToast(t('toast.resetDefaults'));
  };

  useEffect(() => {
    if (currentUser?.preferredMode && currentUser.preferredMode !== financeMode) {
      setFinanceMode(currentUser.preferredMode);
    }
  }, [currentUser?.id]);

  if (!isAuthenticated) {
    return (
      <AuthScreen
        currency={currency}
        onInitialCapitalSet={(amount) => {
          setIncome(amount);
        }}
        suggestedEmail="hilxyy@gmail.com"
      />
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-black text-white flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300 pb-16 touch-pan-y overscroll-none">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-zinc-900 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 border border-zinc-700"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <Navbar
        currentYearMonth={currentYearMonth}
        onChangeMonth={setCurrentYearMonth}
        currency={currency}
        onChangeCurrency={setCurrency}
        financeMode={financeMode}
        onChangeFinanceMode={handleToggleFinanceMode}
        onOpenAddExpense={() => {
          setSelectedCategoryForExpense(undefined);
          setEditingExpense(null);
          setIsAddExpenseOpen(true);
        }}
        onOpenAddCapital={handleOpenAddCapital}
        onOpenBudgetManager={() => {
          setViewMode('budget-percentages');
          const el = document.getElementById('percentage-manager-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAlertSettings={() => setIsAlertSettingsOpen(true)}
        onOpenKidGuide={() => setIsKidGuideOpen(true)}
        onResetData={handleResetToDefaults}
        onExportData={handleExportCSV}
        alertCount={urgentAlertCount}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
      />

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 w-full max-w-full overflow-x-hidden flex-1 pb-28 md:pb-8">
        {/* ========================================================================= */}
        {/* SECCIÓN 1: ¿CÓMO VAS? (STATUS & MONTH HEALTH) - Default Primary View */}
        {/* ========================================================================= */}
        {(viewMode === 'status' || viewMode === 'all') && (
          <div className="space-y-6">
            {/* Real-time Month Status & Health Progress Bar */}
            <MonthlyStatusBar
              currentYearMonth={currentYearMonth}
              income={income}
              totalSpent={totalSpent}
              categories={activeCategories}
              expenses={currentMonthExpenses}
              currency={currency}
              financeMode={financeMode}
              capitalType={capitalType}
              capitalCustomLabel={capitalCustomLabel}
              onOpenAddExpense={() => {
                setSelectedCategoryForExpense(undefined);
                setEditingExpense(null);
                setIsAddExpenseOpen(true);
              }}
              onOpenBudgetManager={() => setViewMode('budget-percentages')}
            />

            {/* Real-time Automated Alerts Banner */}
            {alertSettings.enableBanner && (
              <AlertsBanner
                alerts={alerts}
                currency={currency}
                onOpenBudgetManager={() => setViewMode('budget-percentages')}
                onOpenAddExpense={(catId) => {
                  setSelectedCategoryForExpense(catId);
                  setEditingExpense(null);
                  setIsAddExpenseOpen(true);
                }}
              />
            )}

            {/* 4 Financial Metric Tiles */}
            <OverviewCards
              income={income}
              baseCapital={baseCapital}
              additionsTotal={additionsTotal}
              additionsCount={currentMonthAdditions.length}
              onOpenAddCapital={handleOpenAddCapital}
              onUpdateIncome={(newInc) => {
                setIncome(newInc);
                showToast(t('toast.incomeUpdated', { amt: formatCurrency(newInc, currency) }));
              }}
              capitalType={capitalType}
              capitalCustomLabel={capitalCustomLabel}
              onUpdateCapitalSource={handleUpdateCapitalSource}
              totalAllocatedPercentage={totalAllocatedPercentage}
              totalAllocatedAmount={totalAllocatedAmount}
              totalSpent={totalSpent}
              currency={currency}
              currentYearMonth={currentYearMonth}
              financeMode={financeMode}
              onOpenBudgetManager={() => setViewMode('budget-percentages')}
            />

            {/* Quick 1-Tap Sales/Inflow Additions & Quick Spend Bar */}
            <QuickAddBar
              categories={activeCategories}
              currency={currency}
              financeMode={financeMode}
              onQuickAdd={(amount, catId, merchant) => {
                const today = new Date().toISOString().split('T')[0];
                handleSaveExpense({
                  categoryId: catId,
                  amount,
                  merchant,
                  date: today.startsWith(currentYearMonth) ? today : `${currentYearMonth}-01`,
                  paymentMethod: financeMode === 'business' ? 'Bank Transfer' : 'Debit Card',
                });
              }}
              onOpenAddExpense={() => {
                setSelectedCategoryForExpense(undefined);
                setEditingExpense(null);
                setIsAddExpenseOpen(true);
              }}
              onOpenAddCapital={handleOpenAddCapital}
              onQuickAddCapital={handleQuickAddAddition}
            />

            {/* Category Budget Progress Cards */}
            <CategoryProgressList
              categories={activeCategories}
              expenses={currentMonthExpenses}
              income={income}
              currency={currency}
              alerts={alerts}
              financeMode={financeMode}
              onOpenAddExpense={(catId) => {
                setSelectedCategoryForExpense(catId);
                setEditingExpense(null);
                setIsAddExpenseOpen(true);
              }}
              onFilterByCategory={(catId) => {
                setSelectedCategoryFilter(catId);
                setViewMode('quick-spend');
              }}
              selectedCategoryFilter={selectedCategoryFilter}
              onUpdateCategoryPercentage={handleUpdateCategoryPercentage}
              onUpdateCategoryColor={handleUpdateCategoryColor}
            />

            {/* Quick Link Footer to Other Sections when in status-only mode */}
            {viewMode === 'status' && (
              <div className="bg-zinc-950/80 border border-zinc-850 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">
                      {language === 'es' ? '¿Quieres ver más opciones?' : 'Looking for more features?'}
                    </h4>
                    <p className="text-xs text-zinc-400">
                      {language === 'es'
                        ? 'Registra gastos, ajusta tus porcentajes en %, ve gráficos o descarga tus datos.'
                        : 'Log expenses, adjust % splits, view charts or download your spreadsheets.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setViewMode('quick-spend')}
                    className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-emerald-400 border border-zinc-700 cursor-pointer"
                  >
                    ⚡ {language === 'es' ? 'Registrar Gastos' : 'Log Spend'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setViewMode('downloads')}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md cursor-pointer"
                  >
                    📥 {language === 'es' ? 'Descargas & App' : 'Downloads & App'}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECCIÓN 2: REGISTRAR GASTOS (QUICK SPEND & EXPENSE TRACKER) */}
        {/* ========================================================================= */}
        {viewMode === 'quick-spend' && (
          <div className="space-y-6">
            <EasyExpenseLogger
              categories={activeCategories}
              currency={currency}
              income={income}
              expenses={currentMonthExpenses}
              onLogExpense={(exp) => handleSaveExpense(exp)}
              onOpenDetailedModal={() => {
                setSelectedCategoryForExpense(undefined);
                setEditingExpense(null);
                setIsAddExpenseOpen(true);
              }}
            />

            <ExpenseTracker
              expenses={currentMonthExpenses}
              categories={activeCategories}
              currency={currency}
              onOpenAddExpense={(catId) => {
                setSelectedCategoryForExpense(catId);
                setEditingExpense(null);
                setIsAddExpenseOpen(true);
              }}
              onEditExpense={(expense) => {
                setEditingExpense(expense);
                setIsAddExpenseOpen(true);
              }}
              onDeleteExpense={handleDeleteExpense}
              selectedCategoryFilter={selectedCategoryFilter}
              onSelectCategoryFilter={(catId) => setSelectedCategoryFilter(catId || null)}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECCIÓN 3: BOLSITAS EN % (BUDGET PERCENTAGE MANAGER) */}
        {/* ========================================================================= */}
        {viewMode === 'budget-percentages' && (
          <div id="percentage-manager-section" className="space-y-6">
            <BudgetPercentageManager
              categories={activeCategories}
              income={income}
              currency={currency}
              financeMode={financeMode}
              baseCapital={baseCapital}
              additionsTotal={additionsTotal}
              onOpenAddCapital={handleOpenAddCapital}
              onQuickAddAddition={handleQuickAddAddition}
              capitalType={capitalType}
              capitalCustomLabel={capitalCustomLabel}
              onUpdateCapitalSource={handleUpdateCapitalSource}
              onUpdateIncome={(newInc) => {
                setIncome(newInc);
                showToast(t('toast.incomeUpdated', { amt: formatCurrency(newInc, currency) }));
              }}
              onUpdateCategoryPercentage={handleUpdateCategoryPercentage}
              onUpdateCategoryColor={handleUpdateCategoryColor}
              onApplyPreset={handleApplyPreset}
              onOpenAddCategory={() => {
                setEditingCategory(null);
                setIsCategoryModalOpen(true);
              }}
              onOpenEditCategory={(cat) => {
                setEditingCategory(cat);
                setIsCategoryModalOpen(true);
              }}
              onDeleteCategory={handleDeleteCategory}
              onAutoNormalize={handleAutoNormalize}
            />

            <CategoryProgressList
              categories={activeCategories}
              expenses={currentMonthExpenses}
              income={income}
              currency={currency}
              alerts={alerts}
              financeMode={financeMode}
              onOpenAddExpense={(catId) => {
                setSelectedCategoryForExpense(catId);
                setEditingExpense(null);
                setIsAddExpenseOpen(true);
              }}
              onFilterByCategory={(catId) => {
                setSelectedCategoryFilter(catId);
                setViewMode('quick-spend');
              }}
              selectedCategoryFilter={selectedCategoryFilter}
              onUpdateCategoryPercentage={handleUpdateCategoryPercentage}
              onUpdateCategoryColor={handleUpdateCategoryColor}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECCIÓN 4: REPORTES & DESCARGAS (GRÁFICOS, EXPORTAR CSV, JSON Y RESPALDOS) */}
        {/* ========================================================================= */}
        {viewMode === 'downloads' && (
          <div className="space-y-6">
            <VisualCharts
              categories={activeCategories}
              expenses={currentMonthExpenses}
              income={income}
              currency={currency}
              currentYearMonth={currentYearMonth}
              alerts={alerts}
            />

            <DownloadCenter
              currentYearMonth={currentYearMonth}
              income={income}
              totalSpent={totalSpent}
              categories={activeCategories}
              expenses={expenses}
              currency={currency}
              alertSettings={alertSettings}
              onImportJSON={handleImportJSON}
              onShowToast={showToast}
            />
          </div>
        )}
      </main>

      {/* Floating Action Button for 1-Tap Expense Logging (Desktop & Tablet) */}
      <motion.button
        id="fab-add-expense-btn"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          setSelectedCategoryForExpense(undefined);
          setEditingExpense(null);
          setIsAddExpenseOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-emerald-600/30 hidden md:flex items-center gap-2 transition-all cursor-pointer font-bold text-sm"
        title={t('nav.addExpense')}
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">{t('nav.addExpense')}</span>
      </motion.button>

      {/* Dedicated Mobile HUD for phones */}
      <MobileHud
        onAddExpense={() => {
          setSelectedCategoryForExpense(undefined);
          setEditingExpense(null);
          setIsAddExpenseOpen(true);
        }}
        onAddCapital={handleOpenAddCapital}
        onOpenCategories={() => {
          setViewMode('budget-percentages');
        }}
        remaining={income - totalSpent}
        income={income}
        totalSpent={totalSpent}
        currency={currency}
        financeMode={financeMode}
        viewMode={viewMode}
        onSelectViewMode={setViewMode}
      />

      {/* Modals */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSaveExpense={handleSaveExpense}
        categories={activeCategories}
        initialCategoryId={selectedCategoryForExpense}
        editingExpense={editingExpense}
        currency={currency}
        income={income}
        expenses={currentMonthExpenses}
        currentYearMonth={currentYearMonth}
      />

      {/* Add Capital / Sales Modal (Additive Income Engine) */}
      <AddCapitalModal
        isOpen={isAddCapitalOpen}
        onClose={() => setIsAddCapitalOpen(false)}
        initialTab={addCapitalInitialTab}
        financeMode={financeMode}
        currency={currency}
        baseCapital={baseCapital}
        totalCapital={income}
        additions={currentMonthAdditions}
        capitalType={capitalType}
        capitalCustomLabel={capitalCustomLabel}
        currentYearMonth={currentYearMonth}
        onAddAddition={handleAddCapitalAddition}
        onDeleteAddition={handleDeleteCapitalAddition}
        onUpdateBaseCapital={handleUpdateBaseCapital}
        onUpdateCapitalSource={handleUpdateCapitalSource}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSaveCategory={handleSaveCategory}
        editingCategory={editingCategory}
        existingCategories={activeCategories}
        financeMode={financeMode}
      />

      <AlertSettingsModal
        isOpen={isAlertSettingsOpen}
        onClose={() => setIsAlertSettingsOpen(false)}
        settings={alertSettings}
        onUpdateSettings={(newSettings) => {
          setAlertSettings(newSettings);
          showToast(t('toast.settingsUpdated'));
        }}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onResetToDefaults={handleResetToDefaults}
        currency={currency}
      />

      <KidFriendlyGuide
        isOpen={isKidGuideOpen}
        onClose={() => setIsKidGuideOpen(false)}
        onLoadKidDemo={handleLoadKidDemo}
      />
    </div>
  );
}
