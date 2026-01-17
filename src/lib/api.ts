const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Custom error class for API errors
export class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Get auth token from localStorage
const getToken = (): string | null => {
  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

// Generic fetch wrapper with auth and error handling
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
  try {
    const token = getToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Validate response status
    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText || 'Unknown error' };
      }
      throw new APIError(
        `API request failed: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return response;
  } catch (error) {
    // Re-throw APIError as-is
    if (error instanceof APIError) {
      throw error;
    }
    // Handle network errors and other fetch failures
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new APIError('Network error: Unable to reach the server', 0, error);
    }
    // Re-throw unknown errors
    throw error;
  }
};

// Helper function to safely parse JSON response
const parseJSONResponse = async (response: Response): Promise<unknown> => {
  try {
    const text = await response.text();
    if (!text) {
      return null;
    }
    return JSON.parse(text);
  } catch (error) {
    throw new APIError(
      'Invalid JSON response from server',
      0,
      error
    );
  }
};

// Auth API
export const authAPI = {
  register: async (name: string, email: string, phone: string, password: string) => {
    try {
      const res = await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password }),
      });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const res = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getMe: async () => {
    try {
      const res = await fetchWithAuth('/auth/me');
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  },

  updateProfile: async (data: { name?: string; phone?: string; profilePic?: string }) => {
    try {
      const res = await fetchWithAuth('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
};

// Medical History API
export const medicalHistoryAPI = {
  get: async () => {
    try {
      const res = await fetchWithAuth('/medical-history');
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Get medical history error:', error);
      throw error;
    }
  },

  save: async (data: {
    bloodGroup: string;
    allergies: string;
    chronicConditions: string;
    surgeries: string;
    medications: string;
  }) => {
    try {
      const res = await fetchWithAuth('/medical-history', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Save medical history error:', error);
      throw error;
    }
  },
};

// Symptoms API
export const symptomsAPI = {
  getAll: async () => {
    try {
      const res = await fetchWithAuth('/symptoms');
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Get symptoms error:', error);
      throw error;
    }
  },

  create: async (data: {
    symptoms: string[];
    severity: string;
    notes: string;
    triageResult?: { level: string; recommendation: string };
  }) => {
    try {
      const res = await fetchWithAuth('/symptoms', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Create symptom error:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const res = await fetchWithAuth(`/symptoms/${id}`, { method: 'DELETE' });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Delete symptom error:', error);
      throw error;
    }
  },
};

// Reminders API
export const remindersAPI = {
  getAll: async () => {
    try {
      const res = await fetchWithAuth('/reminders');
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Get reminders error:', error);
      throw error;
    }
  },

  create: async (data: {
    title: string;
    type: string;
    date: string;
    time: string;
    recurrence: string;
    dosage?: string;
    enabled: boolean;
  }) => {
    try {
      const res = await fetchWithAuth('/reminders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Create reminder error:', error);
      throw error;
    }
  },

  update: async (id: string, data: Partial<{
    title: string;
    type: string;
    date: string;
    time: string;
    recurrence: string;
    dosage?: string;
    enabled: boolean;
  }>) => {
    try {
      const res = await fetchWithAuth(`/reminders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Update reminder error:', error);
      throw error;
    }
  },

  delete: async (id: string) => {
    try {
      const res = await fetchWithAuth(`/reminders/${id}`, { method: 'DELETE' });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Delete reminder error:', error);
      throw error;
    }
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    try {
      const res = await fetchWithAuth('/orders');
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

  create: async (data: {
    items: Array<{ productId: string; name: string; price: number; quantity: number }>;
    total: number;
    shippingAddress: { name: string; phone: string; address: string; pincode: string };
  }) => {
    try {
      const res = await fetchWithAuth('/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  getById: async (id: string) => {
    try {
      const res = await fetchWithAuth(`/orders/${id}`);
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  },

  cancel: async (id: string) => {
    try {
      const res = await fetchWithAuth(`/orders/${id}/cancel`, { method: 'PUT' });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  },
};

// Check if backend is available
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const res = await fetch(`${API_BASE_URL.replace('/api', '')}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return res.ok;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('Backend health check timeout');
    } else {
      console.error('Backend health check error:', error);
    }
    return false;
  }
};

// Appointments API
export const appointmentsAPI = {
  getDoctors: async (params?: { specialization?: string; search?: string }) => {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetchWithAuth(`/doctors${query ? '?' + query : ''}`);
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Get doctors error:', error);
      throw error;
    }
  },

  getDoctorById: async (id: string) => {
    try {
      const res = await fetchWithAuth(`/doctors/${id}`);
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Get doctor by ID error:', error);
      throw error;
    }
  },

  getAvailableSlots: async (doctorId: string, date: string) => {
    try {
      const res = await fetchWithAuth(`/doctors/${doctorId}/slots?date=${date}`);
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Get available slots error:', error);
      throw error;
    }
  },

  book: async (data: { doctorId: string; date: string; startTime: string; symptoms: string; type: string }) => {
    try {
      const res = await fetchWithAuth('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Book appointment error:', error);
      throw error;
    }
  },

  getMyAppointments: async () => {
    try {
      const res = await fetchWithAuth('/appointments/my');
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Get my appointments error:', error);
      throw error;
    }
  },

  cancel: async (id: string, reason?: string) => {
    try {
      const res = await fetchWithAuth(`/appointments/${id}/cancel`, {
        method: 'PUT',
        body: JSON.stringify({ reason }),
      });
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Cancel appointment error:', error);
      throw error;
    }
  },

  getVideoAccess: async (id: string) => {
    try {
      const res = await fetchWithAuth(`/appointments/${id}/video-access`);
      return await parseJSONResponse(res);
    } catch (error) {
      console.error('Get video access error:', error);
      throw error;
    }
  },
};

const api = {
  auth: authAPI,
  medicalHistory: medicalHistoryAPI,
  symptoms: symptomsAPI,
  reminders: remindersAPI,
  orders: ordersAPI,
  appointments: appointmentsAPI,
  checkHealth: checkBackendHealth,
};

export default api;
