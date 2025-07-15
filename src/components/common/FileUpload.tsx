import React, { ChangeEvent, useState } from 'react';
import { ImageField } from '@/types';

interface FileUploadProps {
  file?: ImageField;
  onChange: (file: File) => void;
  previewUrl?: string;
  accept?: string;
}

export const FileUpload = ({ file, onChange, previewUrl, accept }: FileUploadProps) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {previewUrl && (
        <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div>
        <label className="cursor-pointer bg-white py-2 px-3 rounded-md border border-gray-300 shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          {file ? 'Change File' : 'Upload File'}
          <input 
            type="file" 
            className="sr-only" 
            onChange={handleFileChange}
            accept={accept}
          />
        </label>
      </div>
    </div>
  );
};
