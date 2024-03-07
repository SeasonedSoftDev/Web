import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  ChatMain,
  ChatMessages,
  PingButton,
} from 'components/custom/chat/style';
import { Input } from 'components/ui';
import { SendIcon } from 'components/svg';
import { ChatMessage } from 'components/custom/chat/elements';
import ChatIO from 'api/chat';
import { useAppContext } from 'context';
import { useSnackbar } from 'hooks';
import { ChatProps } from './types';

const Chat: FC<ChatProps> = ({ chatRoomId, isPingActive = false }) => {
  const messagesContainerRef = useRef<any>(null);
  const [page, setPage] = useState(1);

  const { push } = useSnackbar();

  const [messages, setMessages] = useState<any>([]);
  const [typing, setTyping] = useState<any>([]);
  const [newMessage, setNewMessage] = useState('');

  const { user, role } = useAppContext();

  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);

  const handleSend = () => {
    ChatIO.sendMessage(
      {
        authorId: user.id,
        chatRoomId: chatRoomId.value,
        message: newMessage,
      },
      () => {}
    );

    setNewMessage('');
  };

  // const scrollToBottom = () => {
  //   if (messagesContainerRef.current) {
  //     const container: any = messagesContainerRef.current;
  //     container.scrollTop = container.scrollHeight;
  //   }
  // };

  const fetchOlderMessages = useCallback(async () => {
    ChatIO.findChatMessagesByChatRoomId(
      {
        chatRoomId: chatRoomId.value,
        page,
      },
      () => {}
    );
  }, [chatRoomId.value, page]);

  const handleScroll = useCallback(() => {
    const { scrollTop, scrollHeight, clientHeight }: any =
      messagesContainerRef.current;
    if (scrollTop && scrollHeight && clientHeight) {
      const isAtBottom = scrollTop * -1 + clientHeight >= scrollHeight;

      if (isAtBottom) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  }, [messagesContainerRef, setPage]);

  let typingTimeout: any = null;

  const handleTyping = useCallback(() => {
    ChatIO.subscribeToTyping((response) => {
      const set = new Set([...typing, response]);
      const array = Array.from(set);
      setTyping(array);

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      typingTimeout = setTimeout(() => {
        const updatedTyping = array.filter(
          (typingUser) => typingUser.userName !== response.userName
        );
        setTyping(updatedTyping);
      }, 500);
    });
  }, [typing, typingTimeout]);

  const joinRoom = useCallback(() => {
    ChatIO.joinRoom(chatRoomId.value);
  }, [chatRoomId?.value]);

  const handlePing = useCallback(() => {
    ChatIO.pingAdmin(chatRoomId?.value, (response) => {
      push('You have pinged a moderator', { variant: 'success' });
    });
  }, []);

  useEffect(() => {
    ChatIO.connect();

    joinRoom();

    ChatIO.socket.on('existingMessages', (response: any) => {
      const newMessages = response.map((x: any) => ({
        message: x.message,
        date: today.toDateString(),
        author: x.author,
      }));

      const messageIds: number[] = response.map((message: any) => message.id);
      if (messageIds.length) {
        ChatIO.markMessagesAsRead(messageIds);
      }

      setMessages(newMessages);
    });

    ChatIO.socket.on('findChatMessagesByChatRoomId', (response: any) => {
      const newMessages = response.map((x: any) => ({
        message: x.message,
        date: today.toDateString(),
        author: x.author,
      }));

      if (response.length) {
        const messageIds: number[] = response.map((message: any) => message.id);
        ChatIO.markMessagesAsRead(messageIds);
      }

      setMessages((prevMessages: any) => [...prevMessages, ...newMessages]);
    });

    ChatIO.subscribeToNewMessage((response) => {
      const newChatMessage = {
        message: response.message,
        date: today.toDateString(),
        author: response.author,
      };

      if (response) {
        const messageIds: number[] = [response.id];
        ChatIO.markMessagesAsRead(messageIds);
      }

      setMessages((prevMessages: any) => [newChatMessage, ...prevMessages]);
    });

    if (messagesContainerRef.current) {
      messagesContainerRef.current.addEventListener('scroll', handleScroll);
    }

    handleTyping();

    return () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.removeEventListener(
          'scroll',
          handleScroll
        );
      }
      ChatIO.disconnect();
      setPage(1);
    };
  }, [chatRoomId?.value]);

  useEffect(() => {
    fetchOlderMessages();
  }, [page]);

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && newMessage.trim() !== '') {
      handleSend();
    }
  };

  return (
    <ChatMain>
      {role !== 'SUPERADMIN' && isPingActive ? (
        <PingButton onClick={() => handlePing()}>Ping Moderator?</PingButton>
      ) : undefined}
      <ChatMessages ref={messagesContainerRef}>
        {typing &&
          typing.length > 0 &&
          typing.map(
            (x: any, index: number) =>
              x.userName !== user.firstName && (
                // eslint-disable-next-line react/no-array-index-key
                <p key={index}>{x.userName} is typing...</p>
              )
          )}
        {messages.map((x: any) => (
          <ChatMessage
            key={x.id}
            message={x.message}
            time={x.date}
            currentUserSignedIn={x.author.id === user.id}
            name={
              x.author.influencer
                ? x.author.firstName
                : `${x.author.firstName} ${x.author.lastName}`
            }
            userId={x.author.id}
          />
        ))}
      </ChatMessages>
      <Input
        type="text"
        placeholder="Type your message..."
        endAdornment={
          <SendIcon
            onClick={() => {
              if (newMessage.trim() !== '') {
                handleSend();
              }
            }}
          />
        }
        value={newMessage}
        onValue={(input) => setNewMessage(input)}
        onKeyDown={handleInputKeyDown}
        onChange={() => {
          ChatIO.socket.emit('typing', {
            userName: user.firstName,
            chatRoomId: chatRoomId.value,
            isTyping: true,
          });
        }}
      />
    </ChatMain>
  );
};

export default Chat;
