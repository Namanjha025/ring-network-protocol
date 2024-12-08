import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Container,
  Typography,
} from '@mui/material';
import Inbox from './Inbox';
import Store from './Store';
import MessageForm from './MessageForm';

const MessagesPage = ({ nodes, onSendMessage }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Messages
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left side - Message Form */}
        <Box sx={{ width: '35%' }}>
          <MessageForm
            nodes={nodes}
            onSendMessage={onSendMessage}
          />
        </Box>

        {/* Right side - Inbox and Store */}
        <Box sx={{ width: '65%' }}>
          <Paper sx={{ mb: 2 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
            >
              <Tab label="Inbox" />
              <Tab label="Archive" />
            </Tabs>
          </Paper>

          <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
            <Inbox nodes={nodes} />
          </Box>
          <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
            <Store nodes={nodes} />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default MessagesPage; 