import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updatedUser: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const { data, error } = await authApi.getMe();
        if (data && !error) {
          setUser(data.user);
        } else {
          // Token invalid, clear it
          localStorage.removeItem('auth_token');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await authApi.login(email, password);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      return { success: true };
    }

    return { success: false, error: 'Unknown error occurred' };
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await authApi.register(name, email, phone, password);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
      return { success: true };
    }

    return { success: false, error: 'Unknown error occurred' };
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await authApi.updateProfile(updates);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      setUser(data.user);
      return { success: true };
    }

    return { success: false, error: 'Unknown error occurred' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
