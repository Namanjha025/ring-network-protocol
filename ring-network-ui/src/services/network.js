import { axiosInstance } from './auth';

const networkService = {
  // Node operations
  getAllNodes: async () => {
    try {
      const response = await axiosInstance.get('/nodes');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch nodes');
    }
  },

  getNodeById: async (nodeId) => {
    try {
      const response = await axiosInstance.get(`/nodes/${nodeId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch node');
    }
  },

  createNode: async (nodeData) => {
    try {
      const response = await axiosInstance.post('/nodes', nodeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to create node');
    }
  },

  updateNodeNeighbors: async (nodeId, leftNeighborId, rightNeighborId) => {
    try {
      const response = await axiosInstance.put(`/nodes/${nodeId}/neighbors`, null, {
        params: { leftNeighborId, rightNeighborId }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to update node neighbors');
    }
  },

  updateNodeStatus: async (nodeId, status) => {
    try {
      const response = await axiosInstance.put(`/nodes/${nodeId}/status`, null, {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to update node status');
    }
  },

  deleteNode: async (nodeId) => {
    try {
      await axiosInstance.delete(`/nodes/${nodeId}`);
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to delete node');
    }
  },

  // Message operations
  getAllMessages: async () => {
    try {
      const response = await axiosInstance.get('/messages');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch messages');
    }
  },

  createMessage: async (messageData) => {
    try {
      const response = await axiosInstance.post('/messages', messageData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to create message');
    }
  },

  getMessageById: async (messageId) => {
    try {
      const response = await axiosInstance.get(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch message');
    }
  },

  getMessageHistory: async (messageId) => {
    try {
      const response = await axiosInstance.get(`/messages/${messageId}/history`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch message history');
    }
  },

  retryMessage: async (messageId) => {
    try {
      const response = await axiosInstance.post(`/messages/${messageId}/retry`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to retry message');
    }
  },

  // Inbox operations
  storeMessageInInbox: async (nodeId, messageId) => {
    try {
      const response = await axiosInstance.post(`/messages/${nodeId}/inbox/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to store message in inbox');
    }
  },

  getMessageFromInbox: async (nodeId, messageId) => {
    try {
      const response = await axiosInstance.get(`/messages/${nodeId}/inbox/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch message from inbox');
    }
  },

  // Store operations
  storeMessageInStore: async (nodeId, messageId) => {
    try {
      const response = await axiosInstance.post(`/messages/${nodeId}/store/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to store message');
    }
  },

  getMessageFromStore: async (nodeId, messageId) => {
    try {
      const response = await axiosInstance.get(`/messages/${nodeId}/store/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch message from store');
    }
  },

  // System buffer operations
  storeMessageInSystemBuffer: async (messageId, bufferSize, nodeId, status) => {
    try {
      const response = await axiosInstance.post(`/messages/system-buffer/${messageId}`, null, {
        params: { bufferSize, nodeId, status }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to store message in system buffer');
    }
  },

  getMessageFromSystemBuffer: async (messageId) => {
    try {
      const response = await axiosInstance.get(`/messages/system-buffer/${messageId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch message from system buffer');
    }
  },

  updateSystemBufferStatus: async (messageId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/messages/system-buffer/${messageId}/status`, null, {
        params: { newStatus }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to update message status');
    }
  },

  deleteMessageFromSystemBuffer: async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/system-buffer/${messageId}`);
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to delete message from system buffer');
    }
  },

  // Node statistics
  getNodeStatistics: async (nodeId) => {
    try {
      const response = await axiosInstance.get(`/nodes/${nodeId}/statistics`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch node statistics');
    }
  },

  // System statistics
  getSystemStatistics: async () => {
    try {
      const response = await axiosInstance.get('/system/statistics');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch system statistics');
    }
  }
};

export default networkService; 