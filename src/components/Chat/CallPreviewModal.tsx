// src/components/Chat/CallPreviewModal.tsx

import React, { useEffect, useRef } from 'react';
import { Box, Button, Typography, Modal, Paper, CircularProgress, Stack } from '@mui/material';

interface Props {
  open: boolean;
  isDialing: boolean; // 🟢 NEW: Tells the modal if we are previewing or actively dialing
  callType: 'audio' | 'video';
  toUsername?: string;
  localStream: MediaStream | null;
  onCancel: () => void;
  onConfirm: () => void; // This is the action for the "Call" button
}

const CallPreviewModal: React.FC<Props> = ({ open, isDialing, callType, toUsername, localStream, onCancel, onConfirm }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Attach the local stream to the video element for the preview
  useEffect(() => {
    if (open && callType === 'video' && videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [open, callType, localStream]);

  return (
    <Modal open={open} onClose={onCancel} aria-labelledby="call-preview-modal-title">
      <Paper
        sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 450 },
          bgcolor: 'background.paper', boxShadow: 24,
          p: 4, textAlign: 'center', borderRadius: 4,
          outline: 'none',
        }}
      >
        <Typography id="call-preview-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
          {/* Text changes based on whether we are dialing */}
          {isDialing ? `Calling ${toUsername || 'User'}...` : `Ready to call ${toUsername || 'User'}?`}
        </Typography>

        {callType === 'video' && (
          <Box
            sx={{
              mb: 3, bgcolor: 'black', borderRadius: 2, overflow: 'hidden',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              minHeight: '240px', position: 'relative'
            }}
          >
            {localStream ? (
              <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', maxHeight: '50vh' }} />
            ) : (
              // Show a spinner if the camera is still starting up
              <CircularProgress sx={{ color: 'white' }} />
            )}
          </Box>
        )}
        
        <Stack direction="row" spacing={2} justifyContent="center">
          {/* The "Call" button is now disabled after being clicked to prevent multiple requests */}
          <Button variant="contained" color="primary" onClick={onConfirm} disabled={isDialing} size="large">
            {isDialing ? 'Ringing...' : 'Call'}
          </Button>
          <Button variant="outlined" color="error" onClick={onCancel} size="large">
            Cancel
          </Button>
        </Stack>
      </Paper>
    </Modal>
  );
};

export default CallPreviewModal;