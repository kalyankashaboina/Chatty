// ChatBodyScrollButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ChatBodyScrollButton from './ChatBodyScrollButton ';

describe('ChatBodyScrollButton', () => {
  const scrollToBottomMock = jest.fn();
  const theme = createTheme();

  const renderComponent = (showScrollButton: boolean) => {
    return render(
      <ThemeProvider theme={theme}>
        <ChatBodyScrollButton
          showScrollButton={showScrollButton}
          scrollToBottom={scrollToBottomMock}
        />
      </ThemeProvider>,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('does not render button when showScrollButton is false', () => {
    renderComponent(false);
    const button = screen.queryByRole('button', { name: /scroll to bottom/i });
    expect(button).not.toBeInTheDocument();
  });

  test('renders button when showScrollButton is true', () => {
    renderComponent(true);
    const button = screen.getByRole('button', { name: /scroll to bottom/i });
    expect(button).toBeInTheDocument();
  });

  test('calls scrollToBottom when button is clicked', () => {
    renderComponent(true);
    const button = screen.getByRole('button', { name: /scroll to bottom/i });
    fireEvent.click(button);
    expect(scrollToBottomMock).toHaveBeenCalledTimes(1);
  });

  test('applies correct styles and animations', () => {
    renderComponent(true);
    const button = screen.getByRole('button', { name: /scroll to bottom/i });

    // Check for initial styles
    expect(button).toHaveStyle(`border-radius: 24px`);
    expect(button).toHaveStyle(`text-transform: none`);
    expect(button).toHaveStyle(`font-weight: bold`);

    // Hover styles simulation
    fireEvent.mouseOver(button);
    // Can't assert animations directly in RTL; just ensure no crash on hover
    fireEvent.mouseOut(button);
  });
});
