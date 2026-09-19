/**
 * Format a number into Indian Lakhs / Crores string representation
 * e.g., 7500000 -> "₹75.0L", 12500000 -> "₹1.25 Cr"
 */
export const formatIndianCurrency = (amount: number, options?: { showPlus?: boolean; short?: boolean }): string => {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  let formatted = '';

  if (absAmount >= 10000000) {
    const cr = (absAmount / 10000000).toFixed(2).replace(/\.00$/, '');
    formatted = `₹${cr} Cr`;
  } else if (absAmount >= 100000) {
    const lk = (absAmount / 100000).toFixed(1).replace(/\.0$/, '');
    formatted = `₹${lk}L`;
  } else if (absAmount >= 1000) {
    const th = (absAmount / 1000).toFixed(0);
    formatted = `₹${th}k`;
  } else {
    formatted = `₹${absAmount.toLocaleString('en-IN')}`;
  }

  if (isNegative) {
    return `−${formatted}`;
  }
  if (options?.showPlus && amount > 0) {
    return `+${formatted}`;
  }
  return formatted;
};

/**
 * Format currency range: e.g., 7200000 and 7800000 -> "₹72L – ₹78L"
 */
export const formatCurrencyRange = (min: number, max: number): string => {
  const minStr = formatIndianCurrency(min);
  const maxStr = formatIndianCurrency(max);
  return `${minStr} – ${maxStr}`;
};

/**
 * Format standard number with Indian comma separators
 */
export const formatIndianNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

/**
 * Convert area units to Sq.Ft
 */
export const convertToSqFt = (area: number, unit: 'sqft' | 'gaj' | 'guntha' | 'bigha'): number => {
  switch (unit) {
    case 'gaj':
      return Math.round(area * 9);
    case 'guntha':
      return Math.round(area * 1089);
    case 'bigha':
      return Math.round(area * 14400);
    case 'sqft':
    default:
      return Math.round(area);
  }
};
