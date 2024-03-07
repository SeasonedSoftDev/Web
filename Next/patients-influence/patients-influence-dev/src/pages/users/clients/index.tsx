import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { AdminClientsPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Clients = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Clients');
  }, []);

  return (
    <>
      <Title>Clients</Title>
      {role === 'ADMIN' && <AdminClientsPage />}
      {role === 'SUPERADMIN' && <AdminClientsPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['users-clients', 'common'])),
    },
  };
}

export default Clients;
