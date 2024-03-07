import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';

export const ManageSMLMain = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
    
    `}
`;

export const ManageSMLPageFilter = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
      border-radius: 4px;
      border: 1px solid ${theme.palette.common.black}20;
      padding: ${theme.spacing(5)};
  `}
`;

export const ManageSMLFilterActions = styled(Stack)<{
  theme?: Theme;
}>`
  ${({ theme }) => `
        justify-content: flex-end;
        & > * {
          min-width: 100px;
        }
  
        ${theme.breakpoints.down('sm')} {
          display: grid;
          grid-template-columns: 1fr;
          gap: ${theme.spacing(5)};
        } 
    `}
`;
