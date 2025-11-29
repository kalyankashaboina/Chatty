// src/components/Auth/Login/LoginPage.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './LoginPage';
import { setCredentials } from '../../../store/slices/authSlice';

// --- MOCKS ---

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../store/slices/authSlice', () => ({
  setCredentials: jest.fn(),
}));

const mockInitializeSocket = jest.fn();
jest.mock('../../../utils/socket', () => ({
  initializeSocket: () => mockInitializeSocket(),
}));

// Mock API Mutations
const mockLogin = jest.fn();
const mockLoginWithGoogle = jest.fn();
jest.mock('@store/slices/api', () => ({
  useLoginMutation: () => [mockLogin],
  useLoginWithGoogleMutation: () => [mockLoginWithGoogle],
}));

// Mock Google Login Component
jest.mock('@react-oauth/google', () => ({
  GoogleLogin: (props: any) => (
    <div data-testid="google-mock">
      <button onClick={() => props.onSuccess({ credential: 'mock-google-token' })}>
        Simulate Google Success
      </button>
      <button onClick={() => props.onSuccess({})}>Simulate Google Missing Credential</button>
      <button onClick={() => props.onError()}>Simulate Google Error</button>
    </div>
  ),
}));

// --- TESTS ---

describe('Login Component', () => {
  const mockOnSuccess = jest.fn();
  const mockSetError = jest.fn();
  const mockSetLoading = jest.fn();

  const defaultProps = {
    onSuccess: mockOnSuccess,
    error: null,
    setError: mockSetError,
    loading: false,
    setLoading: mockSetLoading,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form fields and buttons', () => {
    render(<Login {...defaultProps} />);

    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Login$/i })).toBeInTheDocument();
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  test('displays error message from props', () => {
    render(<Login {...defaultProps} error="Invalid credentials" />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  test('button validation: disabled when invalid, enabled when valid', () => {
    render(<Login {...defaultProps} />);
    const loginBtn = screen.getByRole('button', { name: /^Login$/i });

    expect(loginBtn).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    expect(loginBtn).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123' } });
    expect(loginBtn).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123456' } });
    expect(loginBtn).toBeEnabled();
  });

  test('Standard Login: Success Flow', async () => {
    // FIX: mockReturnValue creates a synchronous object with .unwrap()
    mockLogin.mockReturnValue({
      unwrap: () => Promise.resolve({ user: { id: 1, name: 'Test User' } }),
    });
    mockInitializeSocket.mockReturnValue({ id: 'socket-id' });

    render(<Login {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /^Login$/i }));

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(mockSetError).toHaveBeenCalledWith(null);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ email: 'user@test.com', password: 'password123' });
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(setCredentials).toHaveBeenCalledWith({ user: { id: 1, name: 'Test User' } });
    expect(mockInitializeSocket).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/home');
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  test('Standard Login: API Failure', async () => {
    const errorResponse = { data: { message: 'Invalid password' } };
    // FIX: mockReturnValue with unwrap rejecting
    mockLogin.mockReturnValue({
      unwrap: () => Promise.reject(errorResponse),
    });

    render(<Login {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /^Login$/i }));

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('Invalid password');
    });
    expect(mockSetLoading).toHaveBeenCalledWith(false);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('Standard Login: Generic API Failure fallback', async () => {
    // FIX: mockReturnValue with unwrap rejecting generic error
    mockLogin.mockReturnValue({
      unwrap: () => Promise.reject(new Error('Network Error')),
    });

    render(<Login {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /^Login$/i }));

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('Network Error');
    });
  });

  test('Standard Login: Socket Initialization Failure', async () => {
    // FIX: Login succeeds
    mockLogin.mockReturnValue({
      unwrap: () => Promise.resolve({ user: { id: 1 } }),
    });
    // Socket fails
    mockInitializeSocket.mockReturnValue(null);

    render(<Login {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'user@test.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /^Login$/i }));

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('Socket initialization failed');
    });
  });

  test('Google Login: Success Flow', async () => {
    // FIX: mockReturnValue for Google Mutation
    mockLoginWithGoogle.mockReturnValue({
      unwrap: () => Promise.resolve({ user: { id: 2, name: 'Google User' } }),
    });
    mockInitializeSocket.mockReturnValue({ id: 'socket-id' });

    render(<Login {...defaultProps} />);

    fireEvent.click(screen.getByText('Simulate Google Success'));

    expect(mockSetLoading).toHaveBeenCalledWith(true);

    await waitFor(() => {
      expect(mockLoginWithGoogle).toHaveBeenCalledWith({ googleToken: 'mock-google-token' });
    });

    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/home');
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  test('Google Login: API Failure', async () => {
    // FIX: mockReturnValue with rejection
    mockLoginWithGoogle.mockReturnValue({
      unwrap: () => Promise.reject({ data: { message: 'Google Auth Failed' } }),
    });

    render(<Login {...defaultProps} />);
    fireEvent.click(screen.getByText('Simulate Google Success'));

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('Google Auth Failed');
    });
    expect(mockSetLoading).toHaveBeenCalledWith(false);
  });

  test('Google Login: Missing Credential Edge Case', async () => {
    render(<Login {...defaultProps} />);

    fireEvent.click(screen.getByText('Simulate Google Missing Credential'));

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('Google login failed: no credential returned');
    });
    expect(mockLoginWithGoogle).not.toHaveBeenCalled();
  });

  test('Google Login: Provider Error', async () => {
    render(<Login {...defaultProps} />);

    fireEvent.click(screen.getByText('Simulate Google Error'));

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith('Google login failed');
    });
  });
});
