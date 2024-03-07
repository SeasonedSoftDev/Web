export const isToday = (d: Date) => {
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
};

export const hasEndDatePassed = (endDate: string | Date): boolean => {
  if (typeof endDate === 'string') {
    endDate = new Date(endDate);
  }

  const today = new Date();
  return endDate < today;
};

export const getCalendarDates = (d: Date) => {
  const y = d.getFullYear();
  const m = d.getMonth();
  const firstDay = new Date(y, m, 1).getDay();

  const from = -firstDay;
  const to = -firstDay + 42;

  // 42 elements array
  const datesArray = [];

  for (let i = from + 1; i <= to; i += 1) {
    const date = new Date(y, m, i);
    const currentMonth = date.getMonth() === m;
    const today = isToday(date);
    datesArray.push({
      currentMonth,
      date,
      today,
    });
  }
  return datesArray;
};
