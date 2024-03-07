import React, { useState } from 'react';

import {
  SingleCommentMain,
  NoteDropdown,
  CommentText,
} from 'features/ambassadors/role/admin/elements/note-ambassadors-modal/elements/single-comment/styles';
import { useMenu } from 'hooks';
import { DeleteIcon, EditIcon, VerticalDotsIcon } from 'components/svg';
import { TSingleCommentProps } from 'features/ambassadors/role/admin/elements/note-ambassadors-modal/elements/single-comment/types';
import { Input } from 'components/ui';
import { IconButton } from '@mui/material';

const SingleComment = ({
  value,
  index,
  onEdit,
  onDelete,
  ...props
}: TSingleCommentProps) => {
  const [menuRef, open, setOpen] = useMenu(false);

  const [disabled, setDisabled] = useState(true);
  const [text, setText] = useState(value);

  const handleMenu = () => {
    setOpen(!open);
  };

  return (
    <SingleCommentMain>
      <CommentText>
        <Input
          type="text"
          label=""
          value={text}
          disabled={disabled}
          multiline
          onValue={(v) => {
            setText(v);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onEdit(index, text);
              setDisabled((prev) => !prev);
            }
          }}
          endAdornment={
            <IconButton>
              {' '}
              <VerticalDotsIcon onClick={handleMenu} />
            </IconButton>
          }
          minRows={1}
          maxRows={5}
        />
      </CommentText>
      {open && (
        <NoteDropdown
          items={[
            {
              icon: <EditIcon />,
              label: 'Edit',
              action: () => {
                setDisabled((prev) => !prev);
                handleMenu();
              },
            },
            {
              icon: <DeleteIcon />,
              label: 'Remove',
              action: () => {
                onDelete(index);
                handleMenu();
              },
            },
          ]}
          ref={menuRef}
        />
      )}
    </SingleCommentMain>
  );
};

export default SingleComment;
