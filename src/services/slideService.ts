import apiClient from './api';
import { Slide } from '@/types';

export const getSlides = async (): Promise<Slide[]> => {
  const response = await apiClient.get('/slides');
  return response.data;
};

export const createSlide = async (slideData: FormData): Promise<Slide> => {
  const response = await apiClient.post('/slides', slideData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateSlide = async (id: number, slideData: FormData): Promise<Slide> => {
  const response = await apiClient.put(`/slides/${id}`, slideData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteSlide = async (id: number): Promise<void> => {
  await apiClient.delete(`/slides/${id}`);
};
