import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Line,
  ComposedChart,
} from 'recharts';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Category, Expense, Currency, CategoryAlert } from '../types';
import { formatCurrency, calculateCategoryBudget } from '../utils/formatters';
import { CategoryIcon } from '../utils/iconMap';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCategoryName } from '../utils/categoryLocalization';

interface VisualChartsProps {
  categories: Category[];
  expenses: Expense[];
  income: number;
  currency: Currency;
  currentYearMonth: string;
  alerts: CategoryAlert[];
}

export const VisualCharts: React.FC<VisualChartsProps> = ({
  categories,
  expenses,
  income,
  currency,
  currentYearMonth,
  alerts,
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'donut' | 'bars' | 'trend'>('donut');
  const [donutView, setDonutView] = useState<'spent' | 'budget'>('spent');

  // Prepare data for Donut Chart
  const donutData = categories
    .map((cat) => {
      const catExpenses = expenses.filter((e) => e.categoryId === cat.id);
      const spent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
      const budget = calculateCategoryBudget(income, cat.percentage);
      const localizedName = getLocalizedCategoryName(cat, language);

      return {
        id: cat.id,
        name: localizedName,
        value: donutView === 'spent' ? spent : budget,
        spent,
        budget,
        percentage: cat.percentage,
        color: cat.color,
        icon: cat.icon,
      };
    })
    .filter((d) => d.value > 0);

  const totalDonutValue = donutData.reduce((sum, d) => sum + d.value, 0);

  // Prepare data for Budget vs Actual Bar Chart
  const barData = categories.map((cat) => {
    const catExpenses = expenses.filter((e) => e.categoryId === cat.id);
    const spent = catExpenses.reduce((sum, e) => sum + e.amount, 0);
    const budget = calculateCategoryBudget(income, cat.percentage);
    const isOver = spent > budget;
    const localizedName = getLocalizedCategoryName(cat, language);

    return {
      name: localizedName.split(' ')[0], // short name
      fullName: localizedName,
      budget: parseFloat(budget.toFixed(2)),
      spent: parseFloat(spent.toFixed(2)),
      overAmount: Math.max(0, spent - budget),
      color: cat.color,
      isOver,
    };
  });

  // Prepare data for Daily Spending Trajectory (days 1 to 28/30/31)
  const [year, month] = currentYearMonth.split('-');
  const daysInMonth = new Date(parseInt(year, 10), parseInt(month, 10), 0).getDate();
  const totalAllocatedBudget = categories.reduce(
    (sum, c) => sum + calculateCategoryBudget(income, c.percentage),
    0
  );
  const dailyTargetSlope = totalAllocatedBudget / daysInMonth;

  // Group expenses by day
  const dailyExpenseMap = new Map<number, number>();
  expenses.forEach((e) => {
    const parts = e.date.split('-');
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10);
      dailyExpenseMap.set(day, (dailyExpenseMap.get(day) || 0) + e.amount);
    }
  });

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === parseInt(year, 10) && today.getMonth() + 1 === parseInt(month, 10);
  const maxDayToPlot = isCurrentMonth ? today.getDate() : daysInMonth;

  let cumulativeSpent = 0;
  const trendData = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const daySpent = dailyExpenseMap.get(day) || 0;
    const targetPace = parseFloat((dailyTargetSlope * day).toFixed(2));

    if (day <= maxDayToPlot) {
      cumulativeSpent += daySpent;
      trendData.push({
        day: `Day ${day}`,
        dayNum: day,
        actualSpent: parseFloat(cumulativeSpent.toFixed(2)),
        budgetPace: targetPace,
        dailySpend: parseFloat(daySpent.toFixed(2)),
      });
    } else {
      trendData.push({
        day: `Day ${day}`,
        dayNum: day,
        budgetPace: targetPace,
      });
    }
  }

  return (
    <div className="bg-zinc-900/90 rounded-2xl p-5 sm:p-6 border border-zinc-800 shadow-md space-y-5 text-zinc-100">
      {/* Tab Switcher & Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 text-emerald-400 flex items-center justify-center border border-emerald-800/60">
              <Activity className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              {t('charts.title')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
            {t('charts.subtitle')}
          </p>
        </div>

        {/* View mode toggle */}
        {categories.length > 0 && (
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-bold">
            <button
              onClick={() => setActiveTab('donut')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'donut'
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>{t('charts.breakdownTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab('bars')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'bars'
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t('charts.budgetVsSpentTab')}</span>
            </button>
            <button
              onClick={() => setActiveTab('trend')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'trend'
                  ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('charts.spendVelocityTab')}</span>
            </button>
          </div>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 px-4 border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <PieIcon className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-zinc-300">{t('charts.noData')}</h3>
        </div>
      ) : (
        <>
          {/* Tab 1: Donut Chart */}
          {activeTab === 'donut' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-bold text-zinc-300">
              {donutView === 'spent' ? t('charts.donutSpentTitle') : t('charts.donutBudgetTitle')}
            </span>
            <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
              <button
                onClick={() => setDonutView('spent')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  donutView === 'spent'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t('charts.actualSpentBtn')}
              </button>
              <button
                onClick={() => setDonutView('budget')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  donutView === 'budget'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {t('charts.plannedBudgetBtn')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Chart */}
            <div className="lg:col-span-7 h-[280px] sm:h-[320px] relative flex items-center justify-center">
              {donutData.length === 0 ? (
                <div className="text-center text-zinc-500 text-sm">
                  {t('charts.noData')}
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={105}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {donutData.map((entry) => (
                        <Cell key={`cell-${entry.id}`} fill={entry.color} stroke="#09090b" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const percentOfTotal = totalDonutValue > 0 ? (data.value / totalDonutValue) * 100 : 0;
                          return (
                            <div className="bg-zinc-950 text-white p-3 rounded-xl shadow-2xl text-xs space-y-1 border border-zinc-800">
                              <div className="flex items-center gap-2 font-bold text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                                <span>{data.name}</span>
                              </div>
                              <p className="text-zinc-300">
                                {donutView === 'spent' ? t('charts.spentLabel') : t('charts.budgetLimitLabel')}{' '}
                                <span className="font-bold text-white">
                                  {formatCurrency(data.value, currency)}
                                </span>
                              </p>
                              <p className="text-zinc-400">
                                {percentOfTotal.toFixed(1)}% of total {donutView}
                              </p>
                              {donutView === 'spent' && (
                                <p className="text-zinc-400">
                                  Budget: {formatCurrency(data.budget, currency)} ({((data.spent / (data.budget || 1)) * 100).toFixed(0)}% used)
                                </p>
                              )}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}

              {/* Center Donut Label */}
              {donutData.length > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    Total {donutView === 'spent' ? 'Spent' : 'Budget'}
                  </span>
                  <span className="text-lg sm:text-xl font-extrabold text-white">
                    {formatCurrency(totalDonutValue, currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Custom Interactive Legend / Slices */}
            <div className="lg:col-span-5 space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {donutData.map((item) => {
                const percentOfTotal = totalDonutValue > 0 ? (item.value / totalDonutValue) * 100 : 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 transition-all text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-bold text-zinc-200 truncate">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-zinc-400 font-semibold">{percentOfTotal.toFixed(0)}%</span>
                      <span className="font-extrabold text-white">
                        {formatCurrency(item.value, currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Budget vs Actual Bar Chart */}
      {activeTab === 'bars' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              {t('charts.barsDescription')}
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-zinc-700" />
                <span className="text-zinc-300 font-bold">{t('charts.plannedBudgetLabel')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-zinc-300 font-bold">{t('charts.actualSpentLabel')}</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] sm:h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: '#3f3f46' }}
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#3f3f46' }}
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  tickFormatter={(val) => `${currency.symbol}${val}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const diff = data.budget - data.spent;
                      return (
                        <div className="bg-zinc-950 text-white p-3 rounded-xl shadow-2xl text-xs space-y-1.5 border border-zinc-800">
                          <p className="font-bold text-sm text-white">{data.fullName}</p>
                          <div className="flex justify-between gap-4">
                            <span className="text-zinc-400">{t('charts.plannedBudgetLabel')}:</span>
                            <span className="font-semibold text-zinc-200">{formatCurrency(data.budget, currency)}</span>
                          </div>
                          <div className="flex justify-between gap-4">
                            <span className="text-zinc-400">{t('charts.actualSpentLabel')}:</span>
                            <span className="font-semibold text-emerald-400">{formatCurrency(data.spent, currency)}</span>
                          </div>
                          <div className="pt-1 border-t border-zinc-800 flex justify-between gap-4">
                            <span className="text-zinc-400">{diff >= 0 ? t('charts.remainingLabel') : t('charts.overBudgetLabel')}</span>
                            <span className={`font-bold ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {diff >= 0 ? formatCurrency(diff, currency) : `+${formatCurrency(Math.abs(diff), currency)}`}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="budget" fill="#3f3f46" radius={[4, 4, 0, 0]} name={t('charts.plannedBudgetLabel')} />
                <Bar
                  dataKey="spent"
                  radius={[4, 4, 0, 0]}
                  name={t('charts.actualSpentLabel')}
                  fill="#10b981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 3: Spend Velocity & Cumulative Trajectory */}
      {activeTab === 'trend' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">
              {t('charts.trendDescription')}
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-zinc-500 border-dashed" />
                <span className="text-zinc-300 font-bold">{t('charts.targetPace')}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-emerald-500" />
                <span className="text-zinc-300 font-bold">{t('charts.actualCumulative')}</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] sm:h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={{ stroke: '#3f3f46' }}
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  interval={3}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: '#3f3f46' }}
                  tick={{ fill: '#a1a1aa', fontSize: 11 }}
                  tickFormatter={(val) => `${currency.symbol}${val}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-zinc-950 text-white p-3 rounded-xl shadow-2xl text-xs space-y-1.5 border border-zinc-800">
                          <p className="font-bold text-sm text-white">{data.day}</p>
                          {data.actualSpent !== undefined && (
                            <div className="flex justify-between gap-4">
                              <span className="text-zinc-400">{t('charts.actualCumulative')}:</span>
                              <span className="font-bold text-emerald-400">
                                {formatCurrency(data.actualSpent, currency)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between gap-4">
                            <span className="text-zinc-400">{t('charts.targetPace')}:</span>
                            <span className="font-semibold text-zinc-300">
                              {formatCurrency(data.budgetPace, currency)}
                            </span>
                          </div>
                          {data.dailySpend !== undefined && (
                            <div className="flex justify-between gap-4 pt-1 border-t border-zinc-800 text-zinc-400">
                              <span>Spent on this day:</span>
                              <span className="text-white font-medium">
                                {formatCurrency(data.dailySpend, currency)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="actualSpent"
                  fill="#064e3b"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  name={t('charts.actualCumulative')}
                />
                <Line
                  type="monotone"
                  dataKey="budgetPace"
                  stroke="#71717a"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={false}
                  name={t('charts.targetPace')}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

