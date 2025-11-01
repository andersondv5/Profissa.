import api from './api';
import { User, LoginFormData, RegisterFormData, AuthResponse } from '../types';

export const authService = {
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await api.post<{ access: string; refresh: string }>('/token/', credentials);
      const { access, refresh } = response.data;

      // Buscar dados do usuário
      const userResponse = await api.get<User>('/users/me/');
      const user = userResponse.data;

      return { access, refresh, user };
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  },

  async register(userData: RegisterFormData): Promise<AuthResponse> {
    try {
      // Registrar usuário
      await api.post('/register/', userData);
      
      // Fazer login automaticamente após registro
      return await this.login({
        username: userData.username,
        password: userData.password
      });
    } catch (error: any) {
      const errorDetail = error.response?.data;
      let errorMessage = 'Registration failed';
      
      if (errorDetail) {
        if (errorDetail.username) errorMessage = `Username: ${errorDetail.username[0]}`;
        else if (errorDetail.email) errorMessage = `Email: ${errorDetail.email[0]}`;
        else if (errorDetail.password) errorMessage = `Password: ${errorDetail.password[0]}`;
      }
      
      throw new Error(errorMessage);
    }
  },

  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/users/me/');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to get profile');
    }
  },

  async refreshToken(refresh: string): Promise<{ access: string }> {
    try {
      const response = await api.post<{ access: string }>('/token/refresh/', { refresh });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Token refresh failed');
    }
  }
};