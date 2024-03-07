import React, { forwardRef } from 'react';

import {
  MenuMain,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
} from 'components/custom/menu-no-portal/styles';
import { TMenuProps, TMenuRef } from 'components/custom/menu-no-portal/types';

const MenuNoPortal = forwardRef<TMenuRef, TMenuProps>(
  ({ items, ...props }, ref) =>
    typeof window !== 'undefined' ? (
      <MenuMain ref={ref} {...props}>
        {items.map((x) => (
          <MenuItem key={x.label} onClick={x.action}>
            <MenuItemIcon> {x.icon}</MenuItemIcon>
            <MenuItemLabel>{x.label}</MenuItemLabel>
          </MenuItem>
        ))}
      </MenuMain>
    ) : (
      <div ref={ref} />
    )
);

export default MenuNoPortal;
