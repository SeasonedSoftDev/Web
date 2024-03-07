export const calculateAge = (birthDate: Date) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  let age = currentYear - birthYear;

  // Check if the current date is before the birth date this year
  if (
    currentMonth < birthMonth ||
    (currentMonth === birthMonth && currentDate < birthDay)
  ) {
    // eslint-disable-next-line no-plusplus
    age--;
  }

  return age;
};

export const formatCurrencyIdToObject = (id: number) => {
  switch (id) {
    case 0:
      return { id, name: 'Euro', short: 'EUR', symbol: '€' };
    case 1:
      return { id, name: 'United States Dollar', short: 'USD', symbol: '$' };
    case 2:
      return { id, name: 'Swiss Franc', short: 'CHF', symbol: '₣' };
    default:
      return null;
  }
};
