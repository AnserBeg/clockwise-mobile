import axios from 'axios';

const BASE_URL = '/api';

// Create axios instance with optimized configuration
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout for tunnel connections
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
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Time Tracking API
export const timeTrackingAPI = {
  getTimeEntries: async (date: string) => {
    const response = await api.get(`/time-tracking/time-entries?date=${date}`);
    return response.data;
  },
  
  getActiveTimeEntries: async () => {
    try {
      const response = await api.get('/time-tracking/time-entries/active');
      return response.data;
    } catch (error) {
      // If the endpoint doesn't exist, return empty array
      console.log('Active entries endpoint not available, returning empty array');
      return [];
    }
  },
  
  clockIn: async (profileId: string, soId: string) => {
    const response = await api.post('/time-tracking/time-entries/clock-in', {
      profile_id: profileId,
      so_id: soId,
    });
    return response.data;
  },
  
  clockOut: async (entryId: string) => {
    const response = await api.post(`/time-tracking/time-entries/${entryId}/clock-out`);
    return response.data;
  },
  
  getProfiles: async () => {
    const response = await api.get('/time-tracking/mobile/profiles');
    return response.data;
  },
  
  getSalesOrders: async () => {
    const response = await api.get('/time-tracking/sales-orders');
    return response.data;
  },
};

// Leave Management API
export const leaveManagementAPI = {
  submitRequest: async (data: {
    profile_id: number;
    request_type: 'vacation' | 'sick' | 'personal' | 'bereavement';
    start_date: string;
    end_date: string;
    reason?: string;
  }) => {
    const response = await api.post('/leave-management/request', data);
    return response.data;
  },
  
  getMyRequests: async () => {
    const response = await api.get('/leave-management/my-requests');
    return response.data;
  },
  
  getAllRequests: async () => {
    const response = await api.get('/leave-management/all-requests');
    return response.data;
  },
  
  getCalendar: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await api.get(`/leave-management/calendar?${params.toString()}`);
    return response.data;
  },
  
  approveRequest: async (requestId: number, adminNotes?: string, proposedStartDate?: string, proposedEndDate?: string) => {
    const response = await api.post(`/leave-management/approve/${requestId}`, {
      admin_notes: adminNotes,
      proposed_start_date: proposedStartDate,
      proposed_end_date: proposedEndDate
    });
    return response.data;
  },
  
  denyRequest: async (requestId: number, adminNotes?: string) => {
    const response = await api.post(`/leave-management/deny/${requestId}`, {
      admin_notes: adminNotes
    });
    return response.data;
  },
  
  proposeVacationDates: async (requestId: number, proposedStartDate: string, proposedEndDate: string, adminNotes?: string) => {
    const response = await api.post(`/leave-management/propose/${requestId}`, {
      proposed_start_date: proposedStartDate,
      proposed_end_date: proposedEndDate,
      admin_notes: adminNotes
    });
    return response.data;
  },
  
  acceptModifiedRequest: async (requestId: number) => {
    const response = await api.post(`/leave-management/accept-modified/${requestId}`);
    return response.data;
  },
  
  resendRequest: async (requestId: number, data?: {
    request_type?: 'vacation' | 'sick' | 'personal' | 'bereavement';
    start_date?: string;
    end_date?: string;
    reason?: string;
  }) => {
    const response = await api.post(`/leave-management/resend/${requestId}`, data);
    return response.data;
  }
};

export default api;