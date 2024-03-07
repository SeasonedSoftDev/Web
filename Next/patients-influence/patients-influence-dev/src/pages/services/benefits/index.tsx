import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { AdminBenefitsPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Benefits = () => {
  const { role, setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Benefits');
  }, []);

  return (
    <>
      <Title>Benefits</Title>
      {role === 'ADMIN' && <AdminBenefitsPage />}
      {role === 'SUPERADMIN' && <AdminBenefitsPage />}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['benefits', 'common'])),
    },
  };
}

export default Benefits;
