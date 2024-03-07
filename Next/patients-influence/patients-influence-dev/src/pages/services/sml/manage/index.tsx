import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { ManageSMLPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const SMLManage = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('SML Manage');
  }, []);

  return (
    <>
      <Title>SML Reports</Title>
      {role === 'ADMIN' && <ManageSMLPage />}
      {role === 'SUPERADMIN' && <ManageSMLPage />}
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

export default SMLManage;
