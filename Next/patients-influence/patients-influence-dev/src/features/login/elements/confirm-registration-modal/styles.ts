import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Grid, Stack } from 'components/system';
import Link from 'next/link';

export const SConfirmRegistrationModalMain = styled(Grid)<{ theme?: Theme }>`
  ${({ theme }) => `
  width: 100%;
  place-items: center;
  padding: 0 ${theme.spacing(10)} ${theme.spacing(10)};

  ${theme.breakpoints.down('md')} {
    padding: 0;
  }
  `}
`;

export const SConfirmRegistrationModalTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 48px;
    font-weight: 700;
    color: ${theme.palette.primary.main};
    margin-bottom: ${theme.spacing(2.5)};
    text-align: center;

    ${theme.breakpoints.down('sm')} {
      text-align: center;
      line-height: 120%;
    }
    ${theme.breakpoints.down('md')} {
      font-size: 32px;
    }
    `}
`;

export const SConfirmRegistrationModalText = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 20px;
    text-align: center;
    color: ${theme.palette.common.gray[6]};
    margin-bottom: ${theme.spacing(10)};
    line-height: 30px;

    ${theme.breakpoints.down('md')} {
      font-size: 16px;
      margin-bottom: 0;
    }
  `}
`;

export const SConfirmRegistrationModalActions = styled(Stack)<{
  theme?: Theme;
}>`
  ${({ theme }) => `
  display: flex;
  justify-content: center;
  button {
    padding: ${theme.spacing(5)} ${theme.spacing(16)};
    text-transform: uppercase;
    font-weight: 700;
    font-size: 20px;
  }

  ${theme.breakpoints.down('sm')} {
    flex-direction: column;
    button {
      width: 100%;
    }
  }
  
  ${theme.breakpoints.down('md')} {
    button {
      font-size: 16px;
      padding: ${theme.spacing(5)} ${theme.spacing(12)};
    }
  }

  `}
`;

export const SConfirmRegistrationModalAction = styled(Link)`
  text-decoration: none;
`;

export const SConfirmRegistrationModalLink = styled.span<{ theme?: Theme }>`
  ${({ theme }) => `
  color: ${theme.palette.secondary.main};
  cursor: pointer;
  margin-left: 5px;
  `}
`;
