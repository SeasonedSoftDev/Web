import React from 'react';

import {
  ChatMessageMain,
  ChatMessageAvatar,
  ChatMessageTextContainer,
  ChatMessageText,
  ChatMessageTime,
} from 'components/custom/chat/elements/chat-message/style';

import { TChatMessageProps } from 'components/custom/chat/elements/chat-message/types';
import Avatar from 'react-avatar';

function generateHexColor(fullName: string) {
  let hash = 0;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < fullName.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
  }

  // eslint-disable-next-line no-bitwise
  const color = `#${(hash & 0x00ffffff)
    .toString(16)
    .toUpperCase()
    .padStart(6, '0')}`;

  return color;
}

const ChatMessage = ({
  message,
  time,
  currentUserSignedIn,
  name,
  userId,
  ...props
}: TChatMessageProps) => (
  <ChatMessageMain currentUserSignedIn={currentUserSignedIn}>
    {!currentUserSignedIn &&
      (userId === 1 ? (
        <ChatMessageAvatar src="/static/logo.svg" />
      ) : (
        <Avatar name={name} size="30" round color={generateHexColor(name)} />
      ))}
    <ChatMessageTextContainer currentUserSignedIn={currentUserSignedIn}>
      <ChatMessageText>{message}</ChatMessageText>
      <ChatMessageTime>{time}</ChatMessageTime>
    </ChatMessageTextContainer>
    {currentUserSignedIn &&
      (userId === 1 ? (
        <ChatMessageAvatar src="/static/logo.svg" />
      ) : (
        <Avatar name={name} size="30" round color={generateHexColor(name)} />
      ))}
  </ChatMessageMain>
);

export default ChatMessage;
