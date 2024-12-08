import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for Basic Auth
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.username) {
      config.headers.Authorization = `Basic ${btoa(`${user.username}:${user.password}`)}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  login: async (username, password) => {
    try {
      const loginData = {
        username,
        userPassword: password
      };
      
      const response = await axiosInstance.post('/auth/login', loginData);
      if (response.data === "Login successful") {
        const userData = {
          username,
          password,
          role: 'OPERATOR'
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Get user profile to update role
        const profileResponse = await axiosInstance.get(`/auth/${username}/profile`);
        if (profileResponse.data) {
          userData.role = profileResponse.data.role;
          localStorage.setItem('user', JSON.stringify(userData));
        }
        return userData;
      }
      throw new Error('Login failed');
    } catch (error) {
      throw new Error(error.response?.data || 'Login failed');
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } finally {
      localStorage.removeItem('user');
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        username: userData.username,
        userPassword: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: userData.role || 'OPERATOR'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Registration failed');
    }
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  changePassword: async (username, newPassword) => {
    try {
      const response = await axiosInstance.put(`/auth/${username}/change-password`, null, {
        params: { newPassword }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to change password');
    }
  },

  getProfile: async (username) => {
    try {
      const response = await axiosInstance.get(`/auth/${username}/profile`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to fetch profile');
    }
  },

  assignRole: async (username, role) => {
    try {
      const response = await axiosInstance.put(`/auth/${username}/role`, null, {
        params: { role }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data || 'Failed to assign role');
    }
  },

  verifySession: async () => {
    try {
      const response = await axiosInstance.get('/auth/verify');
      return response.data === "Token is valid";
    } catch (error) {
      return false;
    }
  }
};

export { axiosInstance };
export default authService; 