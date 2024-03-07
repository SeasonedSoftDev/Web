export const calculateDOB = (minAge: number, maxAge: number) => {
  const currentDate = new Date();

  const minDOB =
    minAge !== undefined
      ? new Date(currentDate.setFullYear(currentDate.getFullYear() - minAge))
      : undefined;
  const maxDOB =
    maxAge !== undefined
      ? new Date(currentDate.setFullYear(currentDate.getFullYear() - maxAge))
      : undefined;

  return { minDOB, maxDOB };
};
