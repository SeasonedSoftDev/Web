import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const LabelMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    color: ${theme.palette.common.gray[8]};
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
  `}
`;

export const LabelHelper = styled.div`
  width: 16px;
  height: 16px;
  cursor: pointer;
  svg {
    width: 100%;
    height: 100%;
  }
`;

export const LabelRequired = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    color: ${theme.palette.warning.main};
  `}
`;
