import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { AdminReportsPage, ClientReportsPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Reports = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Reports');
  }, []);

  return (
    <>
      <Title>Reports</Title>
      {role === 'ADMIN' && <AdminReportsPage />}
      {role === 'SUPERADMIN' && <AdminReportsPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['reports', 'common'])),
    },
  };
}

export default Reports;
