import React from 'react';
import { StatusField, StatusLabel, StatusLink, StatusWrapper } from './styles';

interface ILinkInputProps {
  link: string;
  disabled?: boolean;
  label: string;
  fieldText: string;
}

const LinkInput = ({
  link,
  label,
  disabled = false,
  fieldText,
}: ILinkInputProps) =>
  disabled ? (
    <StatusWrapper>
      <StatusLabel>{label}</StatusLabel>
      <StatusField>{fieldText}</StatusField>
    </StatusWrapper>
  ) : (
    <StatusLink href={link}>
      <StatusWrapper>
        <StatusLabel>{label}</StatusLabel>
        <StatusField>{fieldText}</StatusField>
      </StatusWrapper>
    </StatusLink>
  );

export default LinkInput;
