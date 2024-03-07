import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { SMLReportPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const SMLReports = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('SML Reports');
  }, []);

  return (
    <>
      <Title>SML Reports</Title>
      {role === 'ADMIN' && <SMLReportPage />}
      {role === 'SUPERADMIN' && <SMLReportPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['sml-reports', 'common'])),
    },
  };
}

export default SMLReports;
