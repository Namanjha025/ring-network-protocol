import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  Alert,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  History as HistoryIcon,
  RestartAlt as RetryIcon,
} from '@mui/icons-material';
import networkService from '../../services/network';

const MessageTracking = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [openHistory, setOpenHistory] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await networkService.getAllMessages();
      setMessages(response);
    } catch (err) {
      setError('Failed to fetch messages');
    }
  };

  const handleRetryMessage = async (messageId) => {
    setLoading(true);
    try {
      await networkService.retryMessage(messageId);
      setSuccess('Message retry initiated');
      fetchMessages();
    } catch (err) {
      setError('Failed to retry message');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async (message) => {
    setSelectedMessage(message);
    try {
      const history = await networkService.getMessageHistory(message.messageId);
      setSelectedMessage({ ...message, history });
      setOpenHistory(true);
    } catch (err) {
      setError('Failed to fetch message history');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'success';
      case 'IN_TRANSIT':
        return 'info';
      case 'FAILED':
        return 'error';
      case 'BUFFERED':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Message Tracking</Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchMessages}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Message ID</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Destination</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.messageId}>
                <TableCell>{message.messageId}</TableCell>
                <TableCell>{message.sourceNodeId}</TableCell>
                <TableCell>{message.destinationNodeId}</TableCell>
                <TableCell>
                  <Chip
                    label={message.status}
                    color={getStatusColor(message.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(message.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="View History">
                    <IconButton onClick={() => handleViewHistory(message)}>
                      <HistoryIcon />
                    </IconButton>
                  </Tooltip>
                  {message.status === 'FAILED' && (
                    <Tooltip title="Retry Message">
                      <IconButton 
                        onClick={() => handleRetryMessage(message.messageId)}
                        disabled={loading}
                      >
                        <RetryIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openHistory} onClose={() => setOpenHistory(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Message History - {selectedMessage?.messageId}
        </DialogTitle>
        <DialogContent>
          {selectedMessage?.history ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Node</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedMessage.history.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(entry.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={entry.status}
                          color={getStatusColor(entry.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{entry.nodeId}</TableCell>
                      <TableCell>{entry.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>No history available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MessageTracking; 