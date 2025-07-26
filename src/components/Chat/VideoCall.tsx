// components/VideoCall/VideoCall.tsx
import React, { useEffect, useRef } from 'react';

interface VideoCallProps {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
}

const VideoCall: React.FC<VideoCallProps> = ({ localStream, remoteStream }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [localStream, remoteStream]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <video ref={localVideoRef} autoPlay muted playsInline width="300" />
      <video ref={remoteVideoRef} autoPlay playsInline width="300" />
    </div>
  );
};

export default VideoCall;
