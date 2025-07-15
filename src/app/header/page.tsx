"use client";

import React, { useEffect, useState } from 'react';
import { getHeader, updateHeader } from '@/services/headerService';
import { Header, MultiLangText } from '@/types';

const HeaderPage = () => {
  const [header, setHeader] = useState<Partial<Header>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getHeader();
        setHeader(data);
      } catch (err) {
        setError('Failed to fetch header data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHeader();
  }, []);

  const handleInputChange = (section: 'logoText' | 'languageSelector', field: keyof MultiLangText, value: string) => {
    setHeader(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleLinkChange = (linkIndex: number, field: 'text' | 'href', lang: keyof MultiLangText | null, value: string) => {
    setHeader(prev => {
        const newNavLinks = [...(prev.navLinks || [])];
        if (field === 'href') {
            newNavLinks[linkIndex].href = value;
        } else if (lang) {
            newNavLinks[linkIndex].text[lang] = value;
        }
        return { ...prev, navLinks: newNavLinks };
    });
  };

  const handleAddLink = () => {
    setHeader(prev => ({
        ...prev,
        navLinks: [...(prev.navLinks || []), { text: { en: '', ta: '' }, href: '' }]
    }));
  };

  const handleRemoveLink = (linkIndex: number) => {
    setHeader(prev => ({
        ...prev,
        navLinks: (prev.navLinks || []).filter((_, i) => i !== linkIndex)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateHeader(header);
      setSuccess('Header updated successfully!');
    } catch (err) {
      setError('Failed to save header data.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p>Loading header settings...</p>;
  if (error && !header.logoText) return <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Header</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-8">
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        {success && <p className="text-green-500 bg-green-100 p-3 rounded-md">{success}</p>}

        {/* Logo Text */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Logo Text</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Logo Text (EN)" value={header.logoText?.en || ''} onChange={e => handleInputChange('logoText', 'en', e.target.value)} className="p-2 border rounded-md" />
            <input type="text" placeholder="Logo Text (TA)" value={header.logoText?.ta || ''} onChange={e => handleInputChange('logoText', 'ta', e.target.value)} className="p-2 border rounded-md" />
          </div>
        </div>

        {/* Navigation Links */}
        <div className="border-b pb-6">
            <h2 className="text-xl font-semibold mb-4">Navigation Links</h2>
            {header.navLinks?.map((link, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2 p-2 border rounded-md">
                    <input type="text" placeholder="Link Text (EN)" value={link.text.en} onChange={e => handleLinkChange(i, 'text', 'en', e.target.value)} className="p-2 border rounded-md md:col-span-2" />
                    <input type="text" placeholder="Link Text (TA)" value={link.text.ta} onChange={e => handleLinkChange(i, 'text', 'ta', e.target.value)} className="p-2 border rounded-md md:col-span-2" />
                    <input type="text" placeholder="URL" value={link.href} onChange={e => handleLinkChange(i, 'href', null, e.target.value)} className="p-2 border rounded-md md:col-span-1" />
                    <button type="button" onClick={() => handleRemoveLink(i)} className="bg-red-500 text-white rounded-md hover:bg-red-600">Remove</button>
                </div>
            ))}
            <button type="button" onClick={handleAddLink} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Add Nav Link</button>
        </div>

        {/* Language Selector */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Language Selector</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Language (EN)" value={header.languageSelector?.en || ''} onChange={e => handleInputChange('languageSelector', 'en', e.target.value)} className="p-2 border rounded-md" />
            <input type="text" placeholder="Language (TA)" value={header.languageSelector?.ta || ''} onChange={e => handleInputChange('languageSelector', 'ta', e.target.value)} className="p-2 border rounded-md" />
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

export default HeaderPage;
