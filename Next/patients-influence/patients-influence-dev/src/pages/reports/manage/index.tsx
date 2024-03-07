import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { ManageReportPage, ManageClientReportPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const ManageReport = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Manage Report');
  }, []);

  return (
    <>
      <Title>Manage Report</Title>
      {role === 'ADMIN' && <ManageReportPage />}
      {role === 'SUPERADMIN' && <ManageReportPage />}
      {role === 'CLIENT' && <ManageClientReportPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['reports-finished', 'common'])),
    },
  };
}

export default ManageReport;
