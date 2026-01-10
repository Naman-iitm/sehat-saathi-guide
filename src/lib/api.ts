const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Generic fetch wrapper with auth
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
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

  return response;
};

// Auth API
export const authAPI = {
  register: async (name: string, email: string, phone: string, password: string) => {
    const res = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetchWithAuth('/auth/me');
    return res.json();
  },

  updateProfile: async (data: { name?: string; phone?: string; profilePic?: string }) => {
    const res = await fetchWithAuth('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// Medical History API
export const medicalHistoryAPI = {
  get: async () => {
    const res = await fetchWithAuth('/medical-history');
    return res.json();
  },

  save: async (data: {
    bloodGroup: string;
    allergies: string;
    chronicConditions: string;
    surgeries: string;
    medications: string;
  }) => {
    const res = await fetchWithAuth('/medical-history', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// Symptoms API
export const symptomsAPI = {
  getAll: async () => {
    const res = await fetchWithAuth('/symptoms');
    return res.json();
  },

  create: async (data: {
    symptoms: string[];
    severity: string;
    notes: string;
    triageResult?: { level: string; recommendation: string };
  }) => {
    const res = await fetchWithAuth('/symptoms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetchWithAuth(`/symptoms/${id}`, { method: 'DELETE' });
    return res.json();
  },
};

// Reminders API
export const remindersAPI = {
  getAll: async () => {
    const res = await fetchWithAuth('/reminders');
    return res.json();
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
    const res = await fetchWithAuth('/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
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
    const res = await fetchWithAuth(`/reminders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id: string) => {
    const res = await fetchWithAuth(`/reminders/${id}`, { method: 'DELETE' });
    return res.json();
  },
};

// Orders API
export const ordersAPI = {
  getAll: async () => {
    const res = await fetchWithAuth('/orders');
    return res.json();
  },

  create: async (data: {
    items: Array<{ productId: string; name: string; price: number; quantity: number }>;
    total: number;
    shippingAddress: { name: string; phone: string; address: string; pincode: string };
  }) => {
    const res = await fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getById: async (id: string) => {
    const res = await fetchWithAuth(`/orders/${id}`);
    return res.json();
  },

  cancel: async (id: string) => {
    const res = await fetchWithAuth(`/orders/${id}/cancel`, { method: 'PUT' });
    return res.json();
  },
};

// Check if backend is available
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${API_BASE_URL.replace('/api', '')}/health`);
    return res.ok;
  } catch {
    return false;
  }
};
