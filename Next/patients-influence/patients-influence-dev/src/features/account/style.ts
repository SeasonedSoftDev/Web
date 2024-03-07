import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';
import { Card } from 'components/ui';

export const AccountMain = styled(Card)`
  height: 100%;
`;

export const AccountSpan = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    color: ${theme.palette.secondary.main};
    text-align: right;
    cursor: pointer;
    font-size: 12px;
    display: inline;
    width: 110px;
    margin-left: auto;
 `}
`;

export const ChangeInfo = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: ${theme.spacing(2)};
    align-items: flex-end;
  `}
`;

export const AccountChange = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
    gap: ${theme.spacing(2)};
    align-items: flex-end
  `}
`;

export const AccountContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  `}
`;

export const AccountForm = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: grid;
    grid-template-columns: 1fr;
    grid-column: 1/3;
    gap: ${theme.spacing(5)};

    ${theme.breakpoints.down('xl')} {
      grid-column: 1/4;
    }

    ${theme.breakpoints.down('lg')} {
      grid-column: 1/3;
    }

    ${theme.breakpoints.down('md')} {
      grid-column: 1/4;
    }

    ${theme.breakpoints.down('sm')} {
      grid-column: 1/5;
    }
  `}
`;

export const AccountStack = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
      display: grid !important;
      grid-template-columns: 1fr;
    }
  `}
`;
