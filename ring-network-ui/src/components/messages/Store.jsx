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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  TextField,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import networkService from '../../services/network';

const Store = ({ nodes }) => {
  const [selectedNode, setSelectedNode] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (selectedNode) {
      fetchMessages();
    }
  }, [selectedNode]);

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await networkService.getNodeStore(selectedNode);
      setMessages(data);
    } catch (err) {
      setError('Failed to fetch archived messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await networkService.deleteMessage(selectedNode, messageId);
      fetchMessages();
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  const getMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredMessages = messages.filter(message => 
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.senderNode.toString().includes(searchTerm) ||
    message.messageId.includes(searchTerm)
  );

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Message Store
      </Typography>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Select Node</InputLabel>
        <Select
          value={selectedNode}
          label="Select Node"
          onChange={(e) => setSelectedNode(e.target.value)}
        >
          {nodes.map((node) => (
            <MenuItem key={node.nodeId} value={node.nodeId}>
              Node {node.nodeId}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedNode && (
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          sx={{ mb: 3 }}
        />
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : filteredMessages.length > 0 ? (
        <List>
          {filteredMessages.map((message, index) => (
            <Box key={message.messageId}>
              {index > 0 && <Divider />}
              <ListItem
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(message.messageId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <EmailIcon color="primary" />
                      <Typography variant="subtitle1">
                        From: Node {message.senderNode}
                      </Typography>
                      <Chip
                        size="small"
                        label={message.direction}
                        color={message.direction === 'LEFT' ? 'primary' : 'secondary'}
                      />
                      <Chip
                        size="small"
                        label={message.status}
                        color="default"
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
                        {message.timeStampReceived && ` • Received: ${getMessageTime(message.timeStampReceived)}`}
                      </Typography>
                      {message.path && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Path: {message.path}
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
            {selectedNode 
              ? searchTerm 
                ? 'No messages found matching your search'
                : 'No archived messages'
              : 'Select a node to view archived messages'
            }
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default Store; 