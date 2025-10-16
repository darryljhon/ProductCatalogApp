export const formatCurrency = (amount: number, currency = 'PHP') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPeso = (amount: number) => {
  return formatCurrency(amount, 'PHP');
};
