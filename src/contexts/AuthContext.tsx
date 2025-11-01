import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, LoginFormData, RegisterFormData } from '../types';
import { authService } from '../services/authService';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('access_token');

    if (accessToken && storedUser) {
      setUser(JSON.parse(storedUser));
      validateToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      await authService.getProfile();
      setIsLoading(false);
    } catch (error) {
      // Token inválido, fazer logout
      logout();
    }
  };

  const login = async (formData: LoginFormData) => {
    try {
      const { access, refresh, user } = await authService.login(formData);

      setUser(user);
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (formData: RegisterFormData) => {
    try {
      const { access, refresh, user } = await authService.register(formData);

      setUser(user);
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};