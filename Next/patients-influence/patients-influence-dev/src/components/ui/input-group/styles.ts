import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Label, Input } from 'components/ui';

export const InputGroupMain = styled.div``;

export const InputGroupLabel = styled(Label)<{ theme?: Theme }>`
  ${({ theme }) => `
    margin-bottom: ${theme.spacing(0.5)};
  `}
`;

export const InputGroupElements = styled.div<{
  inputRatio: string;
  theme?: Theme;
}>`
  ${({ inputRatio, theme }) => `
        display: grid;
        grid-template-columns: ${inputRatio};

        ${theme.breakpoints.down('sm')} {
          display: grid;
          grid-template-columns: 1fr !important;
          gap: ${theme.spacing(2)};
        }
    `}
`;

export const InputGroupElement = styled(Input)`
  &:first-of-type fieldset {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  &:last-of-type fieldset {
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  &:not(:first-of-type):not(:last-of-type) fieldset {
    border-radius: 0px;
  }
`;
