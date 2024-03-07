export function generateRelatedModelCRUDFactory<
  TRelatedModelType extends Record<string, unknown>,
  TUniqueIndex extends Record<string, unknown>,
>() {
  return function <U, V>(
    relatedModelData: U[],
    primaryModelId: {
      id: number | string;
      foreignKey: keyof TRelatedModelType;
    },
    relatedModelIds: [
      { id: (obj: U) => number | string; foreignKey: keyof TRelatedModelType },
    ],
    uniqueKey: keyof TUniqueIndex,
    mapFunc?: (obj: U) => Partial<TRelatedModelType>,
  ) {
    if (relatedModelData === undefined) return undefined;

    const query = {
      deleteMany: {
        [primaryModelId.foreignKey]: primaryModelId.id,
        ...relatedModelIds.reduce(
          (acc: Record<string, unknown>, relatedModelId) => {
            acc[relatedModelId.foreignKey as string] = {
              notIn: relatedModelData.map((data) => relatedModelId.id(data)),
            };
            return acc;
          },
          {},
        ),
      },
      upsert: relatedModelData.map((data) => {
        return {
          create:
            typeof data === 'number' || typeof data === 'string'
              ? { [relatedModelIds[0].foreignKey]: data }
              : mapFunc
              ? mapFunc(data)
              : data,
          update:
            typeof data === 'number' || typeof data === 'string'
              ? { [relatedModelIds[0].foreignKey]: data }
              : mapFunc
              ? mapFunc(data)
              : data,
          where: {
            [uniqueKey]: {
              [primaryModelId.foreignKey]: primaryModelId.id,
              ...relatedModelIds.reduce(
                (acc: Record<string, unknown>, relatedModelId) => {
                  acc[relatedModelId.foreignKey as string] =
                    relatedModelId.id(data);
                  return acc;
                },
                {},
              ),
            },
          },
        };
      }),
    };

    // Changed to any because of build failed, previously was V
    return query as any;
  };
}
