"use client";

import React, { useEffect, useState } from 'react';
import { getContactInfo, updateContactInfo } from '@/services/contactInfoService';
import { ContactInfo, MultiLangText } from '@/types';

const ContactInfoPage = () => {
  const [contactInfo, setContactInfo] = useState<Partial<ContactInfo>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getContactInfo();
        setContactInfo(data);
      } catch (err) {
        setError('Failed to fetch contact information.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const handleInputChange = (section: keyof ContactInfo, field: keyof MultiLangText | 'phone1' | 'phone2' | 'email', value: string) => {
    setContactInfo(prev => {
        if (section === 'address' || section === 'workingHours' || section === 'workingDays') {
            return { ...prev, [section]: { ...prev[section], [field]: value } };
        }
        return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateContactInfo(contactInfo);
      setSuccess('Contact information updated successfully!');
    } catch (err) {
      setError('Failed to save contact information.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p>Loading contact information...</p>;
  if (error && !contactInfo.address) return <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Contact Information</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        {success && <p className="text-green-500 bg-green-100 p-3 rounded-md">{success}</p>}

        {/* Address */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea placeholder="Address (EN)" value={contactInfo.address?.en || ''} onChange={e => handleInputChange('address', 'en', e.target.value)} className="p-2 border rounded-md md:col-span-2" rows={3} />
            <textarea placeholder="Address (TA)" value={contactInfo.address?.ta || ''} onChange={e => handleInputChange('address', 'ta', e.target.value)} className="p-2 border rounded-md md:col-span-2" rows={3} />
          </div>
        </div>

        {/* Contact Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Phone Number 1" value={contactInfo.phone1 || ''} onChange={e => handleInputChange('phone1', 'phone1', e.target.value)} className="p-2 border rounded-md" />
            <input type="text" placeholder="Phone Number 2" value={contactInfo.phone2 || ''} onChange={e => handleInputChange('phone2', 'phone2', e.target.value)} className="p-2 border rounded-md" />
            <input type="email" placeholder="Email Address" value={contactInfo.email || ''} onChange={e => handleInputChange('email', 'email', e.target.value)} className="p-2 border rounded-md md:col-span-2" />
          </div>
        </div>

        {/* Working Hours */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Working Hours & Days</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Working Hours (EN)" value={contactInfo.workingHours?.en || ''} onChange={e => handleInputChange('workingHours', 'en', e.target.value)} className="p-2 border rounded-md" />
            <input type="text" placeholder="Working Hours (TA)" value={contactInfo.workingHours?.ta || ''} onChange={e => handleInputChange('workingHours', 'ta', e.target.value)} className="p-2 border rounded-md" />
            <input type="text" placeholder="Working Days (EN)" value={contactInfo.workingDays?.en || ''} onChange={e => handleInputChange('workingDays', 'en', e.target.value)} className="p-2 border rounded-md" />
            <input type="text" placeholder="Working Days (TA)" value={contactInfo.workingDays?.ta || ''} onChange={e => handleInputChange('workingDays', 'ta', e.target.value)} className="p-2 border rounded-md" />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-blue-300" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactInfoPage;
