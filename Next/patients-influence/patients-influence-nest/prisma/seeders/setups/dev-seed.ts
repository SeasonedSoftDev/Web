import { PrismaClient } from '@prisma/client';
import {
  Hash,
  LabelType,
  UserRole,
  UserStatus,
  createSeedState,
  seedLogger,
} from '../../../src/utils';
import {
  DAdminUsers,
  DCompanyTitles,
  DDiseaseAreas,
  DEthnicities,
  DLocations,
  DSocialPlatforms,
  DInfluencerSizes,
  DIndustries,
  DBenefitCategories,
  DBenefitPartnerships,
  DStruggles,
  DSymptoms,
  DThemes,
  DPlatformProductOrders,
  DLabels,
  DCurrencies,
  createDiscoverClients,
  createInfluencers,
  createClients,
  DCompanies,
  DInterests,
} from '../data';

import seedConfig from '../configs/dev-config.json';
import { createAmbassadors } from '../data/users/ambassadors';
import { DLegals } from '../data/legals';
import { Status } from '../../../src/core/campaign/enums';

const toSnakeCase = (inputString) => {
  const lowercased = inputString.toLowerCase();
  const replaced = lowercased.replace(/[-\s]/g, '_');
  const stripped = replaced.replace(/'/g, '');
  const stripeOpenParne = stripped.replace(/\(/g, '');
  const stripeCloseParne = stripeOpenParne.replace(/\)/g, '');

  return stripeCloseParne;
};

const prisma = new PrismaClient();

type TSeedPrivileges =
  | 'user'
  | 'company'
  | 'companyTitle'
  | 'diseaseArea'
  | 'location'
  | 'label'
  | 'ethnicity'
  | 'socialPlatform'
  | 'influencersSize'
  | 'symptom'
  | 'industry'
  | 'theme'
  | 'interest'
  | 'struggle'
  | 'benefitCategory'
  | 'benefitPartnership'
  | 'stakeholder'
  | 'stakeholderPost'
  | 'platformProductOrder'
  | 'platformProductOrderEthnicity'
  | 'platformProductOrderGender'
  | 'platformProductOrderStruggle'
  | 'platformProductOrderDiseaseArea'
  | 'platformProductOrderInfluencer'
  | 'platformProductOrderInterest'
  | 'platformProductOrderLocation'
  | 'platformProductsLabel'
  | 'currency'
  | 'discoverClient'
  | 'legal'
  | 'companyProduct';

const state = createSeedState<TSeedPrivileges>(seedConfig);

export const main = async () => {
  // DELETING DATA
  seedLogger('Deleting data', '...');
  if (state.platformProductOrder.privileges.delete) {
    await prisma.platformProductOrder.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE platform_product_orders_id_seq RESTART WITH 1;`;
  }
  if (state.user.privileges.delete) {
    await prisma.user.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1;`;
  }
  if (state.discoverClient.privileges.delete) {
    await prisma.discoverClient.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE discover_clients_id_seq RESTART WITH 1;`;
  }
  if (state.currency.privileges.delete) {
    await prisma.currency.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE currencies_id_seq RESTART WITH 1;`;
  }
  if (state.stakeholder.privileges.delete) {
    await prisma.stakeholder.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE stakeholders_id_seq RESTART WITH 1;`;
  }
  if (state.diseaseArea.privileges.delete) {
    await prisma.diseaseArea.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE disease_areas_id_seq RESTART WITH 1;`;
  }
  if (state.location.privileges.delete) {
    await prisma.location.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE locations_id_seq RESTART WITH 1;`;
  }
  if (state.label.privileges.delete) {
    await prisma.label.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE labels_id_seq RESTART WITH 1;`;
  }
  if (state.ethnicity.privileges.delete) {
    await prisma.ethnicity.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE ethnicities_id_seq RESTART WITH 1;`;
  }
  if (state.socialPlatform.privileges.delete) {
    await prisma.socialPlatform.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE social_platforms_id_seq RESTART WITH 1;`;
  }
  if (state.influencersSize.privileges.delete) {
    await prisma.influencersSize.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE influencers_sizes_id_seq RESTART WITH 1;`;
  }
  if (state.industry.privileges.delete) {
    await prisma.industry.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE industries_id_seq RESTART WITH 1;`;
  }
  if (state.struggle.privileges.delete) {
    await prisma.struggle.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE struggles_id_seq RESTART WITH 1;`;
  }
  if (state.symptom.privileges.delete) {
    await prisma.symptom.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE symptoms_id_seq RESTART WITH 1;`;
  }
  if (state.interest.privileges.delete) {
    await prisma.interest.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE interests_id_seq RESTART WITH 1;`;
  }
  if (state.theme.privileges.delete) {
    await prisma.theme.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE themes_id_seq RESTART WITH 1;`;
  }
  if (state.benefitCategory.privileges.delete) {
    await prisma.benefitCategory.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE benefit_categories_id_seq RESTART WITH 1;`;
  }
  if (state.benefitPartnership.privileges.delete) {
    await prisma.benefitPartnership.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE benefit_partnerships_id_seq RESTART WITH 1;`;
  }
  if (state.stakeholderPost.privileges.delete) {
    await prisma.stakeholderPost.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE stakeholder_posts_id_seq RESTART WITH 1;`;
  }
  if (state.company.privileges.delete) {
    await prisma.company.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE companies_id_seq RESTART WITH 1;`;
  }
  if (state.companyTitle.privileges.delete) {
    await prisma.companyTitle.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE company_titles_id_seq RESTART WITH 1;`;
  }
  if (state.legal.privileges.delete) {
    await prisma.legal.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE legals_id_seq RESTART WITH 1;`;
  }
  if (state.companyProduct.privileges.delete) {
    await prisma.companyProduct.deleteMany();
    await prisma.product.deleteMany();
    await prisma.$queryRaw`ALTER SEQUENCE company_products_id_seq RESTART WITH 1;`;
    await prisma.$queryRaw`ALTER SEQUENCE products_id_seq RESTART WITH 1;`;
  }

  if (state.company.privileges.write) {
    // INSERTING DATA - COMPANIES
    for await (const dCompany of DCompanies) {
      const company = await prisma.company.create({
        data: {
          name: dCompany.name,
          isApproved: true,
        },
      });
      const companyProducts = [];
      if (state.companyProduct.privileges.write && dCompany.products) {
        for await (const product of dCompany.products) {
          const dCompanyProduct = product as {
            genericName: string;
            brandName: string;
          };

          const companyProduct =
            dCompanyProduct.brandName &&
            (await prisma.product.upsert({
              where: {
                name_genericName: {
                  name: dCompanyProduct.brandName,
                  genericName: dCompanyProduct.genericName ?? '',
                },
              },
              create: {
                name: dCompanyProduct.brandName,
                genericName: dCompanyProduct.genericName,
                isBranded: true,
                isApproved: true,
                companyProducts: { create: { companyId: company.id } },
              },
              update: {
                companyProducts: {
                  create: {
                    companyId: company.id,
                  },
                },
              },
            }));
          companyProduct && companyProducts.push(companyProduct);
          seedLogger(
            'Company product',
            `${dCompanyProduct.brandName}  ${dCompanyProduct.genericName}`,
          );
        }
      }
      state.company.add(company);
      seedLogger('Company name', company.name);
      seedLogger('With products:', `${companyProducts.length}`);
    }
  }

  if (state.company.privileges.read) {
    const companies = await prisma.company.findMany();
    state.company.set(companies);
    seedLogger(
      'Companies loaded from database',
      `${companies.length} entities`,
    );
  }

  if (state.companyProduct.privileges.read) {
    const companyProducts = await prisma.company.findMany();
    state.companyProduct.set(companyProducts);
    seedLogger(
      'Company products loaded from database',
      `${companyProducts.length} entities`,
    );
  }

  // INSERTING DATA - COMPANY TITLES
  if (state.companyTitle.privileges.write) {
    for await (const name of DCompanyTitles) {
      const companyTitle = await prisma.companyTitle.create({
        data: { name },
      });
      state.companyTitle.add(companyTitle);
      seedLogger('Company title', name);
    }
  }
  if (state.companyTitle.privileges.read) {
    const companyTitles = await prisma.companyTitle.findMany();
    state.companyTitle.set(companyTitles);
    seedLogger(
      'Company titles loaded from database',
      `${companyTitles.length} entities`,
    );
  }

  // INSERTING DATA - DISEASE AREAS
  if (state.diseaseArea.privileges.write) {
    for await (const singleDisease of DDiseaseAreas) {
      const diseaseArea = await prisma.diseaseArea.create({
        data: {
          name: singleDisease.name,
          identifier: toSnakeCase(singleDisease.name),
        },
      });
      state.diseaseArea.add(diseaseArea);
      seedLogger('Disease area', singleDisease.name);
      for await (const singleSubDisease of singleDisease.subdiseases) {
        const subDiseaseArea = await prisma.diseaseArea.create({
          data: {
            name: singleSubDisease,
            parentDiseaseAreaId: diseaseArea.id,
            identifier: toSnakeCase(singleSubDisease),
          },
        });
        state.diseaseArea.add(subDiseaseArea);
        seedLogger('Disease area', singleSubDisease);
      }
    }
  }
  if (state.diseaseArea.privileges.read) {
    const diseaseAreas = await prisma.diseaseArea.findMany();
    state.diseaseArea.set(diseaseAreas);
    seedLogger(
      'Disease areas loaded from database',
      `${diseaseAreas.length} entities`,
    );
  }

  // INSERTING DATA - LOCATIONS
  if (state.location.privileges.write) {
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

  // INSERTING DATA - LABEL OPTIONS
  if (state.label.privileges.write) {
    for await (const singleLabelOption of DLabels) {
      const { name, assigneeType } = singleLabelOption;
      const labelOption = await prisma.label.create({
        data: {
          name,
          assigneeType: assigneeType
            ? LabelType.PlatformProduct
            : LabelType.User,
        },
      });
      state.label.add(labelOption);
      seedLogger(
        'LabelOptions',
        `${assigneeType ? 'Platform Product' : 'User'} - ${name}`,
      );
    }
  }
  if (state.label.privileges.read) {
    const labelOptions = await prisma.label.findMany();
    state.label.set(labelOptions);
    seedLogger(
      'Label options loaded from database',
      `${labelOptions.length} entities`,
    );
  }

  // INSERTING DATA - ENTHNICITIES
  if (state.ethnicity.privileges.write) {
    for await (const name of DEthnicities) {
      const ethnicity = await prisma.ethnicity.create({
        data: { name, identifier: toSnakeCase(name) },
      });
      state.ethnicity.add(ethnicity);
      seedLogger('Ethniciy', name);
    }
  }
  if (state.ethnicity.privileges.read) {
    const ethnicities = await prisma.ethnicity.findMany();
    state.ethnicity.set(ethnicities);
    seedLogger(
      'Ethnicities loaded from database',
      `${ethnicities.length} entities`,
    );
  }

  // INSERTING DATA - SOCIAL PLATFORMS
  if (state.socialPlatform.privileges.write) {
    for await (const name of DSocialPlatforms) {
      const socialPlatform = await prisma.socialPlatform.create({
        data: { name },
      });
      state.socialPlatform.add(socialPlatform);
      seedLogger('socialPlatform', name);
    }
  }
  if (state.socialPlatform.privileges.read) {
    const socialPlatforms = await prisma.socialPlatform.findMany();
    state.socialPlatform.set(socialPlatforms);
    seedLogger(
      'Social platforms loaded from database',
      `${socialPlatforms.length} entities`,
    );
  }

  // INSERTING DATA - PLATFORM PRODUCTS
  if (state.influencersSize.privileges.write) {
    for await (const singleInfluencerSize of DInfluencerSizes) {
      const { name, from, to } = singleInfluencerSize;
      const influencerSize = await prisma.influencersSize.create({
        data: { name, from, to },
      });
      state.influencersSize.add(influencerSize);
      seedLogger('Influencers size', `${name}: ${from} - ${to}`);
    }
  }
  if (state.influencersSize.privileges.read) {
    const influencerSizes = await prisma.influencersSize.findMany();
    state.influencersSize.set(influencerSizes);
    seedLogger(
      'Influencer sizes loaded from database',
      `${influencerSizes.length} entities`,
    );
  }

  // INSERTING DATA - STRUGGLE OPTIONS
  if (state.struggle.privileges.write) {
    for await (const name of DStruggles) {
      const struggleOption = await prisma.struggle.create({
        data: { name, identifier: toSnakeCase(name) },
      });
      state.struggle.add(struggleOption);
      seedLogger('Struggle option', name);
    }
  }
  if (state.struggle.privileges.read) {
    const struggleOptions = await prisma.struggle.findMany();
    state.struggle.set(struggleOptions);
    seedLogger(
      'Struggle options loaded from database',
      `${struggleOptions.length} entities`,
    );
  }

  // INSERTING DATA - INDUSTRIES
  if (state.industry.privileges.write) {
    for await (const name of DIndustries) {
      const industry = await prisma.industry.create({
        data: { name },
      });
      state.industry.add(industry);
      seedLogger('Industry', name);
    }
  }
  if (state.industry.privileges.read) {
    const industries = await prisma.industry.findMany();
    state.industry.set(industries);
    seedLogger(
      'Industries loaded from database',
      `${industries.length} entities`,
    );
  }

  // INSERTING DATA - BENEFIT CATEGORIES
  if (state.benefitCategory.privileges.write) {
    for await (const name of DBenefitCategories) {
      const benefitCategory = await prisma.benefitCategory.create({
        data: { name },
      });
      state.benefitCategory.add(benefitCategory);
      seedLogger('Benefit category', name);
    }
  }
  if (state.benefitCategory.privileges.read) {
    const benefitCategories = await prisma.benefitCategory.findMany();
    state.benefitCategory.set(benefitCategories);
    seedLogger(
      'Benefit categories loaded from database',
      `${benefitCategories.length} entities`,
    );
  }

  // INSERTING DATA - SYMPTOMS
  if (state.symptom.privileges.write) {
    for await (const name of DSymptoms) {
      const symptomOption = await prisma.symptom.create({
        data: { name, identifier: toSnakeCase(name) },
      });
      state.symptom.add(symptomOption);
      seedLogger('Symptom', symptomOption.name);
    }
  }
  if (state.symptom.privileges.read) {
    const symptomOptions = await prisma.symptom.findMany();
    state.symptom.set(symptomOptions);
    seedLogger(
      'Symptoms loaded from database',
      `${symptomOptions.length} entities`,
    );
  }

  // INSERTING DATA - CURRENCIES
  if (state.currency.privileges.write) {
    for await (const input of DCurrencies) {
      const currency = await prisma.currency.create({ data: { code: input } });
      state.currency.add(currency);
      seedLogger('Currency', currency.code);
    }
  }
  if (state.currency.privileges.read) {
    const currencies = await prisma.currency.findMany();
    state.currency.set(currencies);
    seedLogger(
      'Currencies loaded from database',
      `${currencies.length} entities`,
    );
  }

  // INSERTING DATA - THEMES
  if (state.theme.privileges.write) {
    for await (const name of DThemes) {
      const theme = await prisma.theme.create({
        data: { name, identifier: toSnakeCase(name) },
      });
      state.theme.add(theme);
      seedLogger('Theme', theme.name);
    }
  }
  if (state.theme.privileges.read) {
    const themes = await prisma.theme.findMany();
    state.theme.set(themes);
    seedLogger('Themes loaded from database', `${themes.length} entities`);
  }

  // INSERTING DATA - BENEFIT PARTNERSHIPS
  if (state.benefitPartnership.privileges.write) {
    for await (const name of DBenefitPartnerships) {
      const benefitPartnership = await prisma.benefitPartnership.create({
        data: { name },
      });
      state.benefitPartnership.add(benefitPartnership);
      seedLogger('Benefit partnership', name);
    }
  }
  if (state.benefitPartnership.privileges.read) {
    const benefitPartnerships = await prisma.benefitPartnership.findMany();
    state.benefitPartnership.set(benefitPartnerships);
    seedLogger(
      'Benefit partnerships loaded from database',
      `${benefitPartnerships.length} entities`,
    );
  }

  // INSERTING DATA - ADMINS
  if (state.user.privileges.write) {
    for await (const singleAdmin of DAdminUsers) {
      const { firstName, lastName, email, isSuperuser } = singleAdmin;
      const admin = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: await Hash('Password123.'),
          role: isSuperuser ? UserRole.SuperAdmin : UserRole.Admin,
          status: UserStatus.Approved,
          admin: {
            create: {
              isSuperuser,
            },
          },
        },
        include: {
          admin: true,
        },
      });
      state.user.add(admin);
      seedLogger('Admin', `${firstName} ${lastName}`);
    }
    const allInfluencers = await createInfluencers({
      count: 500,
      diseaseAreas: state.diseaseArea,
      ethnicities: state.ethnicity,
      locations: state.location,
    });
    for await (const data of allInfluencers) {
      const influencer = await prisma.user.create({
        data,
        include: {
          influencer: true,
        },
      });
      state.user.add(influencer);
      seedLogger(
        'Influencer',
        `${influencer.firstName} ${influencer.lastName}`,
      );
    }
    const allAmbassadors = await createAmbassadors({
      count: 50,
      companies: state.company,
      companyTitles: state.companyTitle,
      locations: state.location,
      users: state.user,
    });
    for await (const data of allAmbassadors) {
      const ambassador = await prisma.user.create({
        data,
        include: {
          ambassador: true,
        },
      });
      state.user.add(ambassador);
      seedLogger(
        'Ambassador',
        `${ambassador.firstName} ${ambassador.lastName}`,
      );
    }
    const allClients = await createClients({
      count: 500,
      companies: state.company,
      companyTitles: state.companyTitle,
      currencies: state.currency,
      diseaseAreas: state.diseaseArea,
      locations: state.location,
      users: state.user,
    });
    for await (const data of allClients) {
      const client = await prisma.user.create({
        data,
        include: {
          client: true,
        },
      });
      state.user.add(client);
      seedLogger('Client', `${client.firstName} ${client.lastName}`);
    }
  }
  if (state.user.privileges.read) {
    const users = await prisma.user.findMany({
      include: { admin: true, influencer: true, client: true },
    });
    state.user.set(users);
    seedLogger('Users loaded from database', `${users.length} entities`);
  }

  // INSERTING DATA - DISCOVER CLIENTS
  if (state.discoverClient.privileges.write) {
    const DDiscoverClients = createDiscoverClients({
      count: 500,
      companies: state.company,
      companyTitles: state.companyTitle,
      diseaseAreas: state.diseaseArea,
      industries: state.industry,
      locations: state.location,
    });
    for await (const data of DDiscoverClients) {
      const discoverClient = await prisma.discoverClient.create({ data });
      state.discoverClient.add(discoverClient);
      seedLogger('Discover client', discoverClient.email);
    }
  }
  if (state.discoverClient.privileges.read) {
    const discoverClients = await prisma.discoverClient.findMany();
    state.discoverClient.set(discoverClients);
    seedLogger(
      'Discover clients loaded from database',
      `${discoverClients.length} entities`,
    );
  }

  // INSERTING DATA - INTERESTS
  if (state.interest.privileges.write) {
    for await (const name of DInterests) {
      const interest = await prisma.interest.create({
        data: { name, identifier: toSnakeCase(name) },
      });
      state.interest.add(interest);
      seedLogger('Interest', interest.name);
    }
  }
  if (state.interest.privileges.read) {
    const interests = await prisma.interest.findMany();
    state.interest.set(interests);
    seedLogger(
      'Interests loaded from database',
      `${interests.length} entities`,
    );
  }

  // INSERTING DATA - STAKEHOLDERS
  // if (state.stakeholder.privileges.write) {
  //   const allStakeholders = createStakeholders({
  //     count: 20,
  //     users: state.user,
  //     locations: state.location,
  //     diseaseAreas: state.diseaseArea,
  //     ethnicities: state.ethnicity,
  //     socialPlatforms: state.socialPlatform,
  //   });
  //
  //   for await (const data of allStakeholders) {
  //     const stakeholder = await prisma.stakeholder.create({
  //       data,
  //     });
  //     state.stakeholder.add(stakeholder);
  //     seedLogger('Stakeholder', data.socialPlatformUsername);
  //   }
  // }
  // if (state.stakeholder.privileges.read) {
  //   const stakeholders = await prisma.stakeholder.findMany();
  //   state.stakeholder.set(stakeholders);
  //   seedLogger(
  //     'Stakeholders loaded from database',
  //     `${stakeholders.length} entities`,
  //   );
  // }
  //
  // INSERTING DATA - STAKEHOLDER POSTS
  // if (state.stakeholderPost.privileges.write) {
  //   const allStakeholderPosts = createStakeholderPosts({
  //     count: 1000,
  //     stakeholders: state.stakeholder,
  //     diseaseAreas: state.diseaseArea,
  //     struggles: state.struggle,
  //     interests: state.interest,
  //     symptoms: state.symptom,
  //     themes: state.theme,
  //   });
  //
  //   for await (const data of allStakeholderPosts) {
  //     const post = await prisma.stakeholderPost.create({ data });
  //     state.stakeholderPost.add(post);
  //     seedLogger(
  //       'Stakeholder posts',
  //       `Post ID: ${post.id} - (👍 ${post.likes} | 💬 ${post.comments})`,
  //     );
  //   }
  // }
  // if (state.stakeholderPost.privileges.read) {
  //   const stakeholderPosts = await prisma.stakeholderPost.findMany();
  //   state.stakeholderPost.set(stakeholderPosts);
  //   seedLogger(
  //     'Stakeholder posts loaded from database',
  //     `${stakeholderPosts.length} entities`,
  //   );
  // }

  // INSERTING DATA - PLATFORM PRODUCT ORDERS
  if (state.platformProductOrder.privileges.write) {
    for await (const order of DPlatformProductOrders) {
      const c = state.user.getRandom((x) => x.role === UserRole.Client);
      const clientId = c.client.id;
      const result = await prisma.platformProductOrder.create({
        data: {
          budget: order.budget,
          ambassadorCommission: order.ambassadorCommission,
          clientId,
          platformProduct: order.platformProduct,
          platformProductOrderInfluencers: {
            create: {
              influencerId: state.user.getRandom(
                (x) => x.role === UserRole.Influencer,
              ).influencer.id,
              agreedAmount: 10,
              currency: 0,
              status: 0,
            },
          },
          platformProductOrderLabels: {
            create: {
              assignerId: state.user.getRandom((x) => x.role === UserRole.Admin)
                .id,
              labelId: state.label.getRandom().id,
            },
          },
          platformProductOrderInterests: {
            create: {
              interestId: state.interest.getRandom().id,
            },
          },
          platformProductOrderStruggles: {
            create: {
              struggleId: state.struggle.getRandom().id,
            },
          },
          platformProductOrderGenders: {
            create: {
              gender: 1,
            },
          },
          platformProductOrderEthnicities: {
            create: {
              ethnicityId: state.ethnicity.getRandom().id,
            },
          },
          platformProductOrderDiseaseAreas: {
            create: {
              diseaseAreaId: state.diseaseArea.getRandom().id,
            },
          },
          platformProductOrderLocations: {
            create: {
              locationId: state.location.getRandom().id,
            },
          },
          status: Status.InPreparation,
        },
      });
      state.platformProductOrder.add(result);
      seedLogger(
        'PlatformProductOrders',
        `${result.platformProduct} - ${result.budget}$`,
      );
    }
  }
  if (state.platformProductOrder.privileges.read) {
    const platformProductOrders = await prisma.platformProductOrder.findMany();
    state.platformProductOrder.set(platformProductOrders);
    seedLogger(
      'Platform product orders loaded from database',
      `${platformProductOrders.length} entities`,
    );
  }

  // INSERTING DATA - PLATFORM PRODUCT ORDERS
  if (state.legal.privileges.write) {
    for await (const data of DLegals) {
      const result = await prisma.legal.create({ data });
      state.legal.add(result);
      seedLogger(
        'Legal',
        `${result.id} - ${
          result.type === 0 ? 'Common Legal ID' : 'Patient Specific Legal ID'
        }`,
      );
    }
  }
  if (state.legal.privileges.read) {
    const legals = await prisma.legal.findMany();
    state.legal.set(legals);
    seedLogger('Legals loaded from database', `${legals.length} entities`);
  }
};

