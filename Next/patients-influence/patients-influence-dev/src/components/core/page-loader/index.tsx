import React from 'react';
import nProgress from 'nprogress';
import Router from 'next/router';
import { GlobalStyles } from '@mui/material';

nProgress.configure({ showSpinner: false });

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

const PageLoader = () => (
  <GlobalStyles
    styles={(theme: any) => `
      #nprogress {
        pointer-events: none;
        .bar {
          background-color: ${theme.palette.common.white};
          position: fixed;
          z-index: ${theme.zIndex.pageLoader};
          top: 0px;
          left: 0px;
          width: 100%;
          height: 3px;
        }
        .peg {
          display: block;
          position: absolute;
          right: 0px;
          width: 100px;
          height: 100%;
          opacity: 1.0;
        }
      }
    `}
  />
);

export default PageLoader;
