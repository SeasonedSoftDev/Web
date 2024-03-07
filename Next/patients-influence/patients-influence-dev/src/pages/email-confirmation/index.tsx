import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { EmailConfirmationPage } from 'features';
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const EmailConfirmation = () => {
  const { setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Email Confirmation');
  }, []);

  return (
    <>
      <Title>Email Confirmation</Title>
      <EmailConfirmationPage />
    </>
  );
};

// export async function getStaticProps({ locale }: { locale: string }) {
//   return {
//     props: {
//       ...(await serverSideTranslations(locale, ['reset-password', 'common'])),
//     },
//   };
// }

export default EmailConfirmation;
