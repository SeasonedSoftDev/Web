import { Prisma, User } from '@prisma/client';
import { Status } from 'src/core/campaign/enums/status.enum';
import { Selector } from 'src/utils';

export const FirstNameSelector = new Selector<User, Prisma.UserSelect>({
  key: 'firstName',
  select: {
    firstName: true,
  },
  filter: {
    search: ({ search }) =>
      ({
        firstName: {
          contains: search,
          mode: 'insensitive',
        },
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.firstName;
  },
});

export const LastNameSelector = new Selector<User, Prisma.UserSelect>({
  key: 'lastName',
  select: {
    lastName: true,
  },
  filter: {
    search: ({ search }) =>
      ({
        lastName: {
          contains: search,
          mode: 'insensitive',
        },
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.lastName;
  },
});

export const EmailSelector = new Selector<User, Prisma.UserSelect>({
  key: 'email',
  select: {
    email: true,
  },
  filter: {
    search: ({ search }) =>
      ({
        email: {
          contains: search,
          mode: 'insensitive',
        },
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.email;
  },
});

export const RegisteredAtSelector = new Selector<User, Prisma.UserSelect>({
  key: 'registeredAt',
  select: {
    createdAt: true,
  },
  filter: {
    joinedBefore: ({ joinedBefore }) =>
      ({
        createdAt: {
          lte: joinedBefore,
        },
      } as Prisma.UserWhereInput),
    joinedAfter: ({ joinedAfter }) =>
      ({
        createdAt: {
          gte: joinedAfter,
        },
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.createdAt;
  },
});

export const UpdatedAtSelector = new Selector<User, Prisma.UserSelect>({
  key: 'updatedAt',
  select: {
    updatedAt: true,
  },
  filter: {},
  format: (user: any) => {
    return user.updatedAt;
  },
});

export const LabelSelector = new Selector<User, Prisma.UserSelect>({
  key: 'labels',
  select: {
    assigneeUserLabels: {
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
  filter: {
    labels: ({ labels }) =>
      ({
        assigneeUserLabels: {
          some: {
            labelOption: {
              id: {
                in: labels,
              },
            },
          },
        },
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.assigneeUserLabels.map((l) => l.labelOption);
  },
});

export const AmbassadorSelector = new Selector<User, Prisma.UserSelect>({
  key: 'ambassador',
  select: {
    client: {
      select: {
        ambassador: {
          select: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
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
        client: {
          ambassador: {
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
          },
        },
      } as Prisma.UserWhereInput),
    ambassadors: ({ ambassadors }) =>
      ({
        client: {
          ambassador: {
            id: {
              in: ambassadors,
            },
          },
        },
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.client.ambassador?.user || null;
  },
});

export const CompanySelector = new Selector<User, Prisma.UserSelect>({
  key: 'company',
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
  filter: {
    search: ({ search }) =>
      ({
        client: {
          company: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      } as Prisma.UserWhereInput),
    companies: ({ companies }) =>
      ({
        client: {
          company: {
            id: {
              in: companies,
            },
          },
        },
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.client.company || null;
  },
});

export const IndustrySelector = new Selector<User, Prisma.UserSelect>({
  key: 'industry',
  select: {
    client: {
      select: {
        industry: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
  filter: {
    search: ({ search }) =>
      ({
        client: {
          industry: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      } as Prisma.UserWhereInput),
    industries: ({ industries }) =>
      ({
        client: {
          industry: {
            id: {
              in: industries,
            },
          },
        },
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.client.industry || null;
  },
});

export const ProductSelector = new Selector<User, Prisma.UserSelect>({
  key: 'product',
  select: {
    client: {
      select: {
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
  filter: {
    search: ({ search }) =>
      ({
        client: {
          productOptions: {
            some: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      } as Prisma.UserWhereInput),
    products: ({ products }) =>
      ({
        client: {
          productOptions: {
            some: {
              id: {
                in: products,
              },
            },
          },
        },
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.client.productOptions.map((x) => x.name);
  },
});

export const LocationSelector = new Selector<User, Prisma.UserSelect>({
  key: 'location',
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
  filter: {
    search: ({ search }) =>
      ({
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
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    const location = { country: null, city: null };

    if (!user.location) return location;

    const { country, ...rest } = user.location;
    if (user.location.country) {
      location.country = country;
      location.city = rest;
    } else {
      location.country = rest;
    }

    return location;
  },
});

export const MarketsSelector = new Selector<User, Prisma.UserSelect>({
  key: 'markets',
  select: {
    client: {
      select: {
        clientMarkets: {
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
        client: {
          clientMarkets: {
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
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.client.clientMarkets.map((market) => {
      const location = { country: null, city: null };

      if (!market.location) return location;

      const { country, ...rest } = market.location;
      if (market.location.country) {
        location.country = country;
        location.city = rest;
      } else {
        location.country = rest;
      }

      return { id: market.id, ...location };
    });
  },
});

export const DiseaseAreasSelector = new Selector<User, Prisma.UserSelect>({
  key: 'diseaseAreas',
  select: {
    client: {
      select: {
        clientDiseaseAreas: {
          select: {
            diseaseArea: {
              select: {
                id: true,
                name: true,
                parentDiseaseArea: {
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
        client: {
          clientDiseaseAreas: {
            some: {
              diseaseArea: {
                OR: [
                  {
                    name: {
                      contains: search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    parentDiseaseArea: {
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
      } as Prisma.UserWhereInput),
    diseaseAreas: ({ diseaseAreas }) =>
      ({
        client: {
          clientDiseaseAreas: {
            some: {
              diseaseArea: {
                OR: [
                  {
                    id: {
                      in: diseaseAreas,
                    },
                  },
                  {
                    parentDiseaseArea: {
                      id: {
                        in: diseaseAreas,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.client.clientDiseaseAreas.map(({ diseaseArea }) => {
      return diseaseArea;
    });
  },
});

export const CompanyTitleSelector = new Selector<User, Prisma.UserSelect>({
  key: 'companyTitle',
  select: {
    client: {
      select: {
        companyTitle: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  },
  filter: {
    search: ({ search }) =>
      ({
        client: {
          companyTitle: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      } as Prisma.UserWhereInput),
    companyTitles: ({ companyTitles }) =>
      ({
        client: {
          companyTitle: {
            id: {
              in: companyTitles,
            },
          },
        },
      } as Prisma.UserWhereInput),
  },
  format: (user: any) => {
    return user.client.companyTitle;
  },
});

export const ContactedAtSelector = new Selector<User, Prisma.UserSelect>({
  key: 'contactedAt',
  select: {},
  filter: {},
  format: (user: any) => {
    return 'N/A';
  },
});

export const TotalBudgetSelector = new Selector<User, Prisma.UserSelect>({
  key: 'totalBudget',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {},
          select: {
            budget: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder.reduce((a, b) => a + b.budget, 0);
  },
});

export const TotalBudgetLastMonthSelector = new Selector<
  User,
  Prisma.UserSelect
>({
  key: 'totalBudgetLastMonth',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            createdAt: {
              gte: new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
          },
          select: {
            createdAt: true,
            budget: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder
      .filter((order) => {
        if (
          new Date(order.createdAt).getTime() >
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ) {
          return true;
        }
        return false;
      })
      .reduce((a, b) => a + b.budget, 0);
  },
});

export const TotalProjectsSelector = new Selector<User, Prisma.UserSelect>({
  key: 'totalProjects',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {},
          select: {
            id: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder.length;
  },
});

export const TotalOngoingProjectsSelector = new Selector<
  User,
  Prisma.UserSelect
>({
  key: 'totalOngoingProjects',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            status: Status.OnGoing,
            /* OR: [
              {
                campaigns: {
                  some: {
                    status: Status.OnGoing,
                  },
                },
              },
              {
                surveys: {
                  some: {
                    status: Status.OnGoing,
                  },
                },
              },
              {
                socialMediaListenings: {
                  some: {
                    status: Status.OnGoing,
                  },
                },
              },
            ], */
          },
          select: {
            id: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder.reduce((a, b) => {
      const campaigns = b.surveys?.length || 0;
      const surveys = b.campaigns?.length || 0;
      const socialMediaListenings = b.socialMediaListenings?.length || 0;
      return a + campaigns + surveys + socialMediaListenings;
    }, 0);
  },
});

export const TotalProjectsLastMonthSelector = new Selector<
  User,
  Prisma.UserSelect
>({
  key: 'totalProjectsLastMonth',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            createdAt: {
              gte: new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000,
              ).toISOString(),
            },
          },
          select: {
            createdAt: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder.filter((order) => {
      if (
        new Date(order.createdAt).getTime() >
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ) {
        return true;
      }
      return false;
    }).length;
  },
});

export const AverageCampaignBudgetSelector = new Selector<
  User,
  Prisma.UserSelect
>({
  key: 'averageCampaignBudget',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            campaigns: {},
          },
          select: {
            budget: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    if (!!!user.client.platformProductOrder.length) return 0;

    return (
      user.client.platformProductOrder.reduce((a, b) => {
        return a + b.budget;
      }, 0) / user.client.platformProductOrder.length
    );
  },
});

export const TotalCampaignBudgetSelector = new Selector<
  User,
  Prisma.UserSelect
>({
  key: 'totalCampaignBudget',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            campaigns: {},
          },
          select: {
            budget: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder
      .filter((a) => !!a.campaign)
      .reduce((a, b) => a + b.budget, 0);
  },
});

export const TotalCampaignsSelector = new Selector<User, Prisma.UserSelect>({
  key: 'totalCampaigns',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            campaigns: {},
          },
          select: {
            id: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder.filter((a) => !!a.campaigns.length)
      .length;
  },
});

export const TotalCampaignsLastMonthSelector = new Selector<
  User,
  Prisma.UserSelect
>({
  key: 'totalCampaignsLastMonth',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            campaigns: {
              some: {
                createdAt: {
                  gte: new Date(
                    Date.now() - 30 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                },
              },
            },
          },
          select: {
            id: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder.filter((order) => {
      if (
        new Date(order.createdAt).getTime() >
          Date.now() - 30 * 24 * 60 * 60 * 1000 &&
        !!order.campaigns.length
      ) {
        return true;
      }
      return false;
    }).length;
  },
});

export const TotalCampaignBudgetLastMonthSelector = new Selector<
  User,
  Prisma.UserSelect
>({
  key: 'totalCampaignBudgetLastMonth',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            campaigns: {
              some: {
                createdAt: {
                  gte: new Date(
                    Date.now() - 30 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                },
              },
            },
          },
          select: {
            id: true,
            budget: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder
      .filter((order) => {
        if (
          new Date(order.createdAt).getTime() >
            Date.now() - 30 * 24 * 60 * 60 * 1000 &&
          !!order.campaigns.length
        ) {
          return true;
        }
        return false;
      })
      .reduce((a, b) => a + b.budget, 0);
  },
});

export const AverageSurveyBudgetSelector = new Selector<
  User,
  Prisma.UserSelect
>({
  key: 'averageSurveyBudget',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            surveys: {},
          },
          select: {
            budget: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    if (!!!user.client.platformProductOrder.length) return 0;

    return (
      user.client.platformProductOrder.reduce((a, b) => {
        return a + b.budget;
      }, 0) / user.client.platformProductOrder.length
    );
  },
});

export const TotalSurveyBudgetSelector = new Selector<User, Prisma.UserSelect>({
  key: 'totalSurveyBudget',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            surveys: {},
          },
          select: {
            budget: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder
      .filter((a) => !!a.surveys.length)
      .reduce((a, b) => a + b.budget, 0);
  },
});

export const TotalSurveysSelector = new Selector<User, Prisma.UserSelect>({
  key: 'totalSurveys',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            surveys: {},
          },
          select: {
            id: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder.filter((a) => !!a.surveys.length)
      .length;
  },
});

export const TotalSurveysLastMonthSelector = new Selector<
  User,
  Prisma.UserSelect
>({
  key: 'totalSurveysLastMonth',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            surveys: {
              some: {
                createdAt: {
                  gte: new Date(
                    Date.now() - 30 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                },
              },
            },
          },
          select: {
            id: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder.filter((order) => {
      if (
        new Date(order.createdAt).getTime() >
          Date.now() - 30 * 24 * 60 * 60 * 1000 &&
        !!order.surveys.length
      ) {
        return true;
      }
      return false;
    }).length;
  },
});

export const TotalSurveyBudgetLastMonthSelector = new Selector<
  User,
  Prisma.UserSelect
>({
  key: 'totalSurveyBudgetLastMonth',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            surveys: {
              some: {
                createdAt: {
                  gte: new Date(
                    Date.now() - 30 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                },
              },
            },
          },
          select: {
            id: true,
            budget: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder
      .filter((order) => {
        if (
          new Date(order.createdAt).getTime() >
            Date.now() - 30 * 24 * 60 * 60 * 1000 &&
          !!order.surveys.length
        ) {
          return true;
        }
        return false;
      })
      .reduce((a, b) => a + b.budget, 0);
  },
});

export const AverageSmlBudgetSelector = new Selector<User, Prisma.UserSelect>({
  key: 'averageSmlBudget',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            socialMediaListenings: {},
          },
          select: {
            budget: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    if (!!!user.client.platformProductOrder.length) return 0;

    return (
      user.client.platformProductOrder.reduce((a, b) => {
        return a + b.budget;
      }, 0) / user.client.platformProductOrder.length
    );
  },
});

export const TotalSmlBudgetSelector = new Selector<User, Prisma.UserSelect>({
  key: 'totalSmlBudget',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            socialMediaListenings: {},
          },
          select: {
            budget: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder
      .filter((a) => !!a.surveys.length)
      .reduce((a, b) => a + b.budget, 0);
  },
});

export const TotalSmlSelector = new Selector<User, Prisma.UserSelect>({
  key: 'totalSml',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            socialMediaListenings: {},
          },
          select: {
            id: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder.filter((a) => !!a.surveys.length)
      .length;
  },
});

export const TotalSmlLastMonthSelector = new Selector<User, Prisma.UserSelect>({
  key: 'totalSmlLastMonth',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            socialMediaListenings: {
              some: {
                createdAt: {
                  gte: new Date(
                    Date.now() - 30 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                },
              },
            },
          },
          select: {
            id: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder.filter((order) => {
      if (
        new Date(order.createdAt).getTime() >
          Date.now() - 30 * 24 * 60 * 60 * 1000 &&
        !!order.surveys.length
      ) {
        return true;
      }
      return false;
    }).length;
  },
});

export const TotalSmlBudgetLastMonthSelector = new Selector<
  User,
  Prisma.UserSelect
>({
  key: 'totalSmlBudgetLastMonth',
  select: {
    client: {
      select: {
        platformProductOrder: {
          where: {
            socialMediaListenings: {
              some: {
                createdAt: {
                  gte: new Date(
                    Date.now() - 30 * 24 * 60 * 60 * 1000,
                  ).toISOString(),
                },
              },
            },
          },
          select: {
            id: true,
            budget: true,
          },
        },
      },
    },
  },
  filter: {},
  format: (user: any) => {
    return user.client.platformProductOrder
      .filter((order) => {
        if (
          new Date(order.createdAt).getTime() >
            Date.now() - 30 * 24 * 60 * 60 * 1000 &&
          !!order.surveys.length
        ) {
          return true;
        }
        return false;
      })
      .reduce((a, b) => a + b.budget, 0);
  },
});

const ClientSelectors = [
  FirstNameSelector,
  LastNameSelector,
  EmailSelector,
  RegisteredAtSelector,
  UpdatedAtSelector,
  LabelSelector,
  AmbassadorSelector,
  CompanySelector,
  IndustrySelector,
  ProductSelector,
  LocationSelector,
  MarketsSelector,
  DiseaseAreasSelector,
  CompanyTitleSelector,
  ContactedAtSelector,
  TotalBudgetSelector,
  TotalBudgetLastMonthSelector,
  TotalProjectsSelector,
  TotalOngoingProjectsSelector,
  TotalProjectsLastMonthSelector,
  AverageCampaignBudgetSelector,
  TotalCampaignsSelector,
  TotalCampaignsLastMonthSelector,
  TotalCampaignBudgetSelector,
  TotalCampaignBudgetLastMonthSelector,
  AverageSurveyBudgetSelector,
  TotalSurveysSelector,
  TotalSurveysLastMonthSelector,
  TotalSurveyBudgetSelector,
  TotalSurveyBudgetLastMonthSelector,
  AverageSmlBudgetSelector,
  TotalSmlSelector,
  TotalSmlLastMonthSelector,
  TotalSmlBudgetSelector,
  TotalSmlBudgetLastMonthSelector,
];

export default ClientSelectors;
