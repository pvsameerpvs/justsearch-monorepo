export const formatPoints = (points: number) =>
  new Intl.NumberFormat('en-US').format(points);

export const formatCurrency = (value: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value);

