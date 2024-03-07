import { DBiotechCompanies } from './biotechs';
import { DHealthtechCompanies } from './healthtechs';
import { DHospitalCompanies } from './hospitals';
import { DMedtechCompanies } from './medtechs';

export const DCompanies = [].concat(
  DBiotechCompanies,
  DMedtechCompanies,
  DHealthtechCompanies,
  DHospitalCompanies,
);
