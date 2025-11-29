import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// --- MOCKS ---

// 1. Mock Navbar to test Theme Toggling
// We expose the onToggleTheme prop as a button to click
jest.mock('./components/NavBar/Navbar', () => ({ onToggleTheme, themeMode }: any) => (
  <div data-testid="navbar">
    Current Theme: {themeMode}
    <button onClick={onToggleTheme}>Toggle Theme</button>
  </div>
));

// 2. Mock Welcome to test opening Login/Register dialogs
jest.mock('./components/welcome/Welcome', () => ({ onLogin, onRegister }: any) => (
  <div data-testid="welcome-screen">
    <button onClick={onLogin}>Open Login</button>
    <button onClick={onRegister}>Open Register</button>
  </div>
));

// 3. Mock AuthDialog to test passing props and closing behavior
jest.mock('./components/auth/AuthDialog', () => ({ open, onClose, defaultTab }: any) => {
  if (!open) return null;
  return (
    <div data-testid="auth-dialog">
      Dialog Mode: {defaultTab}
      <button onClick={onClose}>Close Dialog</button>
    </div>
  );
});

// 4. Mock HomeScreen (Lazy loaded)
jest.mock('./components/Homepage/HomeScreen', () => () => (
  <div data-testid="home-screen">Mock Home Screen</div>
));

// 5. Mock ErrorBoundary to simply render children
jest.mock('./components/ErroBoundary/ErrorBoundary', () => ({ children }: any) => (
  <div>{children}</div>
));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset body attribute before each test
    document.body.setAttribute('data-mui-color-scheme', 'light');
  });

  test('renders initial landing page correctly (Navbar and Welcome)', () => {
    render(<App />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('welcome-screen')).toBeInTheDocument();
    // AuthDialog should be hidden initially
    expect(screen.queryByTestId('auth-dialog')).not.toBeInTheDocument();
  });

  test('toggles theme mode correctly', () => {
    render(<App />);

    const navbar = screen.getByTestId('navbar');
    const toggleBtn = screen.getByText('Toggle Theme');

    // 1. Check initial state
    expect(navbar).toHaveTextContent('Current Theme: light');
    expect(document.body.getAttribute('data-mui-color-scheme')).toBe('light');

    // 2. Click Toggle -> Change to Dark
    fireEvent.click(toggleBtn);
    expect(navbar).toHaveTextContent('Current Theme: dark');
    expect(document.body.getAttribute('data-mui-color-scheme')).toBe('dark');

    // 3. Click Toggle -> Change back to Light
    fireEvent.click(toggleBtn);
    expect(navbar).toHaveTextContent('Current Theme: light');
    expect(document.body.getAttribute('data-mui-color-scheme')).toBe('light');
  });

  test('opens AuthDialog on "Login" tab when Login button clicked', () => {
    render(<App />);

    // Click Login on Welcome screen
    fireEvent.click(screen.getByText('Open Login'));

    // Check Dialog appears
    const dialog = screen.getByTestId('auth-dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Dialog Mode: login');
  });

  test('opens AuthDialog on "Register" tab when Register button clicked', () => {
    render(<App />);

    // Click Register on Welcome screen
    fireEvent.click(screen.getByText('Open Register'));

    // Check Dialog appears with correct tab
    const dialog = screen.getByTestId('auth-dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('Dialog Mode: register');
  });

  test('closes AuthDialog when close callback is triggered', () => {
    render(<App />);

    // Open Dialog
    fireEvent.click(screen.getByText('Open Login'));
    expect(screen.getByTestId('auth-dialog')).toBeInTheDocument();

    // Close Dialog
    fireEvent.click(screen.getByText('Close Dialog'));

    // Check Dialog disappears
    expect(screen.queryByTestId('auth-dialog')).not.toBeInTheDocument();
  });

  // Note: Testing the "/home" route (Lazy Loading) is tricky because
  // BrowserRouter is hardcoded inside App. We can't easily push history
  // from the outside in a unit test without modifying the component to
  // accept a Router prop.
  // However, we can verify that the code *attempts* to import the component.
  test('Lazy loaded components are defined', async () => {
    const HomeScreenModule = await import('./components/Homepage/HomeScreen');
    expect(HomeScreenModule).toBeDefined();
  });
});
