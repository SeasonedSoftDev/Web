import axios from 'axios';
import Project from 'constants/project';
import {
  TAddInfluencer,
  TContactInfluencer,
  TUpdateInfluencer,
} from 'api/admin/types';

const AdminAPI = {
  createAmbassadorInviteLink: async () => {
    const { data } = await axios.get(
      `${Project.apis.v1}/admin/ambassador-link`,
      {
        withCredentials: true,
      }
    );
    return data;
  },
  getInfluencers: async (query: string) => {
    const { data } = await axios.get(
      `${Project.apis.v1}/admin/influencers/leads/?status=${query}`
    );
    return data;
  },
  getDiseaseAreas: async () => {
    const { data } = await axios.get(
      `${Project.apis.v1}/admin/filters/disease-area`
    );
    return data;
  },
  getLocation: async () => {
    const { data } = await axios.get(
      `${Project.apis.v1}/admin/filters/countries-cities`
    );
    return data;
  },
  getSocialMedia: async () => {
    const { data } = await axios.get(
      `${Project.apis.v1}/admin/filters/social-media`
    );
    return data;
  },
  addInfluencer: async (body: TAddInfluencer) => {
    const { data } = await axios.post(
      `${Project.apis.v1}/admin/influencers/leads`,
      body
    );
    return data;
  },
  contactInfluencer: async (body: TContactInfluencer) => {
    const { data } = await axios.post(`${Project.apis.v1}/admin/contact`, body);
    return data;
  },
  deleteInfluencer: async (id: string) => {
    const { data } = await axios.delete(
      `${Project.apis.v1}/admin/influencers/leads/${id}`
    );
    return data;
  },
  updateInfluencer: async (id: string, body: TUpdateInfluencer) => {
    const { data } = await axios.put(
      `${Project.apis.v1}/admin/influencers/leads/${id}`,
      body
    );
    return data;
  },
};

export default AdminAPI;
