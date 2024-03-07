export type TFormatCrudSettings = {
  array: any[];
  notIn: [string, string?];
  where: {
    [key: string]: any;
  };
  create: (item: any) => any;
  update?: (item: any) => any;
  identifier?: (item: any) => any;
};

export const getElementByPath = (element: any, path?: string) => {
  if (!path || (Array.isArray(element) && typeof element === 'object')) {
    return element;
  }

  let currentElement = element;
  const paths = path.split('.');

  for (const p of paths) {
    currentElement = currentElement[p];
  }

  return currentElement;
};

export const formatCrud = (settings: TFormatCrudSettings) => {
  if (!settings.array) return undefined;

  const ret: any = {
    deleteMany: {
      [settings.notIn[0]]: {
        notIn: settings.array.map((item) =>
          typeof item === 'object'
            ? getElementByPath(item, settings.notIn[1])
            : item,
        ),
      },
      ...settings.where,
    },
  };

  if (settings.update) {
    ret.upsert = settings.array.map((x: any) => ({
      create: settings.create(x),
      update: settings.update(x),
      where: settings.identifier(x),
    }));
  } else {
    ret.createMany = {
      data: settings.array.map(settings.create),
      skipDuplicates: true,
    };
  }

  return ret;
};
