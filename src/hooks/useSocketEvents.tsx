import { useEffect, useCallback } from 'react';
import { getSocket } from '@utils/socket';
import { ChatMessage } from '@types/mesagetypes';
// 1. ✅ IMPORT your generated API slice
import { api } from '@store/slices/api';
import { useAppDispatch } from '@/store/hooks';

// 2. ✅ SIMPLIFY Props: The hook now only needs to know who you are and who you're talking to.
interface UseSocketEventsProps {
  myUserId: string;
  selectedUserId: string | undefined;
}

const useSocketEvents = ({ myUserId, selectedUserId }: UseSocketEventsProps) => {
  const dispatch = useAppDispatch();

  const handleNewMessage = useCallback(
    (message: ChatMessage) => {
      console.log('📨 EVENT: "message" received:', message);

      // Edge Case: Only update the cache if the message is for the currently active chat
      if (message.sender === selectedUserId || message.receiver === selectedUserId) {
        dispatch(
          api.util.updateQueryData(
            'fetchMessages',
            { selectedUserId: selectedUserId! },
            (draft) => {
              // Check for duplicates before adding, in case of race conditions
              if (!draft.messages.find((m) => m._id === message.id)) {
                draft.messages.push(message);
              }
            },
          ),
        );
      }
    },
    [dispatch, selectedUserId],
  );

  const handleUserOnline = useCallback(
    (data: { userId: string }) => {
      console.log('🟢 EVENT: "userOnline" received for userId:', data.userId);
      // Also update the 'fetchUsers' cache
      dispatch(
        api.util.updateQueryData('fetchUsers', undefined, (draft) => {
          const user = (draft as any)?.users?.find((u: any) => u.id === data.userId);
          if (user) {
            user.isOnline = true;
          }
        }),
      );
    },
    [dispatch],
  );

  const handleUserOffline = useCallback(
    (data: { userId: string }) => {
      console.log('🔴 EVENT: "userOffline" received for userId:', data.userId);
      dispatch(
        api.util.updateQueryData('fetchUsers', undefined, (draft) => {
          const user = (draft as any)?.users?.find((u: any) => u.id === data.userId);
          if (user) {
            user.isOnline = false;
            user.lastSeen = new Date().toISOString();
          }
        }),
      );
    },
    [dispatch],
  );

  // const handleTyping = useCallback((data: { senderId: string }) => {

  //   console.log(`💬 EVENT: "typing" received from sender:`, data.senderId);
  // }, []);

  // --- OUTGOING EVENT EMITTER ---

  const sendMessage = useCallback(
    (recipientId: string, content: string) => {
      const socket = getSocket();
      if (!socket) {
        console.error('Socket not available. Cannot send message.');
        return;
      }

      const payload = { recipientId, content };
      socket.emit('sendMessage', payload);
      console.log("🚀 Emitting 'sendMessage' event via hook with payload:", payload);
      const tempId = new Date().toISOString();

      const optimisticMessage: ChatMessage = {
        id: tempId,
        _id: tempId,
        sender: myUserId,
        receiver: recipientId,
        content: content,
        timestamp: new Date().toISOString(),
        type: 'text',
      };

      dispatch(
        api.util.updateQueryData('fetchMessages', { selectedUserId: recipientId }, (draft) => {
          draft.messages.push(optimisticMessage);
        }),
      );
    },
    [dispatch, myUserId],
  );

  // --- EFFECT TO REGISTER AND CLEAN UP LISTENERS ---
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    console.log('🔌 RTK-Query Hook: Attaching socket event listeners...');

    // RTK Query handles fetching initial messages, so we don't need to emit 'getRecentMessages' here.

    socket.on('message', handleNewMessage);
    socket.on('userOnline', handleUserOnline);
    socket.on('userOffline', handleUserOffline);
    // 'typing' is handled locally in ChatBody, so we don't need a global listener here.

    return () => {
      console.log('🔌 RTK-Query Hook: Cleaning up listeners.');
      socket.off('message', handleNewMessage);
      socket.off('userOnline', handleUserOnline);
      socket.off('userOffline', handleUserOffline);
    };
  }, [handleNewMessage, handleUserOnline, handleUserOffline]);

  // --- RETURN THE ACTIONABLE FUNCTION ---
  return { sendMessage };
};

export default useSocketEvents;
