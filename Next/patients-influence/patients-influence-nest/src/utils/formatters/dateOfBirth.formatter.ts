export const calculateDOB = (minAge?: number, maxAge?: number) => {
  const currentDateMin = new Date();
  const currentDateMax = new Date();

  currentDateMin.setHours(0, 0, 0, 0); // Set time to midnight for minDOB
  currentDateMax.setHours(0, 0, 0, 0); // Set time to midnight for maxDOB

  const maxDOB = minAge
    ? new Date(
        currentDateMin.setFullYear(currentDateMin.getFullYear() - minAge),
      )
    : undefined;
  const minDOB = maxAge
    ? new Date(
        currentDateMax.setFullYear(currentDateMax.getFullYear() - maxAge),
      )
    : undefined;

  return { minDOB, maxDOB };
};

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
