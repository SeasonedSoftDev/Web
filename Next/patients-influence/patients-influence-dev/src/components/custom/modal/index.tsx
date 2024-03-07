import React, { useRef } from 'react';
import {
  ModalActions,
  ModalBody,
  ModalHead,
  ModalMain,
  ModalWrapper,
  ModalTitle,
  ModalClose,
} from 'components/custom/modal/styles';
import { TModalProps } from 'components/custom/modal/types';
import { CancelIcon } from 'components/svg';

const Modal = ({
  title,
  onClose,
  size = 'small',
  children,
  actions = [],
  ...props
}: TModalProps) => {
  const wrapperRef = useRef<null | HTMLDivElement>(null);

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === wrapperRef.current && onClose) {
      onClose();
    }
  };

  return (
    <ModalWrapper ref={wrapperRef} onMouseDown={handleClose} {...props}>
      <ModalMain size={size} animation="slide-right">
        <ModalHead>
          <ModalTitle>{title}</ModalTitle>
          <ModalClose onClick={onClose}>
            <CancelIcon />
          </ModalClose>
        </ModalHead>
        <ModalBody>{children}</ModalBody>
        {!!actions.length && <ModalActions>{actions}</ModalActions>}
      </ModalMain>
    </ModalWrapper>
  );
};

export default Modal;
