import { useState, useEffect } from 'react';
import {
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  FormHelperText,
  CircularProgress,
} from '@mui/material';

const MessageForm = ({ nodes, onSendMessage, selectedNode }) => {
  const [message, setMessage] = useState({
    receiverNode: '',
    content: '',
    direction: 'LEFT',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validation, setValidation] = useState({
    receiverNode: '',
    content: '',
  });

  useEffect(() => {
    if (selectedNode) {
      setMessage(prev => ({
        ...prev,
        receiverNode: selectedNode.id
      }));
    }
  }, [selectedNode]);

  const validateForm = () => {
    const newValidation = {
      receiverNode: '',
      content: '',
    };
    let isValid = true;

    if (!message.receiverNode) {
      newValidation.receiverNode = 'Please select a receiver node';
      isValid = false;
    }

    if (!message.content.trim()) {
      newValidation.content = 'Message content cannot be empty';
      isValid = false;
    } else if (message.content.length > 500) {
      newValidation.content = 'Message content cannot exceed 500 characters';
      isValid = false;
    }

    setValidation(newValidation);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessage(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validation[name]) {
      setValidation(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSendMessage(message);
      setSuccess('Message sent successfully!');
      setMessage({
        receiverNode: selectedNode?.id || '',
        content: '',
        direction: 'LEFT',
      });
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const activeNodes = nodes.filter(node => node.status === 'ACTIVE');

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Send Message
      </Typography>

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

      <Box component="form" onSubmit={handleSubmit}>
        <FormControl 
          fullWidth 
          sx={{ mb: 2 }}
          error={!!validation.receiverNode}
        >
          <InputLabel>Receiver Node</InputLabel>
          <Select
            name="receiverNode"
            value={message.receiverNode}
            label="Receiver Node"
            onChange={handleChange}
            required
          >
            {activeNodes.map((node) => (
              <MenuItem 
                key={node.nodeId} 
                value={node.nodeId}
                disabled={node.status !== 'ACTIVE'}
              >
                Node {node.nodeId} {node.status !== 'ACTIVE' && '(Inactive)'}
              </MenuItem>
            ))}
          </Select>
          {validation.receiverNode && (
            <FormHelperText>{validation.receiverNode}</FormHelperText>
          )}
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={4}
          name="content"
          label="Message Content"
          value={message.content}
          onChange={handleChange}
          required
          error={!!validation.content}
          helperText={validation.content || `${message.content.length}/500 characters`}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Direction</InputLabel>
          <Select
            name="direction"
            value={message.direction}
            label="Direction"
            onChange={handleChange}
            required
          >
            <MenuItem value="LEFT">Left</MenuItem>
            <MenuItem value="RIGHT">Right</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
      </Box>
    </Paper>
  );
};

export default MessageForm; 