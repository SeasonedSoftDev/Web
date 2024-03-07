export type TCreateSeedStatePrivileges = {
  write: boolean;
  read?: boolean;
  delete?: boolean;
};

export type TCreateSeedStateConfig = {
  [key: string]: TCreateSeedStatePrivileges;
};

export type TCreateSeedStateOption = {
  entities: any[];
  privileges: TCreateSeedStatePrivileges;
  add: (i: any) => any;
  set: (i: any[]) => any[];
  remove: (i: any) => any;
  getRandom: (a?: (x: any) => boolean) => any;
  getRandoms: () => any[];
};

export const createSeedState = <T extends string | number | symbol>(
  config: TCreateSeedStateConfig,
) => {
  const state = Object.keys(config).reduce(
    (a, b) => ({
      ...a,
      [b]: {
        entities: [],
        privileges: config[b],
        add: function (item: any) {
          return this.entities.push(item);
        },
        set: function (items: any[]) {
          this.entities = items;
          return this.entities;
        },
        remove: function (item: any) {
          this.entities = this.entities.filter((e) => e !== item);
          return this.entities;
        },
        getRandom: function (filterFunction: (x: any) => boolean = () => true) {
          const filteredEntities = this.entities.filter(filterFunction);
          const randomIndex = Math.floor(
            Math.random() * filteredEntities.length,
          );
          return filteredEntities[randomIndex];
        },
        getRandoms: function (n: number, unique = false) {
          const result = [];
          while (result.length < n) {
            const randomIndex = Math.floor(
              Math.random() * this.entities.length,
            );
            const newEntity = this.entities[randomIndex];
            if (unique && !result.includes(newEntity)) {
              result.push(newEntity);
            } else {
              result.push(newEntity);
            }
          }
          return result;
        },
      },
    }),
    {},
  );

  return state as { [key in T]: TCreateSeedStateOption };
};
// {
//     locations: { write: true, delete: false },
//     locations: { write: true, delete: false },
//     locations: { write: true, delete: false },
//     locations: { write: true, delete: false },
//     locations: { write: true, delete: false },
//     locations: { write: true, delete: false },
//     locations: { write: true, delete: false },
// }

// const seedState = createSeedState({
//     locations: {
//         initialState: [],
//         options: { write: true, delete: false}
//     },
//     users: [],
// })

// const user = await Prisma...
// seedState.locations.add(user);
// seedState.locations.random({ ignoreMap: () => {}})
