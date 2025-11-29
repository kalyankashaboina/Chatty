import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ChatBodyScrollButton from './ChatBodyScrollButton ';

// 1. Setup a Theme Wrapper
const theme = createTheme({
  palette: {
    primary: {
      main: '#7c3aed',
      dark: '#5b21b6',
    },
  },
});

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ChatBodyScrollButton Component', () => {
  const mockScrollToBottom = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the button visible when showScrollButton is true', () => {
    renderWithTheme(
      <ChatBodyScrollButton showScrollButton={true} scrollToBottom={mockScrollToBottom} />,
    );

    const button = screen.getByRole('button', { name: /Scroll to Bottom/i });

    // Check if it exists and is visible
    expect(button).toBeInTheDocument();
    expect(button).toBeVisible();
  });

  test('calls scrollToBottom function when clicked', () => {
    renderWithTheme(
      <ChatBodyScrollButton showScrollButton={true} scrollToBottom={mockScrollToBottom} />,
    );

    const button = screen.getByRole('button', { name: /Scroll to Bottom/i });

    // Simulate Click
    fireEvent.click(button);

    // Verify callback
    expect(mockScrollToBottom).toHaveBeenCalledTimes(1);
  });

  test('is not visible when showScrollButton is false', () => {
    renderWithTheme(
      <ChatBodyScrollButton showScrollButton={false} scrollToBottom={mockScrollToBottom} />,
    );

    // queryByRole returns NULL if the element is hidden
    const button = screen.queryByRole('button', { name: /Scroll to Bottom/i });

    // FIX: Use toBeInTheDocument() which handles null safely.
    // Since queryByRole returned null (because it's hidden), this assertion passes.
    expect(button).not.toBeInTheDocument();
  });

  test('applies theme styles correctly', () => {
    renderWithTheme(
      <ChatBodyScrollButton showScrollButton={true} scrollToBottom={mockScrollToBottom} />,
    );

    const button = screen.getByRole('button', { name: /Scroll to Bottom/i });

    // Verify theme application
    expect(button).toHaveStyle('background-color: rgb(124, 58, 237)');
  });
});
