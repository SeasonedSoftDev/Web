import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { AdminFinancePage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Finance = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Finance');
  }, []);

  return (
    <>
      <Title>Finance</Title>
      {role === 'ADMIN' && <AdminFinancePage />}
      {role === 'SUPERADMIN' && <AdminFinancePage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['finance', 'common'])),
    },
  };
}

export default Finance;
