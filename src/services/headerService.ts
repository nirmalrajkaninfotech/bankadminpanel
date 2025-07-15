import apiClient from './api';
import { Header } from '@/types';

export const getHeader = async (): Promise<Header> => {
  const response = await apiClient.get('/header');
  return response.data;
};

export const updateHeader = async (headerData: Partial<Header>): Promise<Header> => {
  const response = await apiClient.put('/header', headerData);
  return response.data;
};
