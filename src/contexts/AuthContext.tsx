import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI, checkBackendHealth } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profilePic?: string;
  reputationPoints?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updatedUser: User) => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [useBackend, setUseBackend] = useState(false);

  // Check backend availability and restore session on mount
  useEffect(() => {
    const initAuth = async () => {
      const backendAvailable = await checkBackendHealth();
      setUseBackend(backendAvailable);

      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('user');

      if (backendAvailable && savedToken) {
        try {
          const data: any = await authAPI.getMe();
          if (data.user) {
            setUser(data.user);
            setToken(savedToken);
          }
        } catch {
          localStorage.removeItem('auth_token');
          setToken(null);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } else if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (useBackend) {
        const data: any = await authAPI.login(email, password);
        if (data.user && data.token) {
          localStorage.setItem('auth_token', data.token);
          setToken(data.token);
          setUser(data.user);
          return true;
        }
        return false;
      }

      // Fallback to localStorage
      const savedUsers = localStorage.getItem('registeredUsers');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      const foundUser = users.find((u: User) => u.email === email);

      if (foundUser) {
        setUser(foundUser);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      if (useBackend) {
        const data: any = await authAPI.register(name, email, phone, password);
        if (data.user && data.token) {
          localStorage.setItem('auth_token', data.token);
          setToken(data.token);
          setUser(data.user);
          return true;
        }
        return false;
      }

      // Fallback to localStorage
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        phone,
      };

      const savedUsers = localStorage.getItem('registeredUsers');
      const users = savedUsers ? JSON.parse(savedUsers) : [];
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      setUser(newUser);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  const updateProfile = async (updatedUser: User) => {
    try {
      if (useBackend) {
        const data: any = await authAPI.updateProfile({
          name: updatedUser.name,
          phone: updatedUser.phone,
          profilePic: updatedUser.profilePic,
        });
        if (data.user) {
          setUser(data.user);
          return;
        }
      }

      // Fallback to localStorage
      setUser(updatedUser);
      const savedUsers = localStorage.getItem('registeredUsers');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const idx = users.findIndex((u: User) => u.id === updatedUser.id);
        if (idx !== -1) {
          users[idx] = updatedUser;
          localStorage.setItem('registeredUsers', JSON.stringify(users));
        }
      }
    } catch {
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        isLoading,
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
