import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const PageLayoutMain = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

export const PageLayoutContent = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    
    ${theme.breakpoints.down('md')} {
      display: grid;
      grid-template-columns: auto;
      grid-template-rows: 1fr auto;
      gap: 100px;
      align-items: center;
      justify-content: unset;
    }   
  `}
`;

export const PageLayoutLeft = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: grid;
    place-items: center flex-start;
    min-height: 100vh;
    width: 100%;
    
    ${theme.breakpoints.down('md')} {
      padding: 12px 18px !important;
      min-height: unset;
      height: 100%;
    }
    ${theme.breakpoints.up('md')} {
      padding: 150px 2.5% 150px;
    }
    ${theme.breakpoints.up('lg')} {
      padding: 150px 7.5% 150px;
    }
    ${theme.breakpoints.up('xl')} {
      padding: 150px 7.5% 150px 12.5%; 
    }
    `}
`;

export const PageLayoutRight = styled.img<{ theme?: Theme }>`
  ${({ theme }) => `
      width: min(45%, 900px);
      min-height: 100vh; 
      object-fit: cover;

      ${theme.breakpoints.down('md')} {
        width: 100%;
        height: 100%;
        order: -1;
        margin-top: 150px;
      }
    `}
`;
