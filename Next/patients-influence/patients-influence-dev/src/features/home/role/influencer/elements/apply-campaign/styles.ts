import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import { Checkbox } from 'components/ui';

export const ApproveInfluencerModalMain = styled.div`
  display: flex;
  width: 100%;
  display: flex;
  width: 100%;
  padding: 5px 0;
  height: 130px;
  position: relative;
`;

export const LegalBody = styled.p`
  color: #7E839F
  font-weight: 300;
  white-space: normal;
  overflow-wrap: break-word;
  // position: absolute;
  width: 406px;
  right: 0;
  top: 0;
}
`;

export const LegalCheckbox = styled(Checkbox)<{ theme?: Theme }>`
  ${({ theme }) => `
      color: #6D728E;
      margin-top: 5px;
      display: grid;
      grid-template-columns: 15px 1fr;
      padding: 0 ${theme.spacing(5)};
      font-size: 18px;
      align-items: start;

      a {
        color: #2D3779;
        text-decoration: none;
      }
    `}
`;
