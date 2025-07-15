import apiClient from './api';
import { Hero } from '@/types';

export const getHero = async (): Promise<Hero> => {
  const response = await apiClient.get('/hero');
  return response.data;
};

export const updateHero = async (heroData: Partial<Hero>): Promise<Hero> => {
  const response = await apiClient.put('/hero', heroData);
  return response.data;
};
