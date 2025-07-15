"use client";

import React, { useEffect, useState } from 'react';
import { getBeforeHeader, updateBeforeHeader } from '@/services/beforeHeaderService';
import { BeforeHeaderData, BeforeHeaderContact, MultiLangText } from '@/types';
import { ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { FileUpload } from '@/components/common/FileUpload';

// Define a custom type for image fields
type ImageField = string | File | null | undefined;

const BeforeHeaderPage = () => {
  const [data, setData] = useState<Partial<BeforeHeaderData>>({
    logo: { src: '', altTamil: '', altEnglish: '' },
    title: { tamil: '', english: '' },
    subtitle: { tamil: '', english: '' },
    yearsImage: { src: '', alt: '' },
    contacts: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Updated image URL function
  const getImageUrl = (srcField: ImageField): string => {
    if (!srcField) return '';
    if (typeof srcField === 'string') {
      const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || '';
      return baseUrl + srcField;
    }
    return URL.createObjectURL(srcField);
  };

  // Updated cleanup effect
  useEffect(() => {
    return () => {
      if (data.logo?.src && typeof data.logo.src !== 'string') {
        URL.revokeObjectURL(getImageUrl(data.logo.src));
      }
      if (data.yearsImage?.src && typeof data.yearsImage.src !== 'string') {
        URL.revokeObjectURL(getImageUrl(data.yearsImage.src));
      }
    };
  }, [data.logo, data.yearsImage]);

  // Updated file change handlers
  const handleLogoChange = (file: File) => {
    setData(prev => ({
      ...prev,
      logo: {
        ...(prev.logo || { altTamil: '', altEnglish: '' }),
        src: file
      }
    }));
  };

  const handleYearsImageChange = (file: File) => {
    setData(prev => ({
      ...prev,
      yearsImage: {
        ...(prev.yearsImage || { alt: '' }),
        src: file
      }
    }));
  };

  // Updated text input handlers
  const handleTextChange = (field: keyof BeforeHeaderData, subfield: string, value: string) => {
    setData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as object),
        [subfield]: value
      }
    }));
  };

  const handleContactChange = (index: number, field: keyof BeforeHeaderContact, value: string) => {
    const newContacts = [...(data.contacts || [])];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setData(prev => ({ ...prev, contacts: newContacts }));
  };

  const addContact = () => {
    const newContacts = [...(data.contacts || []), { type: '', value: '', display: '', href: '', icon: '' }];
    setData(prev => ({ ...prev, contacts: newContacts }));
  };

  const removeContact = (index: number) => {
    const newContacts = [...(data.contacts || [])];
    newContacts.splice(index, 1);
    setData(prev => ({ ...prev, contacts: newContacts }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getBeforeHeader();
        setData(response);
      } catch (err) {
        setError('Failed to fetch data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateBeforeHeader(data);
      setSuccess('Data updated successfully!');
    } catch (err) {
      setError('Failed to save data.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4">
          <h1 className="text-xl font-semibold text-white">Bank Header Configuration</h1>
        </div>
  
        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
  
          {/* Logo and Years Image Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo Card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Logo Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Logo Image</label>
                  <FileUpload 
                    file={data.logo?.src}
                    onChange={handleLogoChange}
                    previewUrl={data.logo?.src ? getImageUrl(data.logo.src) : undefined}
                    accept="image/*"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">English Alt Text</label>
                  <input
                    type="text"
                    value={data.logo?.altEnglish || ''}
                    onChange={e => handleTextChange('logo', 'altEnglish', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tamil Alt Text</label>
                  <input
                    type="text"
                    value={data.logo?.altTamil || ''}
                    onChange={e => handleTextChange('logo', 'altTamil', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
  
            {/* Years Image Card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Years Image Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years Image</label>
                  <FileUpload 
                    file={data.yearsImage?.src}
                    onChange={handleYearsImageChange}
                    previewUrl={data.yearsImage?.src ? getImageUrl(data.yearsImage.src) : undefined}
                    accept="image/*"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={data.yearsImage?.alt || ''}
                    onChange={e => handleTextChange('yearsImage', 'alt', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
  
          {/* Text Content Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Text Content</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Title</label>
                <input
                  type="text"
                  value={data.title?.english || ''}
                  onChange={e => handleTextChange('title', 'english', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tamil Title</label>
                <input
                  type="text"
                  value={data.title?.tamil || ''}
                  onChange={e => handleTextChange('title', 'tamil', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">English Subtitle</label>
                <input
                  type="text"
                  value={data.subtitle?.english || ''}
                  onChange={e => handleTextChange('subtitle', 'english', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tamil Subtitle</label>
                <input
                  type="text"
                  value={data.subtitle?.tamil || ''}
                  onChange={e => handleTextChange('subtitle', 'tamil', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
  
          {/* Contacts Section */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Contact Information</h2>
              <button
                type="button"
                onClick={addContact}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Contact
              </button>
            </div>
            
            <div className="space-y-4">
              {(data.contacts || []).map((contact, i) => (
                <div key={i} className="bg-white p-4 rounded-md border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <input
                        type="text"
                        value={contact.type}
                        onChange={e => handleContactChange(i, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                      <input
                        type="text"
                        value={contact.value}
                        onChange={e => handleContactChange(i, 'value', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Display Text</label>
                      <input
                        type="text"
                        value={contact.display}
                        onChange={e => handleContactChange(i, 'display', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                      <input
                        type="text"
                        value={contact.href}
                        onChange={e => handleContactChange(i, 'href', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                      <input
                        type="text"
                        value={contact.icon}
                        onChange={e => handleContactChange(i, 'icon', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeContact(i)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
  
          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BeforeHeaderPage;
