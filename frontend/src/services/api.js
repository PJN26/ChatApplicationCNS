import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * 🔐 AUTHENTICATION API
 */
export const authAPI = {
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async (userId) => {
    const response = await api.post('/auth/logout', { userId });
    return response.data;
  }
};

/**
 * 👤 USER API
 */
export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  
  searchUsers: async (query) => {
    const response = await api.get(`/users/search/${query}`);
    return response.data;
  }
};

/**
 * 💬 MESSAGE API
 */
export const messageAPI = {
  getMessages: async (userId) => {
    const response = await api.get(`/messages/${userId}`);
    return response.data;
  },
  
  saveMessage: async (receiverID, encryptedPayload, iv, hmac) => {
    const response = await api.post('/messages', {
      receiverID,
      encryptedPayload,
      iv,
      hmac
    });
    return response.data;
  },
  
  markAsDelivered: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/delivered`);
    return response.data;
  },
  
  markAsRead: async (messageId) => {
    const response = await api.put(`/messages/${messageId}/read`);
    return response.data;
  }
};

export default api;
