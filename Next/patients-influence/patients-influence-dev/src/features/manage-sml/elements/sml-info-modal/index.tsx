import React, { useState } from 'react';
import { Modal } from 'components/custom';
import { TSmlInfoModalProps } from 'features/manage-sml/elements/sml-info-modal/types';
import {
  SmlInfoModalMain,
  SMLInfoHeader,
  SMLInfoHeaderSpan,
  SMLInfoBody,
  SMLInfoContainer,
} from 'features/manage-sml/elements/sml-info-modal/styles';
import { Button } from 'components/ui';

const SmlInfo = ({ onClose, info, ...props }: TSmlInfoModalProps) => {
  let item;
  if (info) {
    item = info.map((el: any, index: number) => (
      // eslint-disable-next-line react/no-array-index-key
      <SMLInfoContainer key={index}>
        <SMLInfoHeaderSpan>el.frequency</SMLInfoHeaderSpan>
        <SMLInfoHeaderSpan>el.word</SMLInfoHeaderSpan>
      </SMLInfoContainer>
    ));
  }

  return (
    <Modal
      size="medium"
      title="SML Info"
      actions={[
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Close
        </Button>,
      ]}
      onClose={onClose}
      {...props}
    >
      <SmlInfoModalMain columns={1}>
        <SMLInfoHeader>
          <SMLInfoHeaderSpan>Frequency</SMLInfoHeaderSpan>
          <SMLInfoHeaderSpan>Word</SMLInfoHeaderSpan>
        </SMLInfoHeader>
        <SMLInfoBody>{/* {item} */}</SMLInfoBody>
      </SmlInfoModalMain>
    </Modal>
  );
};

export default SmlInfo;
