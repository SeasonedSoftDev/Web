/* eslint-disable no-shadow */
import { Input } from 'components/ui';
import { useModal, useSnackbar } from 'hooks';
import React, { useEffect, useState } from 'react';

import {
  StepChange,
  StepSpan,
  StepContainer,
  StepForm,
  StepStack,
} from 'components/custom/stepper/stepper-steps/step-1/style';

import { useTranslation } from 'react-i18next';

import {
  ChangeEmailModal,
  ChangePasswordModal,
} from 'components/custom/stepper/elements';
import { CopyIcon } from 'components/svg';
import { useAppContext } from 'context';
import { AuthorizationAPI, InfluencerAPI } from 'api';
import {
  emailSchema,
  firstNameSchema, // potential gazenje
  lastNameSchema,
  passwordSchema,
} from 'utilities/validators';
import { TSelectFieldType } from 'features/discover-influencers/role/admin/elements/influencer-profile/types';
import { useRouter } from 'next/router';
import { FormData } from '../..';

type Step1FormProps = {
  formData: FormData;
  setFormData: any;
  handleErrors: (index: number) => (value: boolean) => void;
};

const Step = ({ formData, setFormData, handleErrors }: Step1FormProps) => {
  const { user, influencer, logout } = useAppContext();

  const { t } = useTranslation('register');

  // const [errors, setErrors] = useState([
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  //   false,
  // ]);

  // const handleErrors = (index: number) => (value: boolean) => {
  //   setErrors((x) => x.map((a, b) => (b === index ? value : a)));
  // };

  const {
    firstName,
    lastName,
    email,
    invitedBy,
    affiliateFriends,
    affiliateLink,
  } = formData;

  const [ceModal, openCeModal, closeCeModal] = useModal(false);
  const [cpModal, openCpModal, closeCpModal] = useModal(false);
  const [affiliateFriendsList, setAffiliateFriendsList] = useState<
    TSelectFieldType[]
  >([]);

  const { push } = useSnackbar();

  const router = useRouter();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      push(`Successfully copied!`, {
        variant: 'success',
      });
    } catch {
      push('Something failed!', {
        variant: 'error',
      });
    }
  };

  const getInfluencerData = async (influencerId: number) => {
    const influencer = await InfluencerAPI.getSingleInfluencer(influencerId);
    // handleInfluencer(influencer);
    return influencer;
  };

  const resetPassword = async () => {
    try {
      await AuthorizationAPI.resetPassword(user.email, 'en').then(() => {
        logout();
        router.push('/login');
      });
      push('Email for password reset has been sent.', { variant: 'success' });
    } catch {
      push('Email for password reset has not been sent.', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (influencer) {
      const affiliatedFriends = influencer.invitedInfluencers.map(
        (influencer: { user: any }) => {
          const { id, firstName, lastName } = influencer.user;

          const label = `${firstName} ${lastName}`;

          return { value: id, label };
        }
      );
      setAffiliateFriendsList(affiliatedFriends);
    }
  }, [influencer]);

  useEffect(() => {
    if (user.influencer.invitendByUserId) {
      getInfluencerData(user.influencer.invitendByUserId)
        .then((influencer) => {
          setFormData((prevState: any) => ({
            ...prevState,
            invitedBy: `${influencer.firstName} ${influencer.lastName}`,
          }));
        })
        .catch(() => push('Wrong influencer', { variant: 'error' }));
    }
  }, [user]);

  return (
    <StepContainer>
      <StepForm>
        <StepStack direction="horizontal">
          <Input
            type="text"
            label="First Name"
            placeholder="John"
            disabled
            errorCallback={handleErrors(0)}
            validators={[
              {
                message: t('First name is required'),
                validator: (firstName) => {
                  const v = firstName as string;
                  if (v.trim()) return true;
                  return false;
                },
              },
              {
                message: t('First name needs to be at least 2 characters long'),
                validator: (firstName) => {
                  try {
                    firstNameSchema.validateSync({ firstName });
                    return true;
                  } catch {
                    return false;
                  }
                },
              },
            ]}
            value={firstName}
            onValue={(firstname) => setFormData({ ...formData, firstname })}
            // onValue={(firstName) => updateFields(firstName, firstName)}
          />
          <Input
            type="text"
            label="Last Name"
            placeholder="Doe"
            disabled
            errorCallback={handleErrors(1)}
            validators={[
              {
                message: t('Last name is required'),
                validator: (lastName) => {
                  const v = lastName as string;
                  if (v.trim()) return true;
                  return false;
                },
              },
              {
                message: t('Last name needs to be at least 2 characters long'),
                validator: (lastName) => {
                  try {
                    lastNameSchema.validateSync({ lastName });
                    return true;
                  } catch {
                    return false;
                  }
                },
              },
            ]}
            value={lastName}
            // onValue={(lastName) => setState({ ...state, lastName })}
            onValue={(lastName) => setFormData({ ...formData, lastName })}
          />
        </StepStack>
        <StepChange>
          <Input
            type="text"
            label="Email"
            placeholder="johndoe@gmail.com"
            disabled
            errorCallback={handleErrors(3)}
            validators={[
              {
                message: t('Email is required'),
                validator: (email) => {
                  const v = email as string;
                  if (v.trim()) return true;
                  return false;
                },
              },
              {
                message: t('Not a valid email format'),
                validator: (email) => {
                  try {
                    emailSchema.validateSync({ email });
                    return true;
                  } catch {
                    return false;
                  }
                },
              },
            ]}
            value={email}
            // onValue={(email) => setState({ ...state, email })}
            onValue={(email) => setFormData({ ...formData, email })}
          />
        </StepChange>
        <StepChange>
          <Input
            type="password"
            label={t('Password') as string}
            disabled
            placeholder={t('***************') as string}
            value={formData.password}
            onValue={(password) => setFormData({ ...formData, password })}
            errorCallback={handleErrors(4)}
            validators={[
              {
                message: t('Password is required'),
                validator: (password) => {
                  const v = password as string;
                  if (v.trim()) return true;
                  return false;
                },
              },
              {
                message: t(
                  'Password must have at least one uppercase, lowercase letter, number and symbol'
                ),
                validator: (password) => {
                  try {
                    passwordSchema.validateSync({ password });
                    return true;
                  } catch {
                    return false;
                  }
                },
              },
            ]}
          />

          <StepSpan onClick={resetPassword}>Change Password</StepSpan>
        </StepChange>
        {invitedBy ? (
          <Input
            type="text"
            label="Invited by"
            disabled
            value={invitedBy}
            onValue={(invitedBy) => setFormData({ ...formData, invitedBy })}
          />
        ) : undefined}

        <Input
          type="select"
          label="Affiliate friends"
          placeholder="Affiliate friends"
          value={affiliateFriends}
          onValue={(affiliateFriends) =>
            setFormData({ ...formData, affiliateFriends })
          }
          options={affiliateFriendsList}
        />
        <Input
          type="text"
          label="Affiliate link"
          disabled
          value={affiliateLink}
          endAdornment={
            <CopyIcon
              style={{ cursor: 'pointer' }}
              onClick={handleCopyToClipboard}
            />
          }
          // onValue={(affiliateLink) => setState({ ...state, affiliateLink })}
          onValue={(affiliateLink) =>
            setFormData({ ...formData, affiliateLink })
          }
        />
      </StepForm>
      {ceModal && <ChangeEmailModal onClose={closeCeModal} />}
      {cpModal && <ChangePasswordModal onClose={closeCpModal} />}
    </StepContainer>
  );
};

export default Step;
