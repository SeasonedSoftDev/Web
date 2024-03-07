import dynamic from 'next/dynamic';
import React from 'react';

const NoSsr = dynamic(
  // eslint-disable-next-line react/jsx-no-useless-fragment
  () => Promise.resolve(({ children }: any) => <>{children}</>),
  {
    ssr: false,
  }
);

export default NoSsr;
