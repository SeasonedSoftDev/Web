type TEntry = {
  id: number;
  [key: string]: any;
};

export const generateRandomIdFromEntries = (entries: TEntry[]) => {
  const randomIndex = Math.floor(Math.random() * entries.length);
  return entries[randomIndex].id;
};
