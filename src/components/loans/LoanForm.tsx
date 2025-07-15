import React, { useState, useEffect } from 'react';
import { Loan } from '@/types';
import { createLoan, updateLoan } from '@/services/loanService';

interface LoanFormProps {
  loan?: Loan | null;
  onSave: () => void;
  onCancel: () => void;
}

const LoanForm: React.FC<LoanFormProps> = ({ loan, onSave, onCancel }) => {
  const [titleEn, setTitleEn] = useState('');
  const [titleTa, setTitleTa] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionTa, setDescriptionTa] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (loan) {
      setTitleEn(loan.title_en);
      setTitleTa(loan.title_ta);
      setDescriptionEn(loan.description_en);
      setDescriptionTa(loan.description_ta);
    }
  }, [loan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const formData = new FormData();
    formData.append('title_en', titleEn);
    formData.append('title_ta', titleTa);
    formData.append('description_en', descriptionEn);
    formData.append('description_ta', descriptionTa);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (loan) {
        await updateLoan(loan.id, formData);
      } else {
        await createLoan(formData);
      }
      onSave();
    } catch (err) {
      setError('Failed to save loan. Please check the details and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Title (English)"
          value={titleEn}
          onChange={(e) => setTitleEn(e.target.value)}
          className="p-2 border rounded-md w-full"
          required
        />
        <input
          type="text"
          placeholder="Title (Tamil)"
          value={titleTa}
          onChange={(e) => setTitleTa(e.target.value)}
          className="p-2 border rounded-md w-full"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea
          placeholder="Description (English)"
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
          className="p-2 border rounded-md w-full"
          rows={3}
          required
        />
        <textarea
          placeholder="Description (Tamil)"
          value={descriptionTa}
          onChange={(e) => setDescriptionTa(e.target.value)}
          className="p-2 border rounded-md w-full"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {loan && <p className="text-xs text-gray-500 mt-1">Leave blank to keep the existing image.</p>}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Loan'}
        </button>
      </div>
    </form>
  );
};

export default LoanForm;
