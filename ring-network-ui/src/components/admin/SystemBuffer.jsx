import { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import networkService from '../../services/network';

const SystemBuffer = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await networkService.getSystemBuffer();
      setMessages(data);
    } catch (err) {
      setError('Failed to fetch system buffer');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (messageId) => {
    try {
      await networkService.deleteMessage(null, messageId);
      fetchMessages();
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  const handleRetry = async (messageId) => {
    try {
      await networkService.retryMessage(messageId);
      fetchMessages();
    } catch (err) {
      setError('Failed to retry message delivery');
    }
  };

  const getMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">
          System Buffer
        </Typography>
        <Button
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

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : messages.length > 0 ? (
        <List>
          {messages.map((message, index) => (
            <Box key={message.messageId}>
              {index > 0 && <Divider />}
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="retry"
                      onClick={() => handleRetry(message.messageId)}
                      sx={{ mr: 1 }}
                    >
                      <RefreshIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(message.messageId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <ErrorIcon color="error" />
                      <Typography variant="subtitle1">
                        From: Node {message.senderNode} → To: Node {message.receiverNode}
                      </Typography>
                      <Chip
                        size="small"
                        label={message.direction}
                        color={message.direction === 'LEFT' ? 'primary' : 'secondary'}
                      />
                      <Chip
                        size="small"
                        label={message.status}
                        color="error"
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {message.content}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Message ID: {message.messageId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Created: {getMessageTime(message.timeStampCreated)}
                      </Typography>
                      {message.path && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Failed Path: {message.path}
                        </Typography>
                      )}
                    </>
                  }
                />
              </ListItem>
            </Box>
          ))}
        </List>
      ) : (
        <Box p={3} textAlign="center">
          <Typography color="text.secondary">
            No messages in system buffer
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default SystemBuffer; 