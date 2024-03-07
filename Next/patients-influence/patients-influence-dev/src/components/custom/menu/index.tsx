import React, { forwardRef } from 'react';

import {
  MenuMain,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
} from 'components/custom/menu/styles';
import { TMenuProps, TMenuRef } from 'components/custom/menu/types';
import { createPortal } from 'react-dom';

const Menu = forwardRef<TMenuRef, TMenuProps>(({ items, ...props }, ref) =>
  typeof window !== 'undefined' ? (
    createPortal(
      <MenuMain ref={ref} {...props}>
        {items.map((x) => (
          <MenuItem key={x.label} onClick={x.action}>
            <MenuItemIcon> {x.icon}</MenuItemIcon>
            <MenuItemLabel>{x.label}</MenuItemLabel>
          </MenuItem>
        ))}
      </MenuMain>,
      document.querySelector('#portal') as Element
    )
  ) : (
    <div ref={ref} />
  )
);

export default Menu;
