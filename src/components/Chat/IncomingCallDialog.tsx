// src/components/Chat/IncomingCallModal.tsx

import React, { useEffect, useRef } from 'react';
import { Box, Button, Typography, Modal, Paper, Avatar, Stack } from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import VideocamIcon from '@mui/icons-material/Videocam';

interface Props {
  open: boolean;
  callType: 'audio' | 'video';
  fromUsername?: string;
  onAccept: () => void;
  onDecline: () => void;
}

const IncomingCallModal: React.FC<Props> = ({ open, callType, fromUsername, onAccept, onDecline }) => {
  const ringtoneRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (open) {
      ringtoneRef.current = new Audio('/sounds/ringtone.mp3'); // Ensure this path is correct in your /public folder
      ringtoneRef.current.loop = true;
      ringtoneRef.current.play().catch(e => console.warn('Ringtone autoplay blocked by browser.'));

      return () => {
        ringtoneRef.current?.pause();
        ringtoneRef.current = null;
      };
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onDecline}>
      <Paper
        sx={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '85%', sm: 360 },
          bgcolor: 'background.paper',
          boxShadow: 24, p: 4,
          textAlign: 'center', borderRadius: 4,
          outline: 'none',
        }}
      >
        <Avatar sx={{ width: 80, height: 80, margin: '0 auto', mb: 2, bgcolor: 'primary.light' }}>
          {callType === 'video' ? <VideocamIcon sx={{ fontSize: 40 }}/> : <PhoneInTalkIcon sx={{ fontSize: 40 }}/>}
        </Avatar>
        <Typography variant="h5" component="h2">Incoming Call</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
          <strong>{fromUsername || 'Unknown User'}</strong> is calling...
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="contained" color="success" onClick={onAccept} size="large">Accept</Button>
          <Button variant="outlined" color="error" onClick={onDecline} size="large">Decline</Button>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default IncomingCallModal;