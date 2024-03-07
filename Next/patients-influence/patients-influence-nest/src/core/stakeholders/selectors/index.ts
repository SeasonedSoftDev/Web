import { Prisma, Stakeholder } from '@prisma/client';
import { Selector } from 'src/utils';

export const InfluencerSelector = new Selector<
  Stakeholder,
  Prisma.StakeholderSelect
>({
  key: 'influencer',
  select: {
    influencer: {
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
  filter: {},
  format: (stakeholder: any) => {
    const user = stakeholder.influencer?.user;

    if (!user) return 'N/A';

    return user;
  },
});

export const LocationSelector = new Selector<
  Stakeholder,
  Prisma.StakeholderSelect
>({
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
    locations: ({ locations }) => ({
      location: {
        OR: [
          {
            id: {
              in: locations,
            },
          },
          {
            country: {
              id: {
                in: locations,
              },
            },
          },
        ],
      },
    }),
  },
  format: (stakeholder: any) => {
    const location = { country: null, city: null };

    if (!stakeholder.location) return location;

    const { country, ...rest } = stakeholder.location;
    if (stakeholder.location.country) {
      location.country = country;
      location.city = rest;
    } else {
      location.country = rest;
    }

    return location;
  },
});

export const SocialPlatformSelector = new Selector<
  Stakeholder,
  Prisma.StakeholderSelect
>({
  key: 'socialPlatform',
  select: {
    socialPlatform: {
      select: {
        id: true,
        name: true,
      },
    },
  },
  filter: {
    platforms: ({ platforms }) => ({
      socialPlatform: {
        id: {
          in: platforms,
        },
      },
    }),
  },
  format: (stakeholder: any) => {
    return stakeholder.socialPlatform.name;
  },
});
