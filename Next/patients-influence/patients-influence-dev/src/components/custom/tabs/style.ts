import styled from '@emotion/styled';
import { Tab, Tabs, Theme } from '@mui/material';

export const TabsMain = styled(Tabs)<{ theme?: Theme }>`
  // width: fit-content;
  overflow: hidden;
  width: 100%;
`;

export const TabsTab = styled(Tab)`
  text-transform: none;
`;
