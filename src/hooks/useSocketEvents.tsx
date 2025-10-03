import { useEffect, useCallback } from 'react';
import { getSocket } from '@/utils/socket';
import { User, ChatMessage } from '@/types/types';

interface UseSocketEventsProps {
  selectedUser: User | null;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const useSocketEvents = ({ selectedUser, setUsers, setMessages }: UseSocketEventsProps) => {
  const handleRecentMessages = useCallback(
    (messages: ChatMessage[]) => setMessages(messages),
    [setMessages]
  );

  const handleNewMessage = useCallback(
    (message: ChatMessage) => setMessages(prev => [...prev, message]),
    [setMessages]
  );

  const handleUserOnline = useCallback(
    (userId: string) =>
      setUsers(prev =>
        prev.some(user => user.id === userId)
          ? prev.map(user => (user.id === userId ? { ...user, isOnline: true } : user))
          : prev
      ),
    [setUsers]
  );

  const handleUserOffline = useCallback(
    (userId: string) =>
      setUsers(prev =>
        prev.some(user => user.id === userId)
          ? prev.map(user => (user.id === userId ? { ...user, isOnline: false } : user))
          : prev
      ),
    [setUsers]
  );

  const handleTyping = useCallback((username: string) => {
    console.log(`${username} is typing...`);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    console.log('🔌 Socket initialized:', socket.id);

    if (selectedUser) {
      socket.emit('getRecentMessages', selectedUser.id);
    }

    // Register listeners
    socket.on('recentMessages', handleRecentMessages);
    socket.on('newMessage', handleNewMessage);
    socket.on('userOnline', handleUserOnline);
    socket.on('userOffline', handleUserOffline);
    socket.on('typing', handleTyping);

    // Cleanup
    return () => {
      socket.off('recentMessages', handleRecentMessages);
      socket.off('newMessage', handleNewMessage);
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
      socket.off('typing', handleTyping);
    };
  }, [
    selectedUser,
    handleRecentMessages,
    handleNewMessage,
    handleUserOnline,
    handleUserOffline,
    handleTyping,
  ]);
};

export default useSocketEvents;
