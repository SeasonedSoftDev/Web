/**
 * @example
 * const ids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  ids.forEach(id => {
    const pseudostring = idToPseudostring(id);
    console.log(`ID: ${id}, Pseudostring: ${pseudostring}`);
  });
 * @param userId An ID of the user
 * @returns 3-letter string
 */
export function idToPseudostring(userId: number): string {
  const characters =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const maxCombinations = 62 ** 3;

  let id = userId % maxCombinations;

  const digit1 = id % 62;
  id = Math.floor(id / 62);

  const digit2 = id % 62;
  id = Math.floor(id / 62);

  const digit3 = id % 62;

  return (
    characters.charAt(digit3) +
    characters.charAt(digit2) +
    characters.charAt(digit1)
  );
}
