export const gradient = (deg: number, colors: String[]) =>
  `linear-gradient(${deg}deg, ${colors.join(', ')})`;
