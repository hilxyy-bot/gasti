import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, ChevronDown, ChevronUp, BellRing, Sparkles } from 'lucide-react';
import { CategoryAlert, Currency } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from '../utils/iconMap';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCategoryName } from '../utils/categoryLocalization';

interface AlertsBannerProps {
  alerts: CategoryAlert[];
  currency: Currency;
  onOpenBudgetManager: () => void;
  onOpenAddExpense: (categoryId?: string) => void;
}

export const AlertsBanner: React.FC<AlertsBannerProps> = ({
  alerts,
  currency,
  onOpenBudgetManager,
  onOpenAddExpense,
}) => {
  const { t, language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter alerts that need attention (warning, limit, exceeded)
  const criticalAlerts = alerts.filter((a) => a.level === 'exceeded');
  const limitAlerts = alerts.filter((a) => a.level === 'limit');
  const warningAlerts = alerts.filter((a) => a.level === 'warning');
  const safeCount = alerts.filter((a) => a.level === 'safe').length;

  const totalUrgent = criticalAlerts.length + limitAlerts.length + warningAlerts.length;

  if (alerts.length === 0) {
    return null;
  }

  if (totalUrgent === 0) {
    return (
      <div className="bg-zinc-900/90 border border-emerald-800/80 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-md text-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">
              {t('alerts.allHealthy', { count: alerts.length })}
            </p>
            <p className="text-xs text-zinc-400">
              {t('alerts.monitorActive')}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-full">
            {t('alerts.healthyBadge')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      id="automated-alerts-banner"
      className={`border rounded-2xl transition-all duration-200 shadow-md ${
        criticalAlerts.length > 0
          ? 'bg-zinc-950 border-rose-900/80 text-rose-200'
          : limitAlerts.length > 0
          ? 'bg-zinc-950 border-amber-900/80 text-amber-200'
          : 'bg-zinc-950 border-amber-900/60 text-amber-200'
      }`}
    >
      {/* Header bar */}
      <div className="p-3.5 sm:p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              criticalAlerts.length > 0
                ? 'bg-rose-600 text-white animate-bounce'
                : limitAlerts.length > 0
                ? 'bg-amber-600 text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-extrabold text-white">
                {t('alerts.attentionTitle', {
                  count: totalUrgent,
                  plural: totalUrgent > 1 ? 'ies' : 'y',
                })}
              </span>
              {criticalAlerts.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-rose-600 text-white rounded-full">
                  {t('alerts.exceededBadge', { count: criticalAlerts.length })}
                </span>
              )}
              {limitAlerts.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-amber-600 text-white rounded-full">
                  {t('alerts.limitBadge', { count: limitAlerts.length })}
                </span>
              )}
              {warningAlerts.length > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-amber-700 text-white rounded-full">
                  {t('alerts.warningBadge', { count: warningAlerts.length })}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {t('alerts.liveTracking')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBudgetManager}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 shadow-sm transition-all cursor-pointer"
          >
            {t('alerts.adjustAllocations')}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse alerts' : 'Expand alerts'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded list of alerts */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 space-y-2 border-t border-zinc-800/80">
          {[...criticalAlerts, ...limitAlerts, ...warningAlerts].map((alert) => {
            const isExceeded = alert.level === 'exceeded';
            const isLimit = alert.level === 'limit';

            return (
              <div
                key={alert.categoryId}
                className="bg-zinc-900/90 rounded-xl p-2.5 sm:p-3 border border-zinc-800 flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white shadow-xs"
                    style={{ backgroundColor: alert.color }}
                  >
                    <CategoryIcon name={alert.icon} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {getLocalizedCategoryName({ id: alert.categoryId, name: alert.categoryName }, language)}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                          isExceeded
                            ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                            : isLimit
                            ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                            : 'bg-amber-950/80 text-amber-400 border-amber-800'
                        }`}
                      >
                        {alert.percentageSpent.toFixed(0)}% {t('alerts.used')}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate">
                      {t('alerts.spentOf', {
                        spent: formatCurrency(alert.spent, currency),
                        budget: formatCurrency(alert.budget, currency),
                      })}
                      {isExceeded && (
                        <span className="font-bold text-rose-400">
                          {' '}
                          {t('alerts.overByMsg', {
                            amt: formatCurrency(alert.overAmount, currency),
                          })}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenAddExpense(alert.categoryId)}
                    className="text-xs font-bold text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 cursor-pointer"
                  >
                    {t('alerts.addExpenseBtn')}
                  </button>
                  <button
                    onClick={onOpenBudgetManager}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 cursor-pointer"
                  >
                    {t('alerts.raisePercentBtn')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

