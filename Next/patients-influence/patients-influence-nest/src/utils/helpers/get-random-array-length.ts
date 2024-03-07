export const getRandomArrayLength = (x: number) => {
  const len = Math.floor(Math.random() * x);
  const elements = [];
  for (let i = 0; i <= len; i++) {
    elements.push(i);
  }
  return elements;
};
