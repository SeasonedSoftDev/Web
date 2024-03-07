import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { AmbassadorsPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Ambassadors = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Ambassadors');
  }, []);

  return (
    <>
      <Title> Ambassadors</Title>
      {role === 'ADMIN' && <AmbassadorsPage />}
      {role === 'SUPERADMIN' && <AmbassadorsPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'users-ambassadors',
        'common',
      ])),
    },
  };
}

export default Ambassadors;
