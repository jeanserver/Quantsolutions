export function formatCurrency(value, currency = 'USD') {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue);
}
