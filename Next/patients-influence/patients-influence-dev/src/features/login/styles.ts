import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { LocalizationSelect } from 'components/custom';
import { Stack } from 'components/system';

export const LoginMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-family: 'Poppins', sans-serif;
  `}
`;

export const LoginContainer = styled.div``;

export const LoginTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 48px;
    font-weight: 700;
    color: ${theme.palette.primary.main};
    font-family: 'Poppins', sans-serif;
    `}
`;

export const LoginSubtitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 20px;
    color: ${theme.palette.primary.main};
    opacity: 0.72;
    font-family: 'Poppins', sans-serif;
    margin-top: -18px;
    margin-bottom: 18px;
`}
`;

export const LoginSpan = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    color: ${theme.palette.primary.main};
    cursor: pointer;
`}
`;

export const LoginAction = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    justify-content: space-between;
    ${theme.breakpoints.down('sm')} {
      flex-direction: column;
    }
  `}
`;

export const LoginLocalization = styled(LocalizationSelect)`
  margin: 0 auto;
`;
