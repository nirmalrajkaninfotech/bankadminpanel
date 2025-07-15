import apiClient from './api';
import { Announcement } from '@/types';

export const getAnnouncements = async (): Promise<Announcement[]> => {
  const response = await apiClient.get('/announcements');
  return response.data;
};

export const createAnnouncement = async (data: Partial<Announcement>): Promise<Announcement> => {
  const response = await apiClient.post('/announcements', data);
  return response.data;
};

export const updateAnnouncement = async (id: number, data: Partial<Announcement>): Promise<Announcement> => {
  const response = await apiClient.put(`/announcements/${id}`, data);
  return response.data;
};

export const deleteAnnouncement = async (id: number): Promise<void> => {
  await apiClient.delete(`/announcements/${id}`);
};
