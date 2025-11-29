// src/components/Auth/Register/RegisterPage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from './RegisterPage';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@store/hooks';
import { setCredentials } from '@store/slices/authSlice';
import { useRegisterMutation } from '@store/slices/api';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('@store/hooks', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('@store/slices/api', () => ({
  useRegisterMutation: jest.fn(),
}));

describe('Register Component', () => {
  let navigateMock: jest.Mock;
  let dispatchMock: jest.Mock;
  let onSuccessMock: jest.Mock;
  let registerMock: jest.Mock;

  beforeEach(() => {
    navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    dispatchMock = jest.fn();
    (useAppDispatch as jest.Mock).mockReturnValue(dispatchMock);

    registerMock = jest.fn();
    (useRegisterMutation as jest.Mock).mockReturnValue([registerMock]);

    onSuccessMock = jest.fn();
  });

  it('renders all form fields and button', () => {
    render(
      <Register
        onSuccess={onSuccessMock}
        error={null}
        setError={jest.fn()}
        loading={false}
        setLoading={jest.fn()}
      />,
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('disables button when form is invalid', () => {
    render(
      <Register
        onSuccess={onSuccessMock}
        error={null}
        setError={jest.fn()}
        loading={false}
        setLoading={jest.fn()}
      />,
    );

    const button = screen.getByRole('button', { name: /register/i });
    expect(button).toBeDisabled();
  });

  it('enables button when form is valid', () => {
    render(
      <Register
        onSuccess={onSuccessMock}
        error={null}
        setError={jest.fn()}
        loading={false}
        setLoading={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123456' } });

    const button = screen.getByRole('button', { name: /register/i });
    expect(button).toBeEnabled();
  });

  it('shows error message if provided', () => {
    render(
      <Register
        onSuccess={onSuccessMock}
        error="Error occurred"
        setError={jest.fn()}
        loading={false}
        setLoading={jest.fn()}
      />,
    );

    expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
  });

  it('calls register mutation and handles success', async () => {
    const setLoadingMock = jest.fn();
    const setErrorMock = jest.fn();
    const unwrapMock = jest.fn().mockResolvedValue({ user: { id: 1, username: 'test' } });
    registerMock.mockReturnValue({ unwrap: unwrapMock });

    render(
      <Register
        onSuccess={onSuccessMock}
        error={null}
        setError={setErrorMock}
        loading={false}
        setLoading={setLoadingMock}
      />,
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => expect(setLoadingMock).toHaveBeenCalledWith(true));
    await waitFor(() =>
      expect(registerMock).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@test.com',
        password: '123456',
      }),
    );
    await waitFor(() =>
      expect(dispatchMock).toHaveBeenCalledWith(
        setCredentials({ user: { id: 1, username: 'test' } }),
      ),
    );
    await waitFor(() => expect(onSuccessMock).toHaveBeenCalled());
    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/home'));
    await waitFor(() => expect(setLoadingMock).toHaveBeenCalledWith(false));
  });

  it('handles registration failure', async () => {
    const setLoadingMock = jest.fn();
    const setErrorMock = jest.fn();
    const unwrapMock = jest.fn().mockRejectedValue({ data: { message: 'Failed' } });
    registerMock.mockReturnValue({ unwrap: unwrapMock });

    render(
      <Register
        onSuccess={onSuccessMock}
        error={null}
        setError={setErrorMock}
        loading={false}
        setLoading={setLoadingMock}
      />,
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => expect(setErrorMock).toHaveBeenCalledWith('Failed'));
    await waitFor(() => expect(setLoadingMock).toHaveBeenCalledWith(false));
    expect(onSuccessMock).not.toHaveBeenCalled();
  });

  it('shows loading state on button', () => {
    render(
      <Register
        onSuccess={onSuccessMock}
        error={null}
        setError={jest.fn()}
        loading={true}
        setLoading={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /registering/i })).toBeDisabled();
  });
});
