import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const NoteMain = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items: flex-start;
    gap: ${theme.spacing(1)};
    color: ${theme.palette.common.gray[6]};
    svg {
      width: 24px;
      height: 24px;
      display: block;
    }
    `}
`;

export const NoteText = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    color: ${theme.palette.common.gray[6]};
    font-weight: 300;
    font-size: 14px;
    line-height: 24px;
    span, a {
      color: ${theme.palette.secondary.main};
      font-weight: 500;
    }
  `}
`;

export const HighlightText = styled.span`
  color: #448dc9;
`;
