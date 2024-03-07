import { Prisma, TransactionFlow } from '@prisma/client';
import { Selector, TransactionFlowType } from 'src/utils';

export const NameSelector = new Selector<
  TransactionFlow,
  Prisma.TransactionFlowSelect
>({
  key: 'name',
  select: {
    name: true,
  },
  filter: {
    search: ({ search }) =>
      ({
        name: {
          contains: search,
          mode: 'insensitive',
        },
      } as Prisma.TransactionFlowWhereInput),
  },
  format: (transactionFlow: any) => {
    return transactionFlow.name;
  },
});

export const UserSelector = new Selector<
  TransactionFlow,
  Prisma.TransactionFlowSelect
>({
  key: 'user',
  select: {
    user: {
      select: {
        firstName: true,
        lastName: true,
      },
    },
  },
  filter: {
    search: ({ search }) =>
      ({
        user: {
          OR: [
            {
              firstName: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
      } as Prisma.TransactionFlowWhereInput),
  },
  format: (transactionFlow: any) => {
    const { firstName, lastName } = transactionFlow.user;
    return { firstName, lastName };
  },
});

export const AmountSelector = new Selector<
  TransactionFlow,
  Prisma.TransactionFlowSelect
>({
  key: 'amount',
  select: {
    amount: true,
  },
  filter: {},
  format: (transactionFlow: any) => {
    return transactionFlow.amount.toNumber();
  },
});

export const DateSelector = new Selector<
  TransactionFlow,
  Prisma.TransactionFlowSelect
>({
  key: 'createdAt',
  select: {
    createdAt: true,
  },
  filter: {},
  format: (transactionFlow: any) => {
    return transactionFlow.createdAt;
  },
});

export const TypeSelector = new Selector<
  TransactionFlow,
  Prisma.TransactionFlowSelect
>({
  key: 'type',
  select: {
    type: true,
  },
  filter: {},
  format: (transactionFlow: any) => {
    return transactionFlow.type;
  },
});

export const LocationSelector = new Selector<
  TransactionFlow,
  Prisma.TransactionFlowSelect
>({
  key: 'locations',
  select: {
    productOrder: {
      select: {
        platformProductOrderLocations: {
          select: {
            location: {
              select: {
                id: true,
                name: true,
                country: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  filter: {
    search: ({ search }) =>
      ({
        productOrder: {
          platformProductOrderLocations: {
            some: {
              location: {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    country: {
                      name: {
                        contains: search,
                        mode: 'insensitive',
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      } as Prisma.TransactionFlowWhereInput),
  },
  format: (transactionFlow: any) => {
    if (!transactionFlow.productOrder?.platformProductOrderLocations) return [];
    return transactionFlow.productOrder.platformProductOrderLocations.map(
      (x) => {
        const { country, ...rest } = x.location;
        const location = { country: null, city: null };
        location.country = country;
        location.city = rest;
        return location;
      },
    );
  },
});

export const DiseaseAreasSelector = new Selector<
  TransactionFlow,
  Prisma.TransactionFlowSelect
>({
  key: 'diseaseAreas',
  select: {
    productOrder: {
      select: {
        platformProductOrderDiseaseAreas: {
          select: {
            diseaseArea: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    },
  },
  filter: {
    search: ({ search }) =>
      ({
        productOrder: {
          platformProductOrderDiseaseAreas: {
            some: {
              diseaseArea: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      } as Prisma.TransactionFlowWhereInput),
  },
  format: (transactionFlow: any) => {
    return transactionFlow.productOrder?.platformProductOrderDiseaseAreas || [];
  },
});

export const StatusSelector = new Selector<
  TransactionFlow,
  Prisma.TransactionFlowSelect
>({
  key: 'status',
  select: {
    transactions: {
      select: {
        status: true,
        createdAt: true,
      },
    },
  },
  filter: {},
  format: (transactionFlow: any) => {
    return transactionFlow.transactions
      .sort((x, y) => (x.createdAt < y.createdAt ? 1 : -1))
      .shift().status;
  },
});

export const LabelSelector = new Selector<
  TransactionFlow,
  Prisma.TransactionFlowSelect
>({
  key: 'labels',
  select: {
    productOrder: {
      select: {
        platformProductOrderLabels: {
          select: {
            label: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    },
  },
  filter: {
    search: ({ search }) =>
      ({
        productOrder: {
          platformProductsLabels: {
            some: {
              labelOption: {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            },
          },
        },
      } as Prisma.TransactionFlowWhereInput),
  },
  format: (transactionFlow: any) => {
    return (
      transactionFlow.productOrder?.platformProductsLabels.map(
        (x) => x.labelOption,
      ) || []
    );
  },
});

export const CompanySelector = new Selector<
  TransactionFlow,
  Prisma.TransactionFlowSelect
>({
  key: 'company',
  select: {
    productOrder: {
      select: {
        client: {
          select: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    },
  },
  filter: {
    search: ({ search }) =>
      ({
        productOrder: {
          client: {
            company: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      } as Prisma.TransactionFlowWhereInput),
  },
  format: (transactionFlow: any) => {
    const company = transactionFlow.productOrder?.client?.company;
    return company;
  },
});

export const ProductSelector = new Selector<
  TransactionFlow,
  Prisma.TransactionFlowSelect
>({
  key: 'product',
  select: {
    productOrder: {
      select: {
        id: true,
        campaigns: true,
        socialMediaListenings: true,
        surveys: true,
      },
    },
  },
  filter: {},
  format: (transactionFlow: any) => {
    const product = transactionFlow.productOrder;
    if (!product) return null;

    const { id, campaigns, socialMediaListenings, surveys } = product;

    return { id, campaigns, socialMediaListenings, surveys };
  },
});

// export const VendorSelector = new Selector<
//   TransactionFlow,
//   Prisma.TransactionFlowSelect
// >({
//   key: 'vendor',
//   select: {
//     vendor: {
//       select: {
//         id: true,
//         name: true,
//       },
//     },
//   },
//   filter: {},
//   format: (transactionFlow: any) => {
//     const vendor = transactionFlow.vendor;
//     if (!vendor) return null;

//     const { id, name } = vendor;

//     return { id, name };
//   },
// });

const FinanceSelectors = [
  NameSelector,
  UserSelector,
  AmountSelector,
  DateSelector,
  TypeSelector,
  LocationSelector,
  DiseaseAreasSelector,
  StatusSelector,
  LabelSelector,
  CompanySelector,
  ProductSelector,
];

export default FinanceSelectors;
