import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { AdminDiscoverClientsPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const DiscoverClients = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Discover Clients');
  }, []);

  return (
    <>
      <Title>Discover Clients</Title>
      {role === 'ADMIN' && <AdminDiscoverClientsPage />}
      {role === 'SUPERADMIN' && <AdminDiscoverClientsPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['discover-clients', 'common'])),
    },
  };
}

export default DiscoverClients;
