export const calculateAge = (birthDate: string) => {
  const now = new Date();
  const birthDateFormatted = new Date(birthDate);
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();

  const birthYear = birthDateFormatted.getFullYear();
  const birthMonth = birthDateFormatted.getMonth();
  const birthDay = birthDateFormatted.getDate();

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

export const getDiseasesAsCommaSeparatedString = (diseases: any[]): string =>
  diseases.map((disease) => disease.diseaseArea.name).join(', ');

export const getMarketsAsCommaSeparatedString = (markets: any[]): string =>
  markets.map((market) => market.location.name).join(', ');
