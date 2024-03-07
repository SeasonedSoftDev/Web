/* eslint-disable no-shadow */
// eslint-disable-next-line import/named
import { Input } from 'components/ui';
import React, { useEffect, useState } from 'react';
import {
  StepContainer,
  StepForm,
  StepStack,
  StepText,
} from 'components/custom/stepper/stepper-steps/step-2/style';
import { DiseaseAreaAPI, EnumsApi, LocationAPI } from 'api';
import { useAppContext } from 'context';
import { useDebounce } from 'hooks';
import { useTranslation } from 'react-i18next';
import {
  birthDateSchema,
  diseaseAreaSchema,
  emailSchema,
  ethnicitySchema,
  experienceAsSchema,
  genderSchema,
  locationSchema,
} from 'utilities/validators';
import { FormData } from '../..';

type Step2FormProps = {
  formData: FormData;
  setFormData: any;
  handleErrors: (index: number) => (value: boolean) => void;
};

const Step = ({ formData, setFormData, handleErrors }: Step2FormProps) => {
  const { birthDate, location, gender, diseaseAreas, experienceAs, ethnicity } =
    formData;

  const [loading, setLoading] = useState(false);

  const { t } = useTranslation('register');

  const [errors, setErrors] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const [locations, setLocations] = useState([]);
  const [diseaseAreasOptions, setDiseaseAreasOptions] = useState([]);
  const [ethnicities, setEthnicities] = useState([]);
  const [stakeholder, setStakeholders] = useState([]);
  const [genders, setGenders] = useState([]);

  const { user } = useAppContext();

  const getLocations = async (searchTerm: string = '') => {
    setLoading(true);
    const { result } = await LocationAPI.getAll(searchTerm);
    setLocations(
      result.map((data: any) => {
        const checkNotInitial = data.countryId
          ? `${data.name}, ${data.country.name}`
          : data.name;
        const label = !searchTerm.length
          ? `${data.name}, ${data.country.name}`
          : checkNotInitial;

        return {
          value: data.id,
          label,
        };
      })
    );
    setLoading(false);
  };

  const getDiseaseArea = async (s: string = '') => {
    const { result } = await DiseaseAreaAPI.getAll(s);

    setDiseaseAreasOptions(
      result.map((item: any) => ({
        value: item.id,
        label: item.name,
      }))
    );
  };

  const getEthnicity = async () => {
    const result = await EnumsApi.getEthnicities();

    setEthnicities(
      result.map((x: any) => ({
        value: x.id,
        label: x.name,
      }))
    );
  };

  const getStakeholders = async () => {
    const result = await EnumsApi.getStakeholderTypes();

    setStakeholders(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const getGenders = async () => {
    const result = await EnumsApi.getGenders();

    setGenders(
      result.map((x: any) => ({
        value: x.value,
        label: x.name,
      }))
    );
  };

  const debouncedLocation = useDebounce(getLocations, 250);

  const debouncedDisease = useDebounce(getDiseaseArea, 250);

  useEffect(() => {
    getLocations();
    getDiseaseArea();
    getEthnicity();
    getStakeholders();
    getGenders();
  }, []);

  const filteredStakeholdres = stakeholder.filter(
    (element: { value: any }) => element.value === 1 || element.value === 2
  );

  return (
    <StepContainer>
      <StepForm>
        <StepStack direction="horizontal">
          <Input
            type="date"
            label="Date of Birth"
            placeholder="Please Select"
            value={birthDate}
            disabled={user.status >= 4}
            onValue={(birthDate) => setFormData({ ...formData, birthDate })}
            validators={[
              {
                message: t('Birth date is required'),
                validator: (birthDate) => {
                  const v = birthDate as string;
                  if (v) return true;
                  return false;
                },
              },
              {
                message: t('Please add date of birth!'),
                validator: (birthDate) => {
                  try {
                    birthDateSchema.validateSync({ birthDate });
                    return true;
                  } catch {
                    return false;
                  }
                },
              },
            ]}
          />
          <Input
            type="select"
            label="Location"
            onSearch={debouncedLocation}
            placeholder="Please Select"
            value={location}
            loading={loading}
            options={locations}
            disabled={user.status >= 4}
            onValue={(location) => setFormData({ ...formData, location })}
            errorCallback={handleErrors(5)}
            validators={[
              {
                message: t('Location is required'),
                validator: (location) => {
                  const v = location as object;
                  if (v) return true;
                  return false;
                },
              },
              {
                message: t('Please choose location!'),
                validator: (location) => {
                  try {
                    locationSchema.validateSync({ location });
                    return true;
                  } catch {
                    return false;
                  }
                },
              },
            ]}
          />
        </StepStack>
        <StepStack direction="horizontal">
          <Input
            type="select"
            label="Gender"
            placeholder="Please Select"
            value={gender}
            disabled={user.status >= 4}
            onValue={(gender) => setFormData({ ...formData, gender })}
            options={genders}
            errorCallback={handleErrors(6)}
            validators={[
              {
                message: t('Gender is required'),
                validator: (gender) => {
                  const v = gender as object;
                  if (v !== undefined) return true;
                  return false;
                },
              },
              {
                message: t('Please select gender!'),
                validator: (gender) => {
                  try {
                    genderSchema.validateSync({ gender });
                    return true;
                  } catch {
                    return false;
                  }
                },
              },
            ]}
          />
          <Input
            type="multiselect"
            label="Disease Area"
            placeholder="Please Select"
            value={diseaseAreas}
            disabled={user.status >= 4}
            onSearch={debouncedDisease}
            errorCallback={handleErrors(7)}
            onValue={(diseaseAreas) => {
              setFormData({ ...formData, diseaseAreas });
            }}
            options={diseaseAreasOptions}
            isFilterActive
            validators={[
              {
                message: t('Disease area is required'),
                validator: (diseaseArea) => {
                  const v = diseaseArea as [];

                  if (v) return true;
                  return false;
                },
              },
              {
                message: t('Please choose disease areas!'),
                validator: (diseaseArea) => {
                  try {
                    diseaseAreaSchema.validateSync({ diseaseArea });
                    return true;
                  } catch {
                    return false;
                  }
                },
              },
            ]}
          />
        </StepStack>
        <StepStack direction="horizontal">
          <Input
            type="select"
            label="Ethnicity"
            placeholder="Please Select"
            value={ethnicity}
            onValue={(ethnicity) => setFormData({ ...formData, ethnicity })}
            disabled={user.status >= 4}
            errorCallback={handleErrors(8)}
            validators={[
              {
                message: t('Ethnicity is required'),
                validator: (ethnicity) => {
                  const v = ethnicity as object;
                  if (v) return true;
                  return false;
                },
              },
              {
                message: t('Please choose ethnicity!'),
                validator: (ethnicity) => {
                  try {
                    ethnicitySchema.validateSync({ ethnicity });
                    return true;
                  } catch {
                    return false;
                  }
                },
              },
            ]}
            options={ethnicities}
          />
          <Input
            type="select"
            label="Experience As"
            placeholder="Please Select"
            value={experienceAs}
            disabled={user.status >= 4}
            onValue={(experienceAs) =>
              setFormData({ ...formData, experienceAs })
            }
            options={filteredStakeholdres}
            errorCallback={handleErrors(9)}
            validators={[
              {
                message: t('Experience As is required'),
                validator: (experienceAs) => {
                  const v = experienceAs as object;
                  if (v) return true;
                  return false;
                },
              },
              {
                message: t('Please choose type of profile!'),
                validator: (experienceAs) => {
                  try {
                    experienceAsSchema.validateSync({ experienceAs });
                    return true;
                  } catch {
                    return false;
                  }
                },
              },
            ]}
          />
        </StepStack>
        <StepText>
          *These details allows us to match you with fitting projects based on
          the client-set criteria, boosting your opportunities and income.{' '}
          <br />
          Your profile and data will stay anonymised to others at all times,
          unless you explicitly consent to share it to a specific client during
          your campaign application (first name and username only).
        </StepText>
      </StepForm>
    </StepContainer>
  );
};

export default Step;
