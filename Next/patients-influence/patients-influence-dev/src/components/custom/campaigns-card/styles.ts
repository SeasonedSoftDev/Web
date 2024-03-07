import styled from '@emotion/styled';
import { Theme } from '@mui/material';

export const CampaignsCardMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CampaignsCardInfo = styled.div`
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;
export const CampaignsCardCompany = styled.div<{ theme?: Theme }>`
  font-size: 12px;
  color: #464e5f;
`;
export const CampaignsCardApp = styled.div<{ theme?: Theme }>`
  font-size: 11px;
  color: #a7a9b6;
`;
