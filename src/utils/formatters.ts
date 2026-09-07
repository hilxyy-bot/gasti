import { Category, Expense, Currency, CategoryAlert, AlertSettings, CapitalSourceType, LanguageCode } from '../types';
import { getLocalizedCapitalSource } from './categoryLocalization';

export function getCapitalLabel(
  type: CapitalSourceType | string = 'capital',
  customLabel?: string,
  language: string = 'es'
): string {
  return getLocalizedCapitalSource(type, customLabel, (language as LanguageCode) || 'es');
}

export function formatCurrency(amount: number, currency: Currency): string {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return currency.position === 'prefix'
    ? `${currency.symbol}${formattedNumber}`
    : `${formattedNumber} ${currency.symbol}`;
}

export function formatCompactCurrency(amount: number, currency: Currency): string {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);

  return currency.position === 'prefix'
    ? `${currency.symbol}${formattedNumber}`
    : `${formattedNumber} ${currency.symbol}`;
}

export function getCurrentYearMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

export function formatMonthName(yearMonth: string): string {
  const [year, month] = yearMonth.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}

export function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  return date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function calculateCategoryBudget(income: number, percentage: number): number {
  return (income * (percentage || 0)) / 100;
}

export function calculateCategoryAlerts(
  categories: Category[],
  expenses: Expense[],
  income: number,
  settings: AlertSettings
): CategoryAlert[] {
  return categories.map((category) => {
    const categoryExpenses = expenses.filter((e) => e.categoryId === category.id);
    const spent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
    const budget = calculateCategoryBudget(income, category.percentage);
    const percentageSpent = budget > 0 ? (spent / budget) * 100 : spent > 0 ? 999 : 0;
    const percentageOfIncome = income > 0 ? (spent / income) * 100 : 0;
    const overAmount = Math.max(0, spent - budget);

    let level: CategoryAlert['level'] = 'safe';
    let message = '';

    if (percentageSpent > settings.dangerThreshold) {
      level = 'exceeded';
      message = `Exceeded budget by ${overAmount.toFixed(2)} (${percentageSpent.toFixed(0)}% used)!`;
    } else if (percentageSpent >= 100) {
      level = 'limit';
      message = `Reached 100% of maximum budget allocation!`;
    } else if (percentageSpent >= settings.warningThreshold) {
      level = 'warning';
      message = `Approaching limit: ${percentageSpent.toFixed(0)}% consumed (${(budget - spent).toFixed(2)} left)`;
    } else {
      level = 'safe';
      message = `On track: ${(100 - percentageSpent).toFixed(0)}% budget remaining`;
    }

    return {
      categoryId: category.id,
      categoryName: category.name,
      color: category.color,
      icon: category.icon,
      level,
      spent,
      budget,
      percentageSpent,
      percentageOfIncome,
      overAmount,
      message,
    };
  });
}

export function generateCSV(expenses: Expense[], categories: Category[], currency: Currency): string {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
  const headers = ['Date', 'Category', 'Merchant / Title', 'Amount', 'Currency', 'Payment Method', 'Notes', 'Tags'];
  
  const rows = expenses.map((e) => [
    e.date,
    `"${categoryMap.get(e.categoryId) || 'Uncategorized'}"`,
    `"${e.merchant.replace(/"/g, '""')}"`,
    e.amount.toFixed(2),
    currency.code,
    `"${e.paymentMethod || 'Other'}"`,
    `"${(e.note || '').replace(/"/g, '""')}"`,
    `"${(e.tags || []).join(', ')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
