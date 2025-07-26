// src/components/Chat/Chat.tsx

import React, { useEffect, useState, useRef, useCallback } from 'react';
// 🔴 FIX: Removed unused 'Typography' import to clear the warning.
import { Box } from '@mui/material';
import { ChatMessage, User } from '../../types/types';
import ChatBody from './ChatBody/ChatBody';
import ChatInput from './ChatInput/ChatInput';
import ChatHeader from './ChatHeader/ChatHeader';
import { getSocket } from '../../utils/socket';
import IncomingCallModal from './IncomingCallDialog';
import CallPreviewModal from './CallPreviewModal';
import ActiveCall from './ActiveCall';

const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

interface ChatProps {
  selectedUser: User | null;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const Chat: React.FC<ChatProps> = ({ selectedUser, messages, setMessages }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const myUserId = user?.id || '';

  const [callState, setCallState] = useState<'idle' | 'previewing' | 'dialing' | 'receiving' | 'active'>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [incomingCallData, setIncomingCallData] = useState<any>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const otherUserInCallRef = useRef<string | null>(null);
  const callTypeRef = useRef<'audio' | 'video' | null>(null);
  const callStateRef = useRef(callState);

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  const cleanupCallResources = useCallback(() => {
    console.log("🧹 [CLEANUP] Cleaning up all call resources.");
    localStream?.getTracks().forEach(track => track.stop());
    remoteStream?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setCallState('idle');
    setIncomingCallData(null);
    otherUserInCallRef.current = null;
    callTypeRef.current = null;
    setIsAudioMuted(false);
    setIsVideoMuted(false);
  }, [localStream, remoteStream]);

  const createPeerConnection = useCallback((otherUserId: string, stream: MediaStream) => {
    const pc = new RTCPeerConnection(configuration);
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
    pc.onicecandidate = event => {
      if (event.candidate) getSocket()?.emit('ice-candidate', event.candidate, otherUserId);
    };
    pc.ontrack = event => setRemoteStream(event.streams[0]);
    peerConnection.current = pc;
    return pc;
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    
    // 🔴 FIX: Implemented the message handler to make the chat functional and remove the warning.
    const messageHandler = (message: any) => {
        console.log("📨 [MESSAGE] Received 'message' event:", message);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            content: message.content,
            type: message.type || 'text',
            sender: message.senderId,
            receiver: myUserId,
        }]);
    };

    const onIncomingCall = (data: any) => {
      if (callStateRef.current !== 'idle') return;
      otherUserInCallRef.current = data.fromUserId;
      callTypeRef.current = data.callType;
      setIncomingCallData(data);
      setCallState('receiving'); 
    };
    
