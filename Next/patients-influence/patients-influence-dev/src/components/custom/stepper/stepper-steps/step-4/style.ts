import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Stack } from 'components/system';

export const StepContainer = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: grid;
    grid-template-columns: repeat(8, 1fr);

    ${theme.breakpoints.down('xl')} {
      grid-template-rows: auto auto;
      gap: ${theme.spacing(5)};
    }

    ${theme.breakpoints.down('sm')} {
      grid-template-columns: 1fr;
      grid-template-rows: unset;
    }
  `}
`;

export const StepStack = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
    ${theme.breakpoints.down('sm')} {
      display: grid !important;
      grid-template-columns: 1fr;
    }
  `}
`;

export const StepTop = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      grid-column: 1/3;

      ${theme.breakpoints.down('xl')} {
        grid-column: 1/5;
      }

      ${theme.breakpoints.down('sm')} {
        grid-column: 1/9;
      }
    `}
`;
export const StepLeft = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      grid-column: 1/3;
      padding-right: ${theme.spacing(5)};

      ${theme.breakpoints.down('xl')} {
        grid-column: 1/9;
        grid-row: 1/2;
        padding-right: 0;
      }

      ${theme.breakpoints.down('sm')} {
        grid-column: 1/9;
        grid-row: unset;
      }
    `}
`;
export const StepFMiddle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      grid-column: 3/5;
      padding-right: ${theme.spacing(5)};
      padding-left: ${theme.spacing(5)};
      border-left: 1px solid ${theme.palette.default.main};
      border-right: 1px solid ${theme.palette.default.main};

      ${theme.breakpoints.down('xl')} {
        grid-column: 5/9;
        grid-row: 1/2;
        padding-right: 0;
        padding-left: 0;
        border: unset;
      }

      ${theme.breakpoints.down('sm')} {
        grid-column: 1/9;
        grid-row: unset;
      }
    `}
`;
export const StepSMiddle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      grid-column: 3/6;
      padding-right: ${theme.spacing(5)};
      padding-left: ${theme.spacing(5)};
      border-left: 1px solid ${theme.palette.default.main};
      border-right: 1px solid ${theme.palette.default.main};

      ${theme.breakpoints.down('xl')} {
        grid-column: 1/5;
        grid-row: 2/3;
        padding-right: 0;
        padding-left: 0;
        border: unset;
      }

      ${theme.breakpoints.down('sm')} {
        grid-column: 1/9;
        grid-row: unset;
      }
    `}
`;
export const StepRight = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      grid-column: 3/5;
      // padding-left: ${theme.spacing(5)};

      ${theme.breakpoints.down('xl')} {
        grid-column: 1/9;
        grid-row: 2/3;
        padding-left: 0;
      }

      ${theme.breakpoints.down('sm')} {
        grid-column: 1/9;
        grid-row: unset;
      }
    `}
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ConversionAmountWrapper = styled.div`
  display: flex;
  font-family: IBM Plex Sans;
  color: #7e839f;
  font-size: 11px;
`;

export const ConversionIconWrapper = styled.span`
  display: inline-block;
  width: 13px;
  height: 13px;
  align-content: center;
  justify-content: center;
  padding-top: 2px;
`;

export const LabelTooltip = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        background: ${theme.palette.common.white};
        color: #4f4f4f;
        padding: ${theme.spacing(4)} ${theme.spacing(4)};
        font-size: 16px;
        margin: -10px;
        box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.45);
        border-radius: 8px;
        letter-spacing: 1px;
        white-space: normal; /* Allow wrapping */
        max-width: 500px;

        span {
          text-decoration: underline;
          color: #4f4f4f;
        }
    `}
`;

export const TooltipTitle = styled.p<{ theme?: Theme }>`
  ${({ theme }) => `
      font-family: 'inter';
      font-weight: 600;
      color: #7E839F;
      font-size: 12px;
      line-height: 13px;
      margin-bottom: 10px;
  `}
`;

export const TooltipParagraph = styled.p<{ theme?: Theme }>`
  ${({ theme }) => `
      font-family: 'inter';
      font-weight: 500;
      color: #7E839F;
      font-size: 12px;
      line-height: 13px;
      margin-bottom: 10px;
  `}
`;
