export const formatNumber = (x: number) =>
  x.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

const getObjectDynamicPath = (obj: object, path: string) => {
  const splitedPath = path.split('.');
  const getNested = (a: { [key: string]: any }, b: Array<string>): any => {
    const [firstPath, ...otherPaths] = b;

    if (otherPaths.length) {
      return getNested(a[firstPath], otherPaths);
    }
    return a[firstPath];
  };

  return getNested(obj, splitedPath);
};

export default getObjectDynamicPath;
