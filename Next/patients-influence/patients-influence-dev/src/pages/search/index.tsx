import React, { useEffect } from 'react';
import { Title } from 'components/core';
import { useAppContext } from 'context';
import { SearchPage } from 'features';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Search = () => {
  const { setRouteName } = useAppContext();

  useEffect(() => {
    setRouteName('Search Results');
  }, []);

  return (
    <>
      <Title>Search Results</Title>
      <SearchPage />
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['search', 'common'])),
    },
  };
}

export default Search;
