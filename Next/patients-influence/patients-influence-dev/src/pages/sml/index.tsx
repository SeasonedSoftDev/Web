import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { AdminSmlPage, ClientSmlPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const SML = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('SML');
  }, []);

  return (
    <>
      <Title>SML</Title>
      {role === 'ADMIN' && <AdminSmlPage />}
      {role === 'SUPERADMIN' && <AdminSmlPage />}
      {role === 'CLIENT' && <ClientSmlPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['sml', 'common'])),
    },
  };
}

export default SML;
