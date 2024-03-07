import Project from 'constants/project';

export const validateToken = async () => {
  try {
    // const user = await fetch(`${Project.apis.v1}/pingAuth`, {
    //   method: 'GET',
    //   credentials: 'include'
    // }).then((x) => {

    //   if (x.ok) {
    //     return x.json()
    //   }
    //   throw new Error('Invalid token.')
    // });
    await fetch(`${Project.apis.v1}/pingAuth`, {
      credentials: 'include',
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Middleware error');
      }

      return res.json();
    });
    return true;
  } catch {
    return false;
  }
};
