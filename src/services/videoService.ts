import apiClient from './api';
import { Video } from '@/types';

export const getVideos = async (): Promise<Video[]> => {
  const response = await apiClient.get('/videos');
  return response.data;
};

export const createVideo = async (data: Partial<Video>): Promise<Video> => {
  const response = await apiClient.post('/videos', data);
  return response.data;
};

export const updateVideo = async (id: number, data: Partial<Video>): Promise<Video> => {
  const response = await apiClient.put(`/videos/${id}`, data);
  return response.data;
};

export const deleteVideo = async (id: number): Promise<void> => {
  await apiClient.delete(`/videos/${id}`);
};
