export const seedLogger = (table: string, text: string) => {
  return console.log(
    `\x1b[37m[\x1b[34mPatientsInfluence\x1b[37m] \x1b[34m${table}\x1b[37m - \x1b[34m${text}\x1b[0m`,
  );
};
