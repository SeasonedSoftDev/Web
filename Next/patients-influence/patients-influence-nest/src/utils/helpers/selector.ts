export type TSelectorFields = {
  [key: string]: TSelectorFields | boolean;
};

export type TSelectorFieldsFormatResult = TSelectorFields;

export type TSelectorConstructor = {
  key: string;
  fields: TSelectorFields;
  format: (entry: any) => any;
  filter: { [key: string]: (filter: any) => any };
};

export type TSelectorGetResult = {
  key: string;
  select: TSelectorFields;
  format: (entry: any) => any;
  filter: { [key: string]: (filter: any) => any };
};

// type PrismaBoolean<T> = {
//   [P in keyof T]: T[P] extends object ? PrismaBoolean<T[P]> : boolean;
// };

export class Selector<A, B> {
  key: string;
  select: any = {};
  format: (a: any) => any;
  filter: { [key: string]: (filter: any) => any };

  constructor(
    private readonly selector: {
      key: string;
      select: B;
      format: (entry: A) => any;
      filter: { [key: string]: (filter: any) => any };
    },
  ) {
    this.key = selector.key;
    this.select = selector.select;
    this.format = selector.format;
    this.filter = selector.filter;
  }
}
