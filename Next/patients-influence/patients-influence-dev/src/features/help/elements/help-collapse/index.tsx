import React, { useState } from 'react';

import { Collapse, Stack } from 'components/system';

import {
  HelpCollapseMain,
  HelpCollapseHeader,
  HelpCollapseText,
} from 'features/help/elements/help-collapse/style';

import { THelpCollapseProps } from 'features/help/elements/help-collapse/types';

const HelpCollapse = ({ title, icon, text, ...props }: THelpCollapseProps) => {
  const [help, setHelp] = useState(false);

  const openHelp = () => {
    setHelp(!help);
  };

  return (
    <HelpCollapseMain {...props}>
      <Stack style={{ gap: '0px' }}>
        <HelpCollapseHeader onClick={openHelp}>
          <h2>{title}</h2>
          {icon}
        </HelpCollapseHeader>
        <Collapse
          style={
            window.innerWidth < 600
              ? { paddingRight: '0' }
              : { paddingRight: '150px' }
          }
          in={help}
        >
          {text.map((txt, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <HelpCollapseText key={index}>{txt}</HelpCollapseText>
          ))}
        </Collapse>
      </Stack>
    </HelpCollapseMain>
  );
};

export default HelpCollapse;
