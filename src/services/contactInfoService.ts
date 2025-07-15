import apiClient from './api';
import { ContactInfo } from '@/types';

export const getContactInfo = async (): Promise<ContactInfo> => {
  const response = await apiClient.get('/contact-info');
  return response.data;
};

export const updateContactInfo = async (data: Partial<ContactInfo>): Promise<ContactInfo> => {
  const response = await apiClient.put('/contact-info', data);
  return response.data;
};
