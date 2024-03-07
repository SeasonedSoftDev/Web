export const getChange = (after?: number, before?: number) => {
  if (
    after === null ||
    after === undefined ||
    before === null ||
    before === undefined
  )
    return 'N/A';

  if (before === 0 && after === 0) return 0;

  if (before === after) return 0;

  if (before === 0) {
    return (after * 100).toFixed(2);
  }

  // Calculate growth percentage
  const growth = ((after - before) / Math.abs(before)) * 100;

  return growth.toFixed(2);
};
