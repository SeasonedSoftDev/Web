import Project from 'constants/project';
import { TLabel, TLabelId, TLabelName } from 'api/labels/types';
import { client } from 'api/api-client';

const LabelsAPI = {
  getAssigneeType: async () => {
    const { data } = await client.get(
      `${Project.apis.v1}/labels/assigneeTypes`
    );

    return data;
  },

  postLabel: async (body: TLabel) => {
    await client.post(`${Project.apis.v1}/labels`, body);
  },

  getLabels: async () => {
    const { data } = await client.get(`${Project.apis.v1}/labels`);

    return data;
  },

  getLabelByName: async (name: TLabelName) => {
    const { data } = await client.get(`${Project.apis.v1}/labels/${name}`);

    return data;
  },

  getLabelById: async (id: TLabelId) => {
    const { data } = await client.get(`${Project.apis.v1}/labels/${id}`);

    return data;
  },

  deleteLabel: async (id: TLabelId) => {
    await client.delete(`${Project.apis.v1}/labels/${id}`);
  },
};

export default LabelsAPI;
