import apiClient from './api';
import { Footer } from '@/types';

export const getFooter = async (): Promise<Footer> => {
  const response = await apiClient.get('/footer');
  return response.data;
};

export const updateFooter = async (footerData: Partial<Footer>): Promise<Footer> => {
  const response = await apiClient.put('/footer', footerData);
  return response.data;
};
