import React from 'react';
import { LoadingPageMain } from 'features/loading/styles';
import { Loader } from 'components/custom';

const LoadingPage = () => (
  <LoadingPageMain>
    <Loader />
  </LoadingPageMain>
);

export default LoadingPage;
