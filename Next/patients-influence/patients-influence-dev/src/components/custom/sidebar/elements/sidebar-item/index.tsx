import React from 'react';
import {
  SidebarItemMain,
  SidebarItemOuter,
  SidebarItemIcon,
  SidebarItemLabel,
  SidebarDisabledItemOuter,
} from 'components/custom/sidebar/elements/sidebar-item/styles';
import { useRouter } from 'next/router';
import { Tooltip } from '@mui/material';
import { SidebarTooltipContainer } from './elements/sidebar-tooltip';

const SidebarItem = ({ icon, label, location, isDisabled, ...props }: any) => {
  const router = useRouter();

  const active = router.pathname === location;

  return isDisabled ? (
    <Tooltip
      placement="right"
      arrow
      componentsProps={{
        arrow: {
          style: {
            color: `#fff`,
          },
        },
      }}
      title={
        <SidebarTooltipContainer>
          <p>Please verify your account</p>
          <p>to visit these pages</p>
        </SidebarTooltipContainer>
      }
    >
      <SidebarDisabledItemOuter>
        <SidebarItemMain isDisabled={isDisabled} {...props}>
          <SidebarItemIcon isDisabled={isDisabled}>{icon}</SidebarItemIcon>
          <SidebarItemLabel isDisabled={isDisabled}>{label}</SidebarItemLabel>
        </SidebarItemMain>
      </SidebarDisabledItemOuter>
    </Tooltip>
  ) : (
    // TODO Chech why errors have pointed to isactive being all lovercase
    <SidebarItemOuter isactive={active ? 'true' : 'false'} href={location}>
      <SidebarItemMain {...props}>
        <SidebarItemIcon>{icon}</SidebarItemIcon>
        <SidebarItemLabel>{label}</SidebarItemLabel>
      </SidebarItemMain>
    </SidebarItemOuter>
  );
};

export default SidebarItem;