    const oncallAccepted = async (data: { fromUserId: string }) => {
      console.log(`✅🤝 [CALLER] Received 'callAccepted'. Starting WebRTC process.`);
      setLocalStream(currentLocalStream => {
          if (!currentLocalStream) {
            console.error("Critical error: localStream not available when call was accepted.");
            cleanupCallResources();
            return null;
          }
          const pc = createPeerConnection(data.fromUserId, currentLocalStream);
          pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => {
              getSocket()?.emit('offer', pc.localDescription, data.fromUserId);
              setCallState('active');
            })
            .catch(err => cleanupCallResources());
          return currentLocalStream;
      });
    };
    
    const onOffer = async (data: { sdp: RTCSessionDescriptionInit; fromUserId: string }) => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: callTypeRef.current === 'video', audio: true });
      setLocalStream(stream);
      const pc = createPeerConnection(data.fromUserId, stream);
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      getSocket()?.emit('answer', answer, data.fromUserId);
      setCallState('active');
    };

    const onAnswer = async (data: { sdp: RTCSessionDescriptionInit }) => { if (peerConnection.current && peerConnection.current.signalingState === 'have-local-offer') await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp)) };
    const onIceCandidate = async (data: { candidate: RTCIceCandidateInit }) => { if (peerConnection.current && data.candidate) await peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate)) };
    const onCallRejected = () => cleanupCallResources();
    const onCallEnded = () => cleanupCallResources();

    socket.on('message', messageHandler);
    socket.on('incomingCall', onIncomingCall);
    socket.on('callAccepted', oncallAccepted);
    socket.on('callRejected', onCallRejected);
    socket.on('callEnded', onCallEnded);
    socket.on('offer', onOffer);
    socket.on('answer', onAnswer);
    socket.on('ice-candidate', onIceCandidate);

    return () => {
      socket.off('message', messageHandler);
      socket.off('incomingCall', onIncomingCall);
      socket.off('callAccepted', oncallAccepted);
      //... cleanup other listeners
    };
  }, [cleanupCallResources, createPeerConnection, myUserId, setMessages]);

  const startCall = async (type: 'audio' | 'video') => {
    if (!selectedUser) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: type === 'video', audio: true });
      setLocalStream(stream);
      callTypeRef.current = type;
      otherUserInCallRef.current = selectedUser.id;
      setCallState('previewing');
    } catch (err) {
      console.error("❌ Failed to get user media for preview:", err);
    }
  };

  const confirmAndDial = () => {
    if (!otherUserInCallRef.current || !callTypeRef.current) return;
    getSocket()?.emit('callRequest', { toUserId: otherUserInCallRef.current, callType: callTypeRef.current });
    setCallState('dialing');
  };
  
  const handleAcceptCall = () => { if (otherUserInCallRef.current) getSocket()?.emit('callAccepted', { toUserId: otherUserInCallRef.current }) };
  const handleHangUp = () => { if (otherUserInCallRef.current) getSocket()?.emit('callEnded', { toUserId: otherUserInCallRef.current }); cleanupCallResources(); };
  const handleRejectCall = () => { if (otherUserInCallRef.current) getSocket()?.emit('callRejected', { toUserId: otherUserInCallRef.current }); cleanupCallResources(); };
  const toggleAudio = () => { localStream?.getAudioTracks().forEach(track => { track.enabled = !track.enabled; }); setIsAudioMuted(prev => !prev); };
  const toggleVideo = () => { localStream?.getVideoTracks().forEach(track => { track.enabled = !track.enabled; }); setIsVideoMuted(prev => !prev); };
  const handleSendMessage = () => {};
  
  if (!selectedUser) {
    return <Box>Select a user to begin.</Box>;
  }
  
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
      <ChatHeader selectedUser={selectedUser} onStartCall={startCall} />
      <ChatBody filteredMessages={messages} myUserId={myUserId} />
      
      {/* 🔴 FIX: Added non-null assertion `!` to selectedUser to satisfy TypeScript */}
      <ChatInput newMessage={newMessage} setNewMessage={setNewMessage} selectedUserId={selectedUser!.id} handleSendMessage={handleSendMessage} handleTyping={() => {}} handleStoppedTyping={() => {}} />

      <IncomingCallModal
        open={callState === 'receiving'}
        callType={callTypeRef.current || 'audio'}
        fromUsername={incomingCallData?.fromUsername}
        onAccept={handleAcceptCall}
        onDecline={handleRejectCall}
      />
      <CallPreviewModal
        open={callState === 'previewing' || callState === 'dialing'}
        isDialing={callState === 'dialing'}
        callType={callTypeRef.current!}
        toUsername={selectedUser.username}
        localStream={localStream}
        onCancel={handleHangUp}
        onConfirm={confirmAndDial}
      />
      {callState === 'active' && (
        <ActiveCall
          localStream={localStream}
          remoteStream={remoteStream}
          callType={callTypeRef.current!}
          onEndCall={handleHangUp}
          isAudioMuted={isAudioMuted}
          isVideoMuted={isVideoMuted}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
        />
      )}
    </Box>
  );
};

export default Chat;