// src/App.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock lazy-loaded component
jest.mock('./components/Homepage/HomeScreen', () => () => <div>HomeScreen Mock</div>);

describe('App Component', () => {
  test('renders Navbar and Welcome', () => {
    render(<App />);
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument(); // Adjust if Welcome has text
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Navbar usually has role banner
  });

  test('toggles theme when function is called', () => {
    render(<App />);
    const body = document.body;

    // Initial theme
    expect(body.getAttribute('data-mui-color-scheme')).toBe('light');

    // Find toggle button in Navbar and click it
    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggleButton);

    expect(body.getAttribute('data-mui-color-scheme')).toBe('dark');
  });

  test('opens login dialog when login button clicked', async () => {
    render(<App />);

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test('opens register dialog when register button clicked', async () => {
    render(<App />);

    const registerButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerButton);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('renders lazy-loaded HomeScreen', async () => {
    const { container } = render(<App />);

    // Navigate programmatically (React Router v6)
    window.history.pushState({}, 'Home', '/home');

    await waitFor(() => {
      expect(screen.getByText('HomeScreen Mock')).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});
