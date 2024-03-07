import Project from 'constants/project';
import { client } from 'api/api-client';

const ProductApi = {
  getProducts: async (search: string) => {
    const { data } = await client.get(`${Project.apis.v1}/products`, {
      params: {
        search,
      },
    });

    return data;
  },
  createProduct: async (body: any) => {
    await client.post(`${Project.apis.v1}/products`, body);
  },
};

export default ProductApi;
