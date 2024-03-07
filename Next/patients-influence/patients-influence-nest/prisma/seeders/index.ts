import { seedLogger } from '../../src/utils';
import * as devSeed from './setups/dev-seed';
import * as prodSeed from './setups/prod-seed';

const envs = {
  prod: 'production',
  dev: 'development',
};

const main = async () => {
  const start = performance.now();

  // if (process.env.NODE_ENV.toLowerCase() === envs.prod) {
  //   if (!process.env.SUPERADMIN_EMAIL || !process.env.SUPERADMIN_PASS) {
  //     seedLogger(
  //       'Some of env vars are unset',
  //       'SUPERADMIN_EMAIL, SUPERADMIN_PASS',
  //     );
  //     return;
  //   }
  //   seedLogger('Seeding for environment', envs.prod);
  //   await prodSeed.main();
  // } else if (process.env.NODE_ENV.toLowerCase() === envs.dev) {
  seedLogger('Seeding for environment !', envs.dev);
  await prodSeed.main();
  // }

  const end = performance.now();
  seedLogger(
    'Execution Time',
    `${new Date(end - start).toISOString().slice(11, -1)}`,
  );
};

// import { parseArgs } from 'node:util'

// const options = {
//   environment: { type: 'string' },
// }

// async function main() {
//   const {
//     values: { environment },
//   } = parseArgs({ options })

//   switch (environment) {
//     case 'development':
//       /** data for your development */
//       break
//     case 'test':
//       /** data for your test environment */
//       break
//     default:
//       break
//   }
// }

// npx prisma db seed -- --environment development

main();
