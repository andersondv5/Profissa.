import api from './api';
import { Task, TaskFormData } from '../types';

export interface TasksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

export const taskService = {
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await api.get<TasksResponse>('/tasks/');
      return response.data.results;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch tasks');
    }
  },

  async getTaskById(id: number): Promise<Task> {
    try {
      const response = await api.get<Task>(`/tasks/${id}/`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to fetch task');
    }
  },

  async createTask(taskData: TaskFormData): Promise<Task> {
    try {
      const response = await api.post<Task>('/tasks/', taskData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to create task');
    }
  },

  async updateTask(id: number, taskData: Partial<TaskFormData>): Promise<Task> {
    try {
      const response = await api.put<Task>(`/tasks/${id}/`, taskData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update task');
    }
  },

  async deleteTask(id: number): Promise<void> {
    try {
      await api.delete(`/tasks/${id}/`);
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to delete task');
    }
  },

  async toggleTaskComplete(id: number, completed: boolean): Promise<Task> {
    try {
      const response = await api.patch<Task>(`/tasks/${id}/`, { completed });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.detail || 'Failed to update task');
    }
  }
};