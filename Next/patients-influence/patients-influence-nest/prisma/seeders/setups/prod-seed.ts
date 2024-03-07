import { PrismaClient, Prisma } from '@prisma/client';
import {
  Hash,
  LabelType,
  UserRole,
  createSeedState,
  seedLogger,
} from '../../../src/utils';
import {
  DCompanyTitles,
  DDiseaseAreas,
  DEthnicities,
  DLocations,
  DSocialPlatforms,
  DInfluencerSizes,
  DIndustries,
  DBenefitCategories,
  DStruggles,
  DSymptoms,
  DThemes,
  DLabels,
  DCurrencies,
  DCompanies,
  DInterests,
} from '../data';

import seedConfig from '../configs/prod-config.json';
import { DLegals } from '../data/legals';

const prisma = new PrismaClient();

const toSnakeCase = (inputString) => {
  const lowercased = inputString.toLowerCase();
  const replaced = lowercased.replace(/[-\s]/g, '_');
  const stripped = replaced.replace(/'/g, '');
  const stripeOpenParne = stripped.replace(/\(/g, '');
  const stripeCloseParne = stripeOpenParne.replace(/\)/g, '');

  return stripeCloseParne;
};

type TSeedPrivileges =
  | 'user'
  | 'company'
  | 'companyProduct'
  | 'companyTitle'
  | 'diseaseArea'
  | 'location'
  | 'label'
  | 'ethnicity'
  | 'socialPlatform'
  | 'influencersSize'
  | 'industry'
  | 'struggle'
  | 'symptom'
  | 'interest'
  | 'theme'
  | 'benefitCategory'
  | 'currency'
  | 'legal';

const state = createSeedState<TSeedPrivileges>(seedConfig);

export const main = async () => {
  await prisma.$transaction(async (tx) => work(tx), {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    timeout: 10 * 60 * 1000,
  });
};

const work = async (
  tx: Omit<
    PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation
    >,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'
  >,
) => {
  if (state.user.privileges.write) {
    //* INSERTING DATA - ADMINS

    seedLogger('Seeding users', '...');

    const superadminEmail = process.env.SUPERADMIN_EMAIL;
    const superadminPassword = process.env.SUPERADMIN_PASS;

    const admin = await tx.user.upsert({
      create: {
        firstName: 'Ivan',
        lastName: 'Jurišić',
        email: superadminEmail,
        password: await Hash(superadminPassword),
        role: UserRole.SuperAdmin,
        status: 3,
        admin: {
          create: {
            isSuperuser: true,
          },
        },
      },
      where: { email: superadminEmail },
      update: {},
      include: {
        admin: true,
      },
    });
    seedLogger('Admin info', JSON.stringify(admin))
  }

  if (state.company.privileges.write) {
    //* INSERTING DATA - COMPANIES
    seedLogger('Seeding companies', '...');

    for await (const dCompany of DCompanies) {
      const company = await tx.company.upsert({
        create: {
          name: dCompany.name,
          isApproved: true,
        },
        where: { name: dCompany.name },
        update: {},
      });

      if (state.companyProduct.privileges.write && dCompany.products) {
        seedLogger('Seeding company products', '...');

        for await (const product of dCompany.products) {
          const dCompanyProduct = product as {
            genericName: string;
            brandName: string;
          };

          dCompanyProduct.brandName &&
            (await tx.product.upsert({
              where: {
                name_genericName: {
                  name: dCompanyProduct.brandName,
                  genericName: dCompanyProduct.genericName ?? '',
                },
              },
              create: {
                name: dCompanyProduct.brandName,
                genericName: dCompanyProduct.genericName,
                isApproved: true,
                isBranded: true,
                companyProducts: { create: { companyId: company.id } },
              },
              update: {},
            }));
        }
      }
    }
  }

  if (state.companyTitle.privileges.write) {
    //* INSERTING DATA - COMPANY TITLES
    seedLogger('Seeding company titles', '...');

    for await (const name of DCompanyTitles) {
      await tx.companyTitle.upsert({
        create: { name },
        where: { name },
        update: {},
      });
    }
  }

  if (state.diseaseArea.privileges.write) {
    //* INSERTING DATA - DISEASE AREAS
    seedLogger('Seeding disease areas', '...');

    for await (const singleDisease of DDiseaseAreas) {
      const disease = await tx.diseaseArea.upsert({
        create: {
          name: singleDisease.name,
          identifier: toSnakeCase(singleDisease.name),
        },
        where: { name: singleDisease.name },
        update: {},
      });

      for await (const subDisease of singleDisease.subdiseases) {
        await tx.diseaseArea.upsert({
          where: { name: subDisease },
          create: {
            name: subDisease,
            parentDiseaseAreaId: disease.id,
            identifier: toSnakeCase(subDisease),
          },
          update: {},
        });
      }
    }
  }

  // if (state.location.privileges.write) {
  //   //* INSERTING DATA - LOCATIONS
  //   seedLogger('Seeding locations', '...');

  //   const locations = await tx.location.findMany();

  //   for await (const dLocation of DLocations) {
  //     if (
  //       !locations.find(
  //         (location) =>
  //           location.name.trim().toString().toLowerCase() ===
  //           dLocation.name.trim().toString().toLowerCase(),
  //       )
  //     ) {
  //       await tx.location.create({
  //         data: {
  //           name: dLocation.name,
  //         },
  //       });
  //     }
  //     for await (const dCity of dLocation.cities) {
  //       if (
  //         !locations.find(
  //           (location) =>
  //             location.name.trim().toString().toLowerCase() ===
  //             dCity.trim().toString().toLowerCase(),
  //         )
  //       ) {
  //         await tx.location.create({
  //           data: {
  //             name: dCity,
  //           },
  //         });
  //       }
  //     }
  //   }
  // }

  // INSERTING DATA - LOCATIONS
  if (state.location.privileges.write) {
    await prisma.location.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE locations_id_seq RESTART WITH 1;`;
    for await (const singleLocation of DLocations) {
      const location = await prisma.location.create({
        data: {
          name: singleLocation.name,
        },
      });
      state.location.add(location);
      seedLogger('Location', singleLocation.name);
      for await (const singleSubLocation of singleLocation.cities) {
        const subLocation = await prisma.location.create({
          data: {
            name: singleSubLocation,
            countryId: location.id,
          },
        });
        state.location.add(subLocation);
        seedLogger(
          'Location',
          `${singleSubLocation} in ${singleLocation.name}`,
        );
      }
    }
  }
  if (state.location.privileges.read) {
    const locations = await prisma.location.findMany();
    state.location.set(locations);
    seedLogger(
      'Locations loaded from database',
      `${locations.length} entities`,
    );
  }

  if (state.label.privileges.write) {
    //* INSERTING DATA - LABEL OPTIONS
    seedLogger('Seeding label options', '...');

    for await (const singleLabelOption of DLabels) {
      const { name, assigneeType } = singleLabelOption;
      await tx.label.upsert({
        create: {
          name,
          assigneeType: assigneeType
            ? LabelType.PlatformProduct
            : LabelType.User,
        },
        where: { LabelIdentifier: { assigneeType, name } },
        update: {},
      });
    }
  }

  if (state.ethnicity.privileges.write) {
    //* INSERTING DATA - ENTHNICITIES
    seedLogger('Seeding ethnicities', '...');

    for await (const name of DEthnicities) {
      await tx.ethnicity.upsert({
        create: { name, identifier: toSnakeCase(name) },
        where: { name },
        update: {},
      });
    }
  }

  if (state.socialPlatform.privileges.write) {
    //* INSERTING DATA - SOCIAL PLATFORMS
    seedLogger('Seeding social platforms', '...');

    for await (const name of DSocialPlatforms) {
      await tx.socialPlatform.upsert({
        create: { name },
        where: { name },
        update: {},
      });
    }
  }

  if (state.influencersSize.privileges.write) {
    //* INSERTING DATA - PLATFORM PRODUCTS
    seedLogger('Seeding influencer sizes', '...');

    for await (const singleInfluencerSize of DInfluencerSizes) {
      const { name, from, to } = singleInfluencerSize;
      await tx.influencersSize.upsert({
        create: { name, from, to },
        where: { name },
        update: {},
      });
    }
  }

  if (state.struggle.privileges.write) {
    //* INSERTING DATA - STRUGGLE OPTIONS
    seedLogger('Seeding struggles', '...');

    for await (const name of DStruggles) {
      await tx.struggle.upsert({
        create: { name, identifier: toSnakeCase(name) },
        where: { name },
        update: {},
      });
    }
  }

  if (state.industry.privileges.write) {
    //* INSERTING DATA - INDUSTRIES
    seedLogger('Seeding industries', '...');

    for await (const name of DIndustries) {
      await tx.industry.upsert({
        create: { name },
        where: { name },
        update: {},
      });
    }
  }

  if (state.benefitCategory.privileges.write) {
    //* INSERTING DATA - BENEFIT CATEGORIES
    seedLogger('Seeding benefit categories', '...');

    for await (const name of DBenefitCategories) {
      await tx.benefitCategory.upsert({
        create: { name },
        where: { name },
        update: {},
      });
    }
  }

  if (state.symptom.privileges.write) {
    //* INSERTING DATA - SYMPTOMS
    seedLogger('Seeding symptoms', '...');

    for await (const name of DSymptoms) {
      await tx.symptom.upsert({
        create: { name, identifier: toSnakeCase(name) },
        where: { name },
        update: {},
      });
    }
  }

  if (state.currency.privileges.write) {
    //* INSERTING DATA - CURRENCIES
    seedLogger('Seeding currencies', '...');

    for await (const code of DCurrencies) {
      await tx.currency.upsert({
        create: { code },
        where: { code },
        update: {},
      });
    }
  }

  if (state.theme.privileges.write) {
    //* INSERTING DATA - THEMES
    seedLogger('Seeding themes', '...');

    for await (const name of DThemes) {
      await tx.theme.upsert({
        create: { name, identifier: toSnakeCase(name) },
        where: { name },
        update: {},
      });
    }
  }

  if (state.interest.privileges.write) {
    //* INSERTING DATA - INTERESTS
    seedLogger('Seeding interests', '...');

    for await (const name of DInterests) {
      await tx.interest.upsert({
        create: { name, identifier: toSnakeCase(name) },
        where: { name },
        update: {},
      });
    }
  }

  if (state.legal.privileges.write) {
    //* INSERTING DATA - LEGALS
    seedLogger('Seeding legals', '...');

    for await (const legal of DLegals) {
      const { language, text, type, version } = legal;

      await tx.legal.upsert({
        create: { text, language, type, version },
        where: { type_language_version: { language, type, version } },
        update: {},
      });
    }
  }
};
