import React from 'react';
import { InfoIcon } from 'components/svg';
import { TNote } from 'components/custom/note/types';
import { NoteMain, NoteText } from 'components/custom/note/style';

const Note = ({ showIcon, children, ...props }: TNote) => (
  <NoteMain {...props}>
    {showIcon && <InfoIcon />}
    <NoteText>{children}</NoteText>
  </NoteMain>
);

export default Note;
