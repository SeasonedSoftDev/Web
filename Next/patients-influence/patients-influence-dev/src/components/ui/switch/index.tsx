import React, { useRef } from 'react';
import {
  SwitchMain,
  SwitchLabel,
  SwitchDisplay,
  SwitchInput,
} from 'components/ui/switch/styles';
import { TSwitchProps } from 'components/ui/switch/types';

const Switch = ({
  color = 'primary',
  label,
  value,
  onValue,
  required,
  helper,
  ...props
}: TSwitchProps) => {
  const switchRef = useRef<null | HTMLInputElement>(null);

  const handleClick = () => {
    if (switchRef.current) {
      switchRef.current.click();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onValue) onValue(e.target.checked);
  };

  return (
    <SwitchMain {...props}>
      <SwitchInput
        hidden
        type="checkbox"
        checked={value}
        onChange={handleChange}
        ref={switchRef}
        color={color}
      />
      <SwitchDisplay color={color} onClick={handleClick} />
      {!!label && (
        <SwitchLabel onClick={handleClick} required={required} helper={helper}>
          {label}
        </SwitchLabel>
      )}
    </SwitchMain>
  );
};

export default Switch;
