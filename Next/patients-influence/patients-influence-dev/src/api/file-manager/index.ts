import Project from 'constants/project';
import { client } from 'api/api-client';

const FileManagerApi = {
  fileUpload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await client.post(
      `${Project.apis.v1}/fileManager/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return data;
  },

  fileDelete: async (id: number) => {
    await client.delete(`${Project.apis.v1}/fileManager/${id}`);
  },

  fileDownload: async (id: string) => {
    const res = await client.get(`${Project.apis.v1}/fileManager/${id}`);

    return res;
  },
};

export default FileManagerApi;
