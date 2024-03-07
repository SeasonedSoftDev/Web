import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Navigation, Sidebar } from 'components/custom';

export const DashboardLayoutMain = styled.div`
  width: 100%;
  height: 100vh;
`;

export const DashboardLayoutNavbar = styled(Navigation)`
  width: 100%;
  height: 80px;
`;

export const DashboardLayoutBox = styled.div`
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
`;

export const DashboardLayoutSidebar = styled(Sidebar)<{ theme?: Theme }>`
  ${({ theme }) => `
    min-width: 175px;
    width: 175px;
    height: 100%;

    ${theme.breakpoints.down('lg')} {
      transform: translateX(-100%);
      transition: transform 0.15s ease-in-out;
      position: fixed;
      height: 100vh;
      top: 0;
      left: 0;
      background: #fff;
      z-index: 9999;
    }
  `}
`;

export const DashboardLayoutContainerOuter = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;
    height: 100%;
    background-color: ${theme.palette.common.background};
    overflow-x: hidden;
    overflow-y: auto;
    `}
`;

export const DashboardLayoutContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;
    display: flex;
    padding: ${theme.spacing(5)};
    gap: ${theme.spacing(5)};
    `}
`;

export const DashboardLayoutContent = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
  width: calc(100% - 350px - ${theme.spacing(5)});
  ${theme.breakpoints.down('lg')} {
      width: 100%;
  }
  `}
`;

export const DashboardLayoutWidgets = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 350px;
    min-width: 350px;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(5)};
    ${theme.breakpoints.down('lg')} {
      display: none;
    }
  `}
`;
