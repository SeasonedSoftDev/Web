import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { GridCell, Stack } from 'components/system';
import { Card } from 'components/ui';

export const HelpPageMain = styled(Card)``;

export const ChartWrapper = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
        width: clamp(400px, 26vw,470px);
        height: 300px;
        margin: 30px 0px 15px;

        ${theme.breakpoints.down('xl')} {
            width: 400px;
            max-width: 400px;
        }

        ${theme.breakpoints.down('lg')} {
          width: 380px;
      }

        ${theme.breakpoints.down('md')} {
            width: 380px;
        }

        ${theme.breakpoints.down('sm')} {
            max-width: 400px;
            width: 80vw;
        }

        // ${theme.breakpoints.down('xs')} {
        //     width: 280px;
        // }
    `}
`;

export const CustomStack = styled(Stack)<{ theme?: Theme }>`
  ${({ theme }) => `
        max-width: 500px;
        align-self: flex-start;
        min-height: 525px;

        @media screen and (min-width: 1200px ) and  (max-width: 1760px) {
          max-width: 400px;
        }
        
        ${theme.breakpoints.down('xl')} {
          max-width: 380px;
          width: 82vw;
        }

        ${theme.breakpoints.down('sm')} {
          max-width: 380px;
          width: 75vw;
        }

    `}
`;

export const GridCellCustom = styled(GridCell)<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items: flex-end;
    // margin-bottom: 25px;
    justify-content: space-between;



    ${theme.breakpoints.down('xs')} {
        flex-direction: column;
        align-items: center;
        gap: 25px;
        width: 280px;
    }
    `}
`;
