import apiClient from './api';
import { Loan } from '@/types';

export const getLoans = async (): Promise<Loan[]> => {
  const response = await apiClient.get('/loans');
  return response.data;
};

export const createLoan = async (loanData: FormData): Promise<Loan> => {
  const response = await apiClient.post('/loans', loanData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateLoan = async (id: number, loanData: FormData): Promise<Loan> => {
  const response = await apiClient.put(`/loans/${id}`, loanData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteLoan = async (id: number): Promise<void> => {
  await apiClient.delete(`/loans/${id}`);
};
