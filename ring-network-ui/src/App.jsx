import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from 'react';

import Login from './components/auth/Login';
import Dashboard from './components/Dashboard';
import NetworkGraph from './components/network/NetworkGraph';
import MessageForm from './components/messages/MessageForm';
import MessageTracking from './components/messages/MessageTracking';
import Inbox from './components/messages/Inbox';
import Store from './components/messages/Store';
import SystemBuffer from './components/admin/SystemBuffer';
import AdminPanel from './components/admin/AdminPanel';
import UserManagement from './components/admin/UserManagement';
import SystemStatistics from './components/admin/SystemStatistics';
import TestConnection from './components/TestConnection';
import authService from './services/auth';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          const isValid = await authService.verifySession();
          setIsAuthenticated(isValid);
          setUserRole(user.role);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/dashboard/*"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          >
            <Route index element={<NetworkGraph />} />
            <Route path="network" element={<NetworkGraph />} />
            <Route path="message" element={<MessageForm />} />
            <Route path="tracking" element={<MessageTracking />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="store" element={<Store />} />
            <Route path="system-buffer" element={<SystemBuffer />} />
            
            {/* Admin-only routes */}
            <Route
              path="users"
              element={
                userRole === 'ADMIN' ? (
                  <UserManagement />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            <Route
              path="admin"
              element={
                userRole === 'ADMIN' ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            <Route
              path="statistics"
              element={
                userRole === 'ADMIN' ? (
                  <SystemStatistics />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            
            {/* Development-only routes */}
            {process.env.NODE_ENV === 'development' && (
              <Route path="test" element={<TestConnection />} />
            )}
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
