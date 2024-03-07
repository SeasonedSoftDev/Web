import { useEffect, useRef, useState } from 'react';

const useMenu = (initialState: boolean): any => {
  const menuRef = useRef<any>(null);
  const buttonRef = useRef<any>(null);

  const [open, setOpen] = useState<boolean>(initialState);

  const [position, setPosition] = useState<{ right: number; top: number }>({
    right: 0,
    top: 0,
  });
  const openRef = useRef<boolean>(open);

  useEffect(() => {
    openRef.current = open;
    if (open && buttonRef.current && typeof window !== 'undefined') {
      const rect = buttonRef.current.getBoundingClientRect();

      setPosition({
        right: window.innerWidth - rect.right,
        top: rect.top + rect.height,
      });
    }

    const overflowHiddenElement = Array.from(
      document.getElementsByClassName(
        'overflow-y-hidden'
        // eslint-disable-next-line no-undef
      ) as HTMLCollectionOf<HTMLElement>
    );

    if (open) {
      overflowHiddenElement[0].style.overflowY = 'hidden';
      overflowHiddenElement[0].style.paddingRight = '10px';
    } else {
      overflowHiddenElement[0].style.overflowY = 'auto';
      overflowHiddenElement[0].style.paddingRight = '0';
    }
  }, [open]);

  // useEffect(() => {
  //   const overflowHiddenElement = Array.from(
  //     document.getElementsByClassName(
  //       'overflow-y-hidden'
  //       // eslint-disable-next-line no-undef
  //     ) as HTMLCollectionOf<HTMLElement>
  //   );

  //   if (open) {
  //     overflowHiddenElement[0].style.overflowY = 'hidden';
  //     overflowHiddenElement[0].style.paddingRight = '10px';
  //   } else {
  //     overflowHiddenElement[0].style.overflowY = 'auto';
  //     overflowHiddenElement[0].style.paddingRight = '0';
  //   }
  // }, [open]);

  useEffect(() => {
    const trackClick = (e: MouseEvent) => {
      if (!menuRef.current || !openRef.current) return;

      if (
        e.target !== menuRef.current &&
        !menuRef.current.contains(e.target) &&
        openRef.current
      ) {
        e.stopPropagation();
        setOpen(false);
      }
    };

    window.addEventListener('click', trackClick, true);

    return () => {
      window.removeEventListener('click', trackClick);
    };
  }, []);

  return [menuRef, open, setOpen, buttonRef, position];
};

export default useMenu;
