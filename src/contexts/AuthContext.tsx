import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<boolean>;
  logout: () => void;
  pendingVerification: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  });
  const [pendingVerification, setPendingVerification] = useState(false);
  const [tempUserData, setTempUserData] = useState<{ name: string; email: string; phone: string } | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate login - in production, connect to backend
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const savedUsers = localStorage.getItem('registeredUsers');
    let users = [];
    try {
      users = savedUsers ? JSON.parse(savedUsers) : [];
    } catch (error) {
      console.error('Error parsing registeredUsers from localStorage:', error);
      users = [];
    }
    const foundUser = users.find((u: any) => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setTempUserData({ name, email, phone });
    setPendingVerification(true);
    return true;
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Simulate OTP verification (accept any 6-digit code for demo)
    if (otp.length === 6 && tempUserData) {
      const newUser: User = {
        id: Date.now().toString(),
        ...tempUserData,
      };
      
      const savedUsers = localStorage.getItem('registeredUsers');
      let users = [];
      try {
        users = savedUsers ? JSON.parse(savedUsers) : [];
      } catch (error) {
        console.error('Error parsing registeredUsers from localStorage:', error);
        users = [];
      }
      users.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      
      setUser(newUser);
      setPendingVerification(false);
      setTempUserData(null);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        verifyOtp,
        logout,
        pendingVerification,
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
