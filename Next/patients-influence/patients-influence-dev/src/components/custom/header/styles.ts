import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import Link from 'next/link';

export const HeaderMain = styled.header<{ theme?: Theme }>`
  ${({ theme }) => `
        position: absolute;
        top: 0;
        width: 100%;
        height: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: 'Poppins', sans-serif;
        z-index: 10;

        ${theme.breakpoints.down('md')} {
          background: #fff;
          padding: 12px 18px !important;
        }
        ${theme.breakpoints.up('md')} {
          padding: 24px 2.5% 0;
        }
        ${theme.breakpoints.up('lg')} {
          padding: 24px 7.5% 0;
        }
        ${theme.breakpoints.up('xl')} {
          padding: 24px 12.5% 0;
        }
        `}
`;

export const HeaderLogo = styled.img<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
      width: 94px;
      height: 48px;
    }
    ${theme.breakpoints.up('sm')} {
      width: 140px;
      height: 72px;
    }
  `}
`;

export const HeaderActions = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
  display: flex;
  align-items: center;
  gap: 36px;
  width: auto;
  button {
    border-radius: 20rem;
    font-weight: 700;
    padding: 16px 24px;
  }

  ${theme.breakpoints.down('sm')} {
    button {
      font-size: 14px;
    }
  }
  ${theme.breakpoints.up('sm')} {
    button {
      font-size: 16px;
    }
  }
  `}
`;

export const HeaderAction = styled(Link)`
  text-decoration: none;
  button {
    padding: 0 !important;
    font-size: 18px;
  }
`;

export const HeaderLogoLink = styled.a`
  text-decoration: none;
`;
