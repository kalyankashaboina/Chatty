import React from 'react';
import { Box, Button, Fade, useTheme } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { keyframes } from '@mui/system';

interface ScrollToBottomButtonProps {
  showScrollButton: boolean;
  scrollToBottom: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const ChatBodyScrollButton: React.FC<ScrollToBottomButtonProps> = ({
  showScrollButton,
  scrollToBottom,
}) => {
  const theme = useTheme();

  return (
    <Fade in={showScrollButton} timeout={500}>
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          animation: `${fadeIn} 0.5s ease`,
        }}
      >
        <Button
          onClick={scrollToBottom}
          variant="contained"
          startIcon={<KeyboardArrowDownIcon />}
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: '#fff',
            borderRadius: '24px',
            textTransform: 'none',
            fontWeight: 'bold',
            px: 3,
            boxShadow: 4,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            animation: `${pulse} 2.5s ease-in-out infinite`,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
              transform: 'scale(1.1)',
              boxShadow: `0 0 15px 2px ${theme.palette.primary.main}`,
              animation: 'none', // stop pulsing on hover
            },
            '&:focus': {
              outline: 'none',
              boxShadow: `0 0 20px 3px ${theme.palette.primary.main}`,
            },
          }}
        >
          Scroll to Bottom
        </Button>
      </Box>
    </Fade>
  );
};

export default ChatBodyScrollButton;
