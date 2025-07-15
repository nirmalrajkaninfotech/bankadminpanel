"use client";

import React, { useEffect, useState } from 'react';
import { getLoans, deleteLoan } from '@/services/loanService';
import { Loan } from '@/types';
import LoanForm from '@/components/loans/LoanForm';
import baseURL from '@/services/api';

const LoansPage = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getLoans();
      setLoans(data);
    } catch (err) {
      setError('Failed to fetch loans. Please make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleAdd = () => {
    setSelectedLoan(null);
    setIsModalOpen(true);
  };

  const handleEdit = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await deleteLoan(id);
        fetchLoans(); // Refresh the list
      } catch (err) {
        setError('Failed to delete loan.');
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchLoans();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Loans</h1>
        <button 
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Loan
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">{selectedLoan ? 'Edit Loan' : 'Add New Loan'}</h2>
            <LoanForm 
              loan={selectedLoan}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isLoading && <p>Loading loans...</p>}
      {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          {loans.length > 0 ? (
            loans.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <img src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${loan.image}`} alt={loan.title_en} className="w-24 h-16 object-cover rounded-md mr-4" />
                  <div>
                    <h3 className="font-semibold">{loan.title_en} / {loan.title_ta}</h3>
                    <p className="text-sm text-gray-600">{loan.description_en} / {loan.description_ta}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(loan)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(loan.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No loans found. Click "Add New Loan" to create one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoansPage;
