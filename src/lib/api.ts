const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem("auth_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || "Request failed" };
    }

    return { data };
  } catch (error) {
    console.error("API request failed:", error);
    return { error: "Network error. Please try again." };
  }
}

export const authApi = {
  register: (name: string, email: string, phone: string, password: string) =>
    apiRequest<{ user: User; token: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, password })
    }),

  login: (email: string, password: string) =>
    apiRequest<{ user: User; token: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),

  getMe: () => apiRequest<{ user: User }>("/api/auth/me"),

  updateProfile: (data: { name?: string; phone?: string; profilePic?: string }) =>
    apiRequest<{ user: User }>("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest<{ message: string }>("/api/auth/password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword })
    })
};

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
}
