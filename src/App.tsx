// src/App.tsx
import { useEffect, useMemo, useState, Suspense, lazy } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar/Navbar';
import Welcome from './components/welcome/Welcome';
import AuthDialog from './components/auth/AuthDialog';
import ErrorBoundary from './components/ErroBoundary/ErrorBoundary';

const Loader = () => <div>Loading...</div>; // Simple loader component

// Lazy-loaded components
const HomeScreen = lazy(() => import('./components/Homepage/HomeScreen'));

const App = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    document.body.setAttribute('data-mui-color-scheme', themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: '#7c3aed',
          },
          background: {
            default: themeMode === 'light' ? '#ffffff' : '#09090b',
            paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: themeMode === 'light' ? '#09090b' : '#ffffff',
          },
        },
      }),
    [themeMode]
  );

  const handleOpenDialog = (tab: 'login' | 'register') => {
    setDefaultTab(tab);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* Landing page */}
            <Route
              path="/"
              element={
                <>
                  <Navbar onToggleTheme={toggleTheme} themeMode={themeMode} />
                  <Welcome
                    onLogin={() => handleOpenDialog('login')}
                    onRegister={() => handleOpenDialog('register')}
                  />
                  {isDialogOpen && (
                    <AuthDialog
                      open={isDialogOpen}
                      onClose={handleCloseDialog}
                      defaultTab={defaultTab}
                    />
                  )}
                </>
              }
            />

            {/* Home page - lazy loaded */}
            <Route
              path="/home"
              element={
                <Suspense fallback={<Loader />}>
                  <HomeScreen />
                </Suspense>
              }
            />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
