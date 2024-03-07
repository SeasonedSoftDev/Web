import { useState } from 'react';

type TModalHookReturn = [boolean, () => void, () => void];

const useModal = (initialState: boolean): TModalHookReturn => {
  const [open, setOpen] = useState<boolean>(initialState);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  return [open, handleOpen, handleClose];
};

export default useModal;
