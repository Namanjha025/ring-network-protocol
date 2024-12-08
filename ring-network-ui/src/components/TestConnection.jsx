import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import networkService from '../services/network';
import authService from '../services/auth';

const TestConnection = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const runTests = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    const tests = [
      {
        name: 'Auth - Login',
        run: async () => {
          const response = await authService.login('admin', 'admin123');
          return `Login successful: ${JSON.stringify(response)}`;
        }
      },
      {
        name: 'Auth - Get Profile',
        run: async () => {
          const user = authService.getCurrentUser();
          const response = await authService.getProfile(user.username);
          return `Profile fetched: ${JSON.stringify(response)}`;
        }
      },
      {
        name: 'Nodes - Get All',
        run: async () => {
          const response = await networkService.getAllNodes();
          return `Nodes fetched: ${JSON.stringify(response)}`;
        }
      },
      {
        name: 'Nodes - Create Node',
        run: async () => {
          const response = await networkService.createNode({
            nodeId: 'N1',
            status: 'ACTIVE'
          });
          return `Node created: ${JSON.stringify(response)}`;
        }
      }
    ];

    try {
      for (const test of tests) {
        try {
          const result = await test.run();
          setResults(prev => [...prev, { name: test.name, result, success: true }]);
        } catch (err) {
          setResults(prev => [...prev, { 
            name: test.name, 
            result: err.message, 
            success: false 
          }]);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Backend Integration Tests
      </Typography>

      <Button
        variant="contained"
        onClick={runTests}
        disabled={loading}
        sx={{ mb: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Run Tests'}
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3}>
        <List>
          {results.map((result, index) => (
            <ListItem key={index} divider={index < results.length - 1}>
              <ListItemText
                primary={result.name}
                secondary={result.result}
                sx={{
                  '& .MuiListItemText-primary': {
                    color: result.success ? 'success.main' : 'error.main',
                    fontWeight: 'bold'
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TestConnection; 