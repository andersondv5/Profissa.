export interface AuthContextType {
  user: User | null;
  login: (formData: LoginFormData) => Promise<void>; // Mudar aqui
  register: (formData: RegisterFormData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user: number; // ID do usuário
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  completed?: boolean;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}