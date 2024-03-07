import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Card } from 'components/ui';
import { gradient } from 'utilities/style';

export const CardWithProgressMain = styled(Card)<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing(2)};
    min-width: 0;
  `}
`;

export const CardWithProgressText = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 100%;
        display: flex;
        align-items: center;
        gap: ${theme.spacing(2)};
    `}
`;

export const CardWithProgressIcon = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: ${gradient(45, [
          theme.palette.primary.dark,
          theme.palette.secondary.light,
        ])};
        font-size: 2.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.palette.common.white};
        svg {
            display: block;
            width: 24px;
            height: 24px;
        }
    `}
`;

export const CardWithProgressTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        font-size: 16px;
        font-weight: 500;
        color: ${theme.palette.primary.main};
    `}
`;

export const CardWithProgressValues = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: 100%;
        height: 90px;
        padding-right: 10px;
        overflow-y: scroll;
        & > *:not(:last-child) {
          border-bottom: 1px solid ${theme.palette.common.black}20;
        }
    `}
`;
