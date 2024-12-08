import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import networkService from '../../services/network';

const SystemStatistics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [nodeStats, setNodeStats] = useState([]);

  useEffect(() => {
    fetchStatistics();
    const interval = setInterval(fetchStatistics, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStatistics = async () => {
    try {
      const [systemStats, nodes] = await Promise.all([
        networkService.getSystemStatistics(),
        networkService.getAllNodes()
      ]);

      setStats(systemStats);

      // Fetch statistics for each node
      const nodeStatsPromises = nodes.map(node => 
        networkService.getNodeStatistics(node.nodeId)
      );
      const nodeStatsResults = await Promise.all(nodeStatsPromises);
      setNodeStats(nodeStatsResults);

      setError('');
    } catch (err) {
      setError('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        System Statistics
      </Typography>

      <Grid container spacing={3}>
        {/* System Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Overview
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Total Nodes" 
                  secondary={stats?.totalNodes || 0} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Active Nodes" 
                  secondary={stats?.activeNodes || 0} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Messages in Transit" 
                  secondary={stats?.messagesInTransit || 0} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="System Buffer Size" 
                  secondary={stats?.systemBufferSize || 0} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Message Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Message Statistics
            </Typography>
            <List>
              <ListItem>
                <ListItemText 
                  primary="Total Messages" 
                  secondary={stats?.totalMessages || 0} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Delivered Messages" 
                  secondary={stats?.deliveredMessages || 0} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Failed Messages" 
                  secondary={stats?.failedMessages || 0} 
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText 
                  primary="Average Delivery Time" 
                  secondary={`${stats?.avgDeliveryTime || 0} ms`} 
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Node Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Node Performance
            </Typography>
            <Timeline>
              {nodeStats.map((nodeStat, index) => (
                <TimelineItem key={nodeStat.nodeId}>
                  <TimelineSeparator>
                    <TimelineDot color={nodeStat.status === 'ACTIVE' ? 'success' : 'error'} />
                    {index < nodeStats.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">
                          Node {nodeStat.nodeId}
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemText 
                              primary="Messages Processed" 
                              secondary={nodeStat.messagesProcessed} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Inbox Size" 
                              secondary={nodeStat.inboxSize} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Store Size" 
                              secondary={nodeStat.storeSize} 
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemText 
                              primary="Processing Time" 
                              secondary={`${nodeStat.avgProcessingTime} ms`} 
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemStatistics; 