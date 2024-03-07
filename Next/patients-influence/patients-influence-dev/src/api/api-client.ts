import axios from 'axios';
import Project from 'constants/project';

export const client = axios.create({
  baseURL: Project.apis.v1,
  withCredentials: true,
});
