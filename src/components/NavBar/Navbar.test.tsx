import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLogoutMutation } from '@store/slices/api';
import { disconnectSocket } from '@utils/socket';

// ----------------------------------------------------
// 🔥 Proper mocks (no TS errors)
// ----------------------------------------------------
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));

jest.mock('@store/slices/api', () => ({
  useLogoutMutation: jest.fn(),
}));

jest.mock('@utils/socket', () => ({
  disconnectSocket: jest.fn(),
}));

global.alert = jest.fn();

describe('Navbar Component', () => {
  const mockNavigate = jest.fn();
  const mockDispatch = jest.fn();
  const mockLogoutApiCall = jest.fn();

  beforeEach(() => {
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useLogoutMutation as unknown as jest.Mock).mockReturnValue([mockLogoutApiCall]);
    jest.clearAllMocks();
  });

  test('renders Navbar correctly', () => {
    render(<Navbar onToggleTheme={() => {}} themeMode="light" />);
    expect(screen.getByText('💬 Chatty')).toBeInTheDocument();
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  test('handles successful logout', async () => {
    mockLogoutApiCall.mockReturnValue({
      unwrap: jest.fn().mockResolvedValue({ success: true }),
    });

    render(<Navbar onToggleTheme={() => {}} themeMode="light" />);

    fireEvent.click(screen.getByText('Log out'));

    await waitFor(() => {
      expect(mockLogoutApiCall).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
      expect(disconnectSocket).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('handles logout error with API error message', async () => {
    mockLogoutApiCall.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({
        data: { message: 'Logout failed from API' },
      }),
    });

    render(<Navbar onToggleTheme={() => {}} themeMode="light" />);

    fireEvent.click(screen.getByText('Log out'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Logout failed from API');
    });
  });

  test('handles logout error with no message', async () => {
    mockLogoutApiCall.mockReturnValue({
      unwrap: jest.fn().mockRejectedValue({}),
    });

    render(<Navbar onToggleTheme={() => {}} themeMode="light" />);

    fireEvent.click(screen.getByText('Log out'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Logout failed. Please try again.');
    });
  });
});
