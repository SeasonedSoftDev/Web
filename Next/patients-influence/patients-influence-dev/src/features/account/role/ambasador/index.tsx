import React, { useEffect, useState, useRef } from 'react';

import {
  AccountMain,
  AccountSpan,
  AccountChange,
  AccountContainer,
  AccountForm,
  AccountStack,
} from 'features/account/style';
import { Stack } from 'components/system';
import { Input } from 'components/ui';
import {
  ChangeAmbassadorInfoModal,
  ChangeEmailModal,
  ChangePasswordModal,
} from 'features/account/role/ambasador/elements';
import { useModal, useSnackbar } from 'hooks';
import { CopyIcon } from 'components/svg';
import { AmbassadorAPI, AuthorizationAPI, CompanyAPI } from 'api';
import { useAppContext } from 'context';
import { ISingleAmbassadorResponse } from 'api/ambassador/types';
import { useRouter } from 'next/router';
import { ISelectFieldType, IUserAmbassador } from './types';

const AccountPage = ({ ...props }) => {
  const { user, logout }: { user: IUserAmbassador; logout: () => void } =
    useAppContext();

  const [filter, setFilter] = useState<any>({
    firstname: user.firstName,
    lastName: user.lastName,
    company: '',
    role: '',
    email: user.email,
    password: '************',
    link: '',
    invitedClient: null,
  });

  const [companyRole, setCompanyRole] = useState<any>({
    company: {
      value: undefined,
      label: '',
      name: '',
    },
    role: null,
  });

  const [invitedClients, setInvitedClients] = useState<ISelectFieldType[]>([]);

  const [ceModal, openCeModal, closeCeModal] = useModal(false);
  const [aiModal, openAiModal, closeAiModal] = useModal(false);

  const [cpModal, openCpModal, closeCpModal] = useModal(false);

  const { push } = useSnackbar();

  const router = useRouter();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(filter.link);
      push(`Successfully copied!`, {
        variant: 'success',
      });
    } catch {
      push('Something failed!', {
        variant: 'error',
      });
    }
  };

  const getAffiliateLink = async () => {
    const { affiliateLink } = await AuthorizationAPI.getAffiliateLink(user.id);
    return affiliateLink;
  };

  const getAmbassador = async () => {
    const data = await AmbassadorAPI.getSingleAmbassador(user.id);

    return data;
  };

  const resetPassword = async () => {
    try {
      await AuthorizationAPI.resetPassword(filter.email, 'en').then(() => {
        logout();
        router.push('/login');
      });
      push('Email for password reset has been sent.', { variant: 'success' });
    } catch {
      push('Email for password reset has not been sent.', { variant: 'error' });
    }
  };

  useEffect(() => {
    Promise.allSettled([getAffiliateLink(), getAmbassador()]).then(
      (results) => {
        let affiliateLink: string | null = null;
        let ambassadorUser: ISingleAmbassadorResponse | null = null;
        let invitedClientsList: ISelectFieldType[] = [];

        const [affiliateLinkResult, ambassadorResult] = results;

        if (affiliateLinkResult.status === 'fulfilled') {
          affiliateLink = affiliateLinkResult.value;
        }

        if (ambassadorResult.status === 'fulfilled') {
          ambassadorUser = ambassadorResult.value;
          invitedClientsList = ambassadorResult.value.ambassador.clients.map(
            (client) => {
              const { id } = client;
              const { firstName, lastName } = client.user;

              return { value: id, label: `${firstName} ${lastName}` };
            }
          );
          setInvitedClients(invitedClientsList);
        }

        setFilter((prevState: any) => ({
          ...prevState,
          link: affiliateLink || '',
          company: ambassadorUser?.ambassador.company.name || '',
          role: ambassadorUser?.ambassador.companyTitle.name || '',
          list: invitedClientsList,
        }));

        let company = null;
        let role = null;
        if (ambassadorUser?.ambassador.company) {
          company = {
            value: ambassadorUser?.ambassador.company.id,
            label: ambassadorUser?.ambassador.company.name,
          };
        }

        if (ambassadorUser?.ambassador.companyTitle) {
          role = {
            value: ambassadorUser?.ambassador.companyTitle.id,
            label: ambassadorUser?.ambassador.companyTitle.name,
          };
        }

        if (company && role) {
          setCompanyRole({ company, role });
        }
      }
    );
  }, []);

  return (
    <AccountMain {...props}>
      <AccountContainer>
        <AccountForm>
          <Stack>
            <AccountStack direction="horizontal">
              <Input
                disabled
                type="text"
                label="First Name"
                placeholder="Please Enter"
                value={filter.firstname}
                onValue={(firstname) => setFilter({ ...filter, firstname })}
              />
              <Input
                disabled
                type="text"
                label="Last Name"
                placeholder="Please Enter"
                value={filter.lastName}
                onValue={(lastName) => setFilter({ ...filter, lastName })}
              />
            </AccountStack>
            <AccountStack direction="horizontal">
              <Input
                disabled
                type="text"
                label="Company"
                placeholder="Please Enter"
                value={filter.company}
                onValue={(company) => setFilter({ ...filter, company })}
              />
              <Input
                disabled
                type="text"
                label="Role"
                placeholder="Please Enter"
                value={filter.role}
                onValue={(role) => setFilter({ ...filter, role })}
              />
            </AccountStack>
            <AccountSpan onClick={openAiModal}>Change Info</AccountSpan>
            <AccountChange>
              <Input
                disabled
                type="text"
                label="Email"
                placeholder="Please Enter"
                value={filter.email}
                onValue={(email) => setFilter({ ...filter, email })}
              />
            </AccountChange>
            <AccountChange>
              <Input
                disabled
                type="text"
                label="Password"
                placeholder="Please Enter"
                value={filter.password}
                onValue={(password) => setFilter({ ...filter, password })}
              />
              <AccountSpan onClick={resetPassword}>Change Password</AccountSpan>
            </AccountChange>
            <Input
              disabled
              endAdornment={<CopyIcon onClick={handleCopyToClipboard} />}
              type="text"
              label="Invite Link"
              placeholder="asdsadksa;dlsa"
              value={filter.link}
              onValue={(link) => setFilter({ ...filter, link })}
            />
            <Input
              disabled={!invitedClients.length}
              type="select"
              label="Invited List"
              placeholder="Please Select"
              value={filter.invitedClient}
              onValue={(invitedClient) =>
                setFilter({ ...filter, invitedClient })
              }
              options={invitedClients}
            />
          </Stack>
        </AccountForm>
      </AccountContainer>
      {ceModal && <ChangeEmailModal onClose={closeCeModal} />}
      {cpModal && <ChangePasswordModal onClose={closeCpModal} />}
      {aiModal && (
        <ChangeAmbassadorInfoModal
          data={companyRole}
          setParentFilter={setFilter}
          setCompanyRole={setCompanyRole}
          onClose={() => {
            getAmbassador();
            closeAiModal();
          }}
        />
      )}
    </AccountMain>
  );
};

export default AccountPage;
