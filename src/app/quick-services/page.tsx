"use client";

import React, { useEffect, useState } from 'react';
import { getQuickServices, updateQuickServices } from '@/services/quickServicesService';
import { QuickServicesContent, QuickServiceItem, MultiLangText } from '@/types';

const QuickServicesPage = () => {
  const [content, setContent] = useState<Partial<QuickServicesContent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getQuickServices();
        setContent(data);
      } catch (err) {
        setError('Failed to fetch quick services data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleSectionChange = (section: 'sectionTitle' | 'sectionDescription', field: keyof MultiLangText, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleServiceChange = (index: number, field: keyof QuickServiceItem | keyof MultiLangText, value: string, lang?: keyof MultiLangText) => {
    setContent(prev => {
        const newServices = [...(prev.services || [])];
        const service = { ...newServices[index] };
        if (lang && (field === 'title' || field === 'description')) {
            service[field] = { ...service[field], [lang]: value };
        } else if (field === 'icon' || field === 'href' || field === 'id') {
            service[field] = value;
        }
        newServices[index] = service;
        return { ...prev, services: newServices };
    });
  };

  const handleAddService = () => {
    setContent(prev => ({
      ...prev,
      services: [...(prev.services || []), { id: Date.now().toString(), icon: '', title: { en: '', ta: '' }, description: { en: '', ta: '' }, href: '' }]
    }));
  };

  const handleRemoveService = (index: number) => {
    setContent(prev => ({
      ...prev,
      services: (prev.services || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateQuickServices(content);
      setSuccess('Quick services updated successfully!');
    } catch (err) {
      setError('Failed to save quick services data.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p>Loading quick services...</p>;
  if (error && !content.sectionTitle) return <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Quick Services</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-8">
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        {success && <p className="text-green-500 bg-green-100 p-3 rounded-md">{success}</p>}

        {/* Section Info */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Section Header</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Section Title (EN)" value={content.sectionTitle?.en || ''} onChange={e => handleSectionChange('sectionTitle', 'en', e.target.value)} className="p-2 border rounded-md" />
            <input type="text" placeholder="Section Title (TA)" value={content.sectionTitle?.ta || ''} onChange={e => handleSectionChange('sectionTitle', 'ta', e.target.value)} className="p-2 border rounded-md" />
            <textarea placeholder="Section Description (EN)" value={content.sectionDescription?.en || ''} onChange={e => handleSectionChange('sectionDescription', 'en', e.target.value)} className="p-2 border rounded-md md:col-span-2" rows={3} />
            <textarea placeholder="Section Description (TA)" value={content.sectionDescription?.ta || ''} onChange={e => handleSectionChange('sectionDescription', 'ta', e.target.value)} className="p-2 border rounded-md md:col-span-2" rows={3} />
          </div>
        </div>

        {/* Service Items */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Service Items</h2>
          <div className="space-y-4">
            {content.services?.map((service, i) => (
              <div key={service.id} className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-end">
                    <button type="button" onClick={() => handleRemoveService(i)} className="text-red-500 hover:text-red-700 font-semibold">Remove</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Icon (e.g., 'fas fa-home')" value={service.icon} onChange={e => handleServiceChange(i, 'icon', e.target.value)} className="p-2 border rounded-md" />
                    <input type="text" placeholder="Link URL" value={service.href} onChange={e => handleServiceChange(i, 'href', e.target.value)} className="p-2 border rounded-md" />
                    <input type="text" placeholder="Title (EN)" value={service.title.en} onChange={e => handleServiceChange(i, 'title', e.target.value, 'en')} className="p-2 border rounded-md" />
                    <input type="text" placeholder="Title (TA)" value={service.title.ta} onChange={e => handleServiceChange(i, 'title', e.target.value, 'ta')} className="p-2 border rounded-md" />
                    <textarea placeholder="Description (EN)" value={service.description.en} onChange={e => handleServiceChange(i, 'description', e.target.value, 'en')} className="p-2 border rounded-md md:col-span-2" rows={2} />
                    <textarea placeholder="Description (TA)" value={service.description.ta} onChange={e => handleServiceChange(i, 'description', e.target.value, 'ta')} className="p-2 border rounded-md md:col-span-2" rows={2} />
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={handleAddService} className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Add Service</button>
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

export default QuickServicesPage;
