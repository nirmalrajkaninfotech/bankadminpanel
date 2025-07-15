import apiClient from './api';
import { QuickServicesContent } from '@/types';

export const getQuickServices = async (): Promise<QuickServicesContent> => {
  const response = await apiClient.get('/quick-services');
  return response.data;
};

export const updateQuickServices = async (data: Partial<QuickServicesContent>): Promise<QuickServicesContent> => {
  const response = await apiClient.put('/quick-services', data);
  return response.data;
};
