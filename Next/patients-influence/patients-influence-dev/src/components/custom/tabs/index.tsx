import React from 'react';

import { TabsMain, TabsTab } from 'components/custom/tabs/style';

import { TTabsProps } from 'components/custom/tabs/types';

const Tabs = ({ value, onValue, tabs, ...props }: TTabsProps) => {
  const handleChange = (e: React.SyntheticEvent, newValue: number) => {
    if (onValue) {
      onValue(newValue);
    }
  };

  return (
    <TabsMain
      value={value}
      // @ts-ignore
      onChange={handleChange}
      textColor="secondary"
      indicatorColor="secondary"
      variant={window.innerWidth < 600 ? 'scrollable' : 'standard'}
      scrollButtons="auto"
      allowScrollButtonsMobile
      {...props}
    >
      {tabs.map((x, y) => (
        <TabsTab key={x} label={x} value={y} style={{ paddingBottom: '0px' }} />
      ))}
    </TabsMain>
  );
};

export default Tabs;
