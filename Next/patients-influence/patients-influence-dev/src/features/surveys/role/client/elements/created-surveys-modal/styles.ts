import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Grid } from 'components/system';

export const CreateSurveysModalMain = styled(Grid)<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;

    ${theme.breakpoints.down('xl')} {
      grid-template-columns: 1fr 1fr;
    }

    ${theme.breakpoints.down('sm')} {
      display: flex;
      flex-direction: column;
    }
  `}
`;

export const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ImageUploadMainContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 25px;
`;
