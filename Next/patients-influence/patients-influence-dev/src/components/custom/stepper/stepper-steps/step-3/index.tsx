/* eslint-disable consistent-return */
import React, { FC } from 'react';
import {
  StepContainer,
  StepForm,
  StepStack,
} from 'components/custom/stepper/stepper-steps/step-3/style';
import { Input } from 'components/ui';
import { firstNameSchema, instagramUsernameSchema } from 'utilities/validators';
import { useTranslation } from 'react-i18next';
import { useAppContext } from 'context';
import { FormData } from '../..';

type Step3FormProps = {
  formData: FormData;
  setFormData: any;
  handleErrors: (index: number) => (value: boolean) => void;
};

const Step: FC<Step3FormProps> = ({ formData, setFormData, handleErrors }) => {
  const { instagramUsername } = formData;
  const { user } = useAppContext();

  const { t } = useTranslation('register');

  return (
    <StepContainer>
      <StepForm>
        <StepStack direction="horizontal">
          <Input
            type="text"
            label="Instagram username"
            placeholder="john123"
            errorCallback={handleErrors(0)}
            value={instagramUsername}
            disabled={user.status >= 4}
            onValue={(value) =>
              setFormData({ ...formData, instagramUsername: value })
            }
            validators={[
              {
                message: t('Instagram username is required'),
                validator: (username) => {
                  const v = username as string;
                  if (v.trim()) return true;
                  return false;
                },
              },
              {
                message: t(
                  'Instagram username should be minimum 3 and maximum 30 characters long'
                ),
                validator: (username) => {
                  try {
                    instagramUsernameSchema.validateSync(username);
                    return true;
                  } catch {
                    return false;
                  }
                },
              },
            ]}
          />
        </StepStack>
      </StepForm>
    </StepContainer>
  );
};

export default Step;
