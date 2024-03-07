import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { LocalizationSelect } from 'components/custom';
import { Stack } from 'components/system';
import { Checkbox, Input } from 'components/ui';

export const RegisterTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 48px;
    font-weight: 700;
    color: ${theme.palette.primary.main};
    font-family: 'Poppins', sans-serif;
  `}
`;
export const RegisterSubtitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 20px;
    color: ${theme.palette.primary.main};
    opacity: 0.72;
    margin-top: -18px;
    margin-bottom: 18px;
    font-family: 'Poppins', sans-serif;
  `}
`;

export const RegisterInfluencerMain = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `

  ${theme.breakpoints.down('sm')} {
    .css-9v3k90-StackMain {
      flex-direction: column;
    }
    .css-1xqz3x8-InputMain {
      width: 100%;
    }
  }
  `}
`;
export const RegisterCompanyMain = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `

  ${theme.breakpoints.down('sm')} {
    .css-9v3k90-StackMain {
      flex-direction: column;
    }
    .css-1xqz3x8-InputMain {
      width: 100%;
    }
  }
  `}
`;

export const RegisterCompanyTopStack = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
        flex-direction: column;
    }
  `}
`;
export const RegisterCompanyBottomStack = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
        flex-direction: column;
    }
  `}
`;
export const RegisterCompanyFName = styled(Input)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
        width: 100%;
    }
  `}
`;
export const RegisterCompanyLName = styled(Input)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
        width: 100%;
    }
`}
`;
export const RegisterCompanyCompany = styled(Input)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
        width: 100%;
    }
  `}
`;
export const RegisterCompanyRole = styled(Input)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
        width: 100%;
    }
  `}
`;

export const RegisterInfluencerStack = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
        flex-direction: column;
    }
  `}
`;
export const RegisterInfluencerFName = styled(Input)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
        width: 100%;
    }
  `}
`;
export const RegisterInfluencerLName = styled(Input)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
        width: 100%;
    }
`}
`;

export const RegisterLocalization = styled(LocalizationSelect)`
  margin: 0 auto;
`;

export const RegisterCheckbox = styled(Checkbox)<{ theme?: Theme }>`
  ${({ theme }) => `
      color: #6D728E;

      display: grid;
      grid-template-columns: 15px 1fr;
      padding: 0 ${theme.spacing(5)};
      font-size: 18px;

      a {
        color: #2D3779;
        text-decoration: none;
      }
    `}
`;
