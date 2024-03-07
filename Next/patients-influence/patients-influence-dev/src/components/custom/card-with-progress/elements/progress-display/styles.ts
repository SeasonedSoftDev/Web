import styled from '@emotion/styled';
import { Progress } from 'components/ui';
import { Theme } from '@mui/material';
import { gradient } from 'utilities/style';

export const ProgressDisplayMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
        padding: ${theme.spacing(1)} 0;
    `}
`;

export const ProgressDisplayIcon = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 20px;
    min-width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-size: 9px;
    font-weight: 500;
    color: ${theme.palette.common.white};
    background: ${gradient(45, [
      theme.palette.primary.dark,
      theme.palette.secondary.light,
    ])};
  `}
`;

export const ProgressDisplayPercent = styled(Progress)`
  width: 100%;
`;

export const ProgressDisplayPercentNumber = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 40px;
    min-width: 40px;
    text-align: right;
    font-size: 14px;
    font-weight: 500;
    color: ${theme.palette.common.gray[8]};
  `}
`;
