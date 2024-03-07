import { Currency } from '../../utils';

export const formatCurrencyIdToObject = (id: number) => {
  switch (id) {
    case Currency.euro:
      return { id, name: 'Euro', short: 'EUR', symbol: '€' };
    case Currency.usd:
      return { id, name: 'United States Dollar', short: 'USD', symbol: '$' };
    case Currency.chf:
      return { id, name: 'Swiss Franc', short: 'CHF', symbol: '₣' };
    default:
      return null;
  }
};
