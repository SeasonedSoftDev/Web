import React from 'react';

import {
  HeaderMain,
  HeaderLogo,
  HeaderActions,
  HeaderAction,
  HeaderLogoLink,
} from 'components/custom/header/styles';

import { SignUpModal } from 'components/custom/header/elements';

import { Button } from 'components/ui';
import { useModal } from 'hooks';
import { useTranslation } from 'react-i18next';

const Header = ({ ...props }) => {
  const [spModal, openSpModal, closeSpModal] = useModal(false);

  const { t } = useTranslation('common');

  return (
    <>
      <HeaderMain {...props}>
        <HeaderLogoLink href="https://patientsinfluence.com">
          <HeaderLogo src="/static/assets/images/PatientsInfluence.svg" />
        </HeaderLogoLink>
        <HeaderActions>
          <HeaderAction href="/login">
            <Button variant="text" size="large">
              {t('Login')}
            </Button>
          </HeaderAction>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={openSpModal}
          >
            {t('SIGN UP')}
          </Button>
        </HeaderActions>
      </HeaderMain>
      {spModal && <SignUpModal onClose={closeSpModal} />}
    </>
  );
};

export default Header;
