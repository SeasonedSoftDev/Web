import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Card } from 'components/ui';

export const CardMain = styled(Card)<{ theme?: Theme }>`
  ${({ theme }) => `
        position: relative;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: ${theme.spacing(20)};

        ${theme.breakpoints.down('xl')} {
          grid-template-columns: 1fr;
        }

        @media screen and (min-width: 967px) and (max-width: 1199px) {
          grid-template-columns: repeat(2, 1fr);
        }
    `}
`;

export const CardHead = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    width: fit-content;
    flex-direction: column;
    width: 100%;
    gap: 1.25rem;

    
    
    ${theme.breakpoints.down('md')} {
      width: 82vw;
    }

    ${theme.breakpoints.down('sm')} {
      display: grid;
      grid-template-columns: 1fr;
      gap: ${theme.spacing(5)};
    }
  `}
`;

export const CardText = styled.div`
  margin-right: auto;
`;

export const CardTitle = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
      font-size: 20px;
      color: ${theme.palette.primary.main};
      font-weight: 500;
  `}
`;

export const CardDescription = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    font-size: 13px;
    color: ${theme.palette.common.gray[4]};
    font-weight: 300;
`}
`;

export const CardActions = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    display: flex;
    align-items: center;
    position: absolute;
    right: 1.25rem;
    gap: ${theme.spacing(4)};

    ${theme.breakpoints.down('sm')} {
      display: grid;
      gap: ${theme.spacing(4)};
    }
`}
`;

export const CardBody = styled.div<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;

    ${theme.breakpoints.down('sm')} {
      width: 80vw;
    }
  `}
`;
