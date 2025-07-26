// src/components/Chat/ActiveCall.tsx

import React, { useEffect, useRef } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface Props {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callType: 'audio' | 'video';
  onEndCall: () => void;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
}

const ActiveCall: React.FC<Props> = ({ localStream, remoteStream, callType, onEndCall, isAudioMuted, isVideoMuted, onToggleAudio, onToggleVideo }) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localVideoRef.current && localStream) localVideoRef.current.srcObject = localStream;
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#202124', zIndex: 1300, display: 'flex' }}>
      {/* Remote Video */}
      <Box sx={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {remoteStream && callType === 'video' && !isVideoMuted ? (
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <AccountCircleIcon sx={{ fontSize: 150, color: 'rgba(255, 255, 255, 0.5)' }} />
            <Typography variant="h4" sx={{ mt: 2 }}>
              {callType === 'audio' ? "Audio Call" : "Video Off"}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Local Video */}
      {callType === 'video' && (
        <Paper elevation={3} sx={{
          position: 'absolute', bottom: '100px', right: '20px',
          width: { xs: '100px', sm: '180px', md: '240px' },
          height: { xs: '75px', sm: '135px', md: '180px' },
          borderRadius: 2, overflow: 'hidden', border: '2px solid white',
          backgroundColor: 'black'
        }}>
          {localStream && !isVideoMuted ? (
            <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
             <Box sx={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <VideocamOffIcon sx={{color: 'white'}} />
             </Box>
          )}
        </Paper>
      )}

      {/* Control Bar */}
      <Paper sx={{
        position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
        padding: '10px 20px', borderRadius: '50px',
        backgroundColor: 'rgba(30, 30, 30, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex', gap: 2,
      }}>
        <IconButton sx={{ color: 'white' }} onClick={onToggleAudio}>
          {isAudioMuted ? <MicOffIcon /> : <MicIcon />}
        </IconButton>
        {callType === 'video' && (
          <IconButton sx={{ color: 'white' }} onClick={onToggleVideo}>
            {isVideoMuted ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
        )}
        <IconButton sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: '#d32f2f' } }} onClick={onEndCall}>
          <CallEndIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default ActiveCall;