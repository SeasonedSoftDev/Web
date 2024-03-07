export const getMarketsAsCommaSeparatedString = (markets: any[]): string =>
  markets.map((market) => market.name).join(', ');

export const getDiseasesAsCommaSeparatedString = (diseases: any[]): string =>
  diseases.map((disease) => disease.name).join(', ');
