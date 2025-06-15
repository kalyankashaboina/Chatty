import { useEffect, useRef, useState } from 'react';
import { getSocket } from '../../utils/socket';
import styles from './VideoCallComponent.module.css';  // Assuming you have a CSS module for styling

interface VideoCallProps {
  recipientId: string;
  onClose: () => void;
  selectedUser: { name: string };  // Assuming you pass selectedUser to get the caller's name
}

const VideoCallComponent = ({ recipientId, onClose, selectedUser }: VideoCallProps) => {
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<string>(''); 
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const offerRef = useRef<RTCSessionDescriptionInit | null>(null);  // Added this definition

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      console.error("❗ Socket is not initialized.");
      return;
    }

    const handleOffer = (offer: RTCSessionDescriptionInit) => {
      console.log("📞 Received an offer from the calling party.");
      offerRef.current = offer;  // Store the offer in the ref
      setIsReceivingCall(true);
      setCallStatus('incoming'); // Set call status to "incoming"
      peerRef.current?.setRemoteDescription(new RTCSessionDescription(offer));
      createAnswer();
      console.log(`🚨 Incoming call from ${selectedUser.name}`);
    };

    const handleAnswer = (answer: RTCSessionDescriptionInit) => {
      console.log("✅ Received an answer to our offer.");
      peerRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const handleIceCandidate = (candidate: RTCIceCandidate) => {
      console.log("🌍 Received ICE candidate.");
      peerRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
    };

    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('ice-candidate', handleIceCandidate);

    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('ice-candidate', handleIceCandidate);
    };
  }, []);

  const startCall = async () => {
    console.log("📞 Starting video call...");
    setIsCalling(true);
    setCallStatus('calling');
    const socket = getSocket();

    if (!socket) return;

    try {
      // Get user media (audio/video)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peerConnection = new RTCPeerConnection();
      peerRef.current = peerConnection;

      // Add local stream to peer connection
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        console.log("👀 Remote stream received.");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Create an offer and send to the recipient
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('offer', { recipientId, offer });
      console.log(`📤 Sent offer to ${recipientId}`);
    } catch (err) {
      console.error("❌ Error starting the call:", err);
      setCallStatus('error');
    }
  };

  const createAnswer = async () => {
    if (!peerRef.current) return;

    try {
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      const socket = getSocket();
      socket?.emit('answer', { recipientId, answer });
      console.log("✅ Sent answer back to the caller.");
    } catch (err) {
      console.error("❌ Error creating answer:", err);
    }
  };

  const acceptCall = async () => {
    console.log("📞 Accepting incoming call...");
    setIsCalling(true);
    setCallStatus('calling');
    try {
      if (!peerRef.current || !localStream) return;

      peerRef.current.setRemoteDescription(new RTCSessionDescription(offerRef.current!));
      createAnswer();
      console.log("📞 Call accepted.");
    } catch (err) {
      console.error("❌ Error accepting the call:", err);
    }
  };

  const declineCall = () => {
    console.log("🚫 Declining the call...");
    const socket = getSocket();
    if (socket) {
      socket.emit('decline', recipientId);
    }
    setCallStatus('declined');
    setIsReceivingCall(false);
    console.log(`🚫 Call declined from ${selectedUser.name}`);
  };

  const endCall = () => {
    console.log("📞 Ending the call...");
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setIsCalling(false);
    setIsReceivingCall(false);
    onClose();
    console.log("🔚 Call ended.");
  };

  return (
    <div className={styles.videoCallContainer}>
      <div className={styles.videoCallWrapper}>
        {/* Incoming Call Notification */}
        {isReceivingCall && (
          <div className={styles.incomingCallNotification}>
            <p>Incoming call from {selectedUser.name}</p>
            <button onClick={acceptCall}>Accept</button>
            <button onClick={declineCall}>Decline</button>
          </div>
        )}

        <div className={styles.videoContainer}>
          <video ref={localVideoRef} autoPlay muted className={styles.localVideo} />
          <video ref={remoteVideoRef} autoPlay className={styles.remoteVideo} />
        </div>

        {/* Call Controls */}
        {!isCalling && !isReceivingCall && (
          <div className={styles.callControls}>
            <button className={styles.callButton} onClick={startCall}>Start Video Call</button>
            <p>Call Status: {callStatus}</p>
          </div>
        )}

        {isReceivingCall && (
          <div className={styles.callControls}>
            <button className={styles.endCall} onClick={endCall}>End Call</button>
            <p>Call Status: {callStatus}</p>
          </div>
        )}

        {isCalling && (
          <div className={styles.callControls}>
            <button className={styles.endCall} onClick={endCall}>End Call</button>
            <p>Call Status: {callStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCallComponent;
