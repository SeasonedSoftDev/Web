import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Grid } from 'components/system';

export const AddCampaignsModalMain = styled(Grid)<{ theme?: Theme }>`
  ${({ theme }) => `
    width: 100%;
    padding-bottom: 20px;
      grid-template-columns: 1fr 1fr;


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

export const ImageUploadButton = styled.button`
  background: none !important;
  border: none;
  padding: 0 !important;
  text-decoration: underline;
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 20vw;
`;

export const ImageActions = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  align-items: center;
`;

export const ImageList = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  margin-top: 8px;
`;

export const ImageDeleteButton = styled.button`
  background: none !important;
  border: none;
  padding: 0 !important;
  cursor: pointer;
  text-align: left;
`;
