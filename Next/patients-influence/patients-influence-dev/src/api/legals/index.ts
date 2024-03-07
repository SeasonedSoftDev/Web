import Project from 'constants/project';
import { client } from 'api/api-client';

const LegalsAPI = {
  getLegals: async (language: string) => {
    const { data } = await client.get(
      `${Project.apis.v1}/legals/mostRecent/html`,
      {
        params: {
          language,
        },
      }
    );
    return data;
  },
};

export default LegalsAPI;
