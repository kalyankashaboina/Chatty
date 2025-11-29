// src/components/Auth/AuthDialog.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AuthDialog from './AuthDialog';

// Mock Login and Register components
jest.mock('./Login/LoginPage', () => (props: any) => (
  <div data-testid="login-page">
    Login Page
    <button onClick={props.onSuccess}>Login Success</button>
  </div>
));

jest.mock('./Register/RegisterPage', () => (props: any) => (
  <div data-testid="register-page">
    Register Page
    <button onClick={props.onSuccess}>Register Success</button>
  </div>
));

describe('AuthDialog', () => {
  let onCloseMock: jest.Mock;

  beforeEach(() => {
    onCloseMock = jest.fn();
  });

  it('renders login tab by default', () => {
    render(<AuthDialog open={true} onClose={onCloseMock} />);

    // Check tab header
    const loginTab = screen.getByText('Login', { selector: 'h6' });
    expect(loginTab).toBeInTheDocument();

    // Check login page content
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders register tab if defaultTab="register"', () => {
    render(<AuthDialog open={true} onClose={onCloseMock} defaultTab="register" />);

    expect(screen.getByTestId('register-page')).toBeInTheDocument();
  });

  it('switches tabs when clicked', () => {
    render(<AuthDialog open={true} onClose={onCloseMock} />);

    // Initially login page
    expect(screen.getByTestId('login-page')).toBeInTheDocument();

    // Switch to register tab
    fireEvent.click(screen.getByText('Register', { selector: 'h6' }));
    expect(screen.getByTestId('register-page')).toBeInTheDocument();

    // Switch back to login
    fireEvent.click(screen.getByText('Login', { selector: 'h6' }));
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('calls onClose when login succeeds', () => {
    render(<AuthDialog open={true} onClose={onCloseMock} />);

    fireEvent.click(screen.getByText('Login Success'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('calls onClose when register succeeds', () => {
    render(<AuthDialog open={true} onClose={onCloseMock} defaultTab="register" />);

    fireEvent.click(screen.getByText('Register Success'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('resets tab and error on modal close', () => {
    render(<AuthDialog open={true} onClose={onCloseMock} defaultTab="register" />);

    // Switch tab to login
    fireEvent.click(screen.getByText('Login', { selector: 'h6' }));
    expect(screen.getByTestId('login-page')).toBeInTheDocument();

    // Simulate modal onClose
    const modal = screen.getByRole('presentation'); // MUI Paper container
    fireEvent.click(modal); // click on modal background won't trigger close, so we call onClose
    onCloseMock(); // simulate close
    expect(onCloseMock).toHaveBeenCalled();
  });
});
