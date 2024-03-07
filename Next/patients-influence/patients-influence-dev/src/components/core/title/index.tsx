import React from 'react';
import Head from 'next/head';
import Project from 'constants/project';
import { TitleType } from 'components/core/title/types';

const { prefix, sufix } = Project.title;

const Title = ({ children }: TitleType) => (
  <Head>
    <title>{[prefix, String(children), sufix].join('')}</title>
  </Head>
);

export default Title;
