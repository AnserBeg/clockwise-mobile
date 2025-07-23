import axios from 'axios';

const BASE_URL = 'https://soft-sme-backend.onrender.com';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sessionToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
};

// Time Tracking API
export const timeTrackingAPI = {
  getTimeEntries: async (date: string) => {
    const response = await api.get(`/api/time-tracking/time-entries?date=${date}`);
    return response.data;
  },
  
  clockIn: async (profileId: string, soId: string) => {
    const response = await api.post('/api/time-tracking/time-entries/clock-in', {
      profile_id: profileId,
      so_id: soId,
    });
    return response.data;
  },
  
  clockOut: async (entryId: string) => {
    const response = await api.post(`/api/time-tracking/time-entries/${entryId}/clock-out`);
    return response.data;
  },
  
  getProfiles: async () => {
    const response = await api.get('/api/time-tracking/profiles');
    return response.data;
  },
  
  getSalesOrders: async () => {
    const response = await api.get('/api/time-tracking/sales-orders');
    return response.data;
  },
};

export default api;