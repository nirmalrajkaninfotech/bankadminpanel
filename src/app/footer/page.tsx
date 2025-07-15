"use client";

import React, { useEffect, useState } from 'react';
import { getFooter, updateFooter } from '@/services/footerService';
import { Footer, MultiLangText } from '@/types';

const FooterPage = () => {
  const [footer, setFooter] = useState<Partial<Footer>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getFooter();
        setFooter(data);
      } catch {
        setError('Failed to fetch footer data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFooter();
  }, []);

  const handleInputChange = (
    section: keyof Footer,
    field: keyof MultiLangText,
    value: string
  ) => {
    setFooter(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as MultiLangText),
        [field]: value,
      },
    }));
  };

  const handleLinkChange = (
    section: 'quickLinks' | 'help',
    index: number,
    field: 'text' | 'href',
    lang: keyof MultiLangText | null,
    value: string
  ) => {
    setFooter(prev => {
      const sectionData = prev[section] || { links: [] };
      const links = [...sectionData.links];
      const link = { ...links[index] };

      if (field === 'href') {
        link.href = value;
      } else if (lang) {
        link.text = { ...link.text, [lang]: value };
      }

      links[index] = link;
      return {
        ...prev,
        [section]: { ...sectionData, links },
      };
    });
  };

  const handleAddLink = (section: 'quickLinks' | 'help') => {
    setFooter(prev => {
      const sectionData = prev[section] || { links: [] };
      const links = [
        ...sectionData.links,
        { text: { en: '', ta: '' }, href: '' },
      ];
      return {
        ...prev,
        [section]: { ...sectionData, links },
      };
    });
  };

  const handleRemoveLink = (section: 'quickLinks' | 'help', index: number) => {
    setFooter(prev => {
      const sectionData = prev[section] || { links: [] };
      const links = [...sectionData.links];
      links.splice(index, 1);
      return {
        ...prev,
        [section]: { ...sectionData, links },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateFooter(footer);
      setSuccess('Footer updated successfully!');
    } catch {
      setError('Failed to save footer data.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p>Loading footer settings...</p>;
  if (error && !footer.bankName)
    return (
      <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>
    );

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Manage Footer</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow space-y-8"
      >
        {error && (
          <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>
        )}
        {success && (
          <p className="text-green-500 bg-green-100 p-3 rounded">
            {success}
          </p>
        )}

        {/* Bank Info */}
        <section className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Bank Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Bank Name (EN)"
              value={footer.bankName?.en || ''}
              onChange={e =>
                handleInputChange('bankName', 'en', e.target.value)
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Bank Name (TA)"
              value={footer.bankName?.ta || ''}
              onChange={e =>
                handleInputChange('bankName', 'ta', e.target.value)
              }
              className="p-2 border rounded"
            />
            <textarea
              placeholder="Description (EN)"
              value={footer.description?.en || ''}
              onChange={e =>
                handleInputChange('description', 'en', e.target.value)
              }
              className="p-2 border rounded md:col-span-2"
              rows={3}
            />
            <textarea
              placeholder="Description (TA)"
              value={footer.description?.ta || ''}
              onChange={e =>
                handleInputChange('description', 'ta', e.target.value)
              }
              className="p-2 border rounded md:col-span-2"
              rows={3}
            />
          </div>
        </section>

        {/* Quick Links */}
        <section className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          {(footer.quickLinks?.links || []).map((link, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2 p-2 border rounded"
            >
              <input
                type="text"
                placeholder="Link Text (EN)"
                value={link.text?.en || ''}
                onChange={e =>
                  handleLinkChange('quickLinks', i, 'text', 'en', e.target.value)
                }
                className="p-2 border rounded md:col-span-2"
              />
              <input
                type="text"
                placeholder="Link Text (TA)"
                value={link.text?.ta || ''}
                onChange={e =>
                  handleLinkChange('quickLinks', i, 'text', 'ta', e.target.value)
                }
                className="p-2 border rounded md:col-span-2"
              />
              <input
                type="text"
                placeholder="URL"
                value={link.href}
                onChange={e =>
                  handleLinkChange('quickLinks', i, 'href', null, e.target.value)
                }
                className="p-2 border rounded md:col-span-1"
              />
              <button
                type="button"
                onClick={() => handleRemoveLink('quickLinks', i)}
                className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddLink('quickLinks')}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Quick Link
          </button>
        </section>

        {/* Help Links */}
        <section className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4">Help Links</h2>
          {(footer.help?.links || []).map((link, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-2 p-2 border rounded"
            >
              <input
                type="text"
                placeholder="Link Text (EN)"
                value={link.text?.en || ''}
                onChange={e =>
                  handleLinkChange('help', i, 'text', 'en', e.target.value)
                }
                className="p-2 border rounded md:col-span-2"
              />
              <input
                type="text"
                placeholder="Link Text (TA)"
                value={link.text?.ta || ''}
                onChange={e =>
                  handleLinkChange('help', i, 'text', 'ta', e.target.value)
                }
                className="p-2 border rounded md:col-span-2"
              />
              <input
                type="text"
                placeholder="URL"
                value={link.href}
                onChange={e =>
                  handleLinkChange('help', i, 'href', null, e.target.value)
                }
                className="p-2 border rounded md:col-span-1"
              />
              <button
                type="button"
                onClick={() => handleRemoveLink('help', i)}
                className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddLink('help')}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Help Link
          </button>
        </section>

        {/* Newsletter & Copyright */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Newsletter &amp; Copyright
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Newsletter Title (EN)"
              value={footer.newsletter?.title?.en || ''}
              onChange={e =>
                handleInputChange('newsletter', 'en', e.target.value)
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Newsletter Title (TA)"
              value={footer.newsletter?.title?.ta || ''}
              onChange={e =>
                handleInputChange('newsletter', 'ta', e.target.value)
              }
              className="p-2 border rounded"
            />
            <textarea
              placeholder="Newsletter Desc (EN)"
              value={footer.newsletter?.description?.en || ''}
              onChange={e =>
                handleInputChange('newsletter', 'en', e.target.value)
              }
              className="p-2 border rounded md:col-span-2"
              rows={2}
            />
            <textarea
              placeholder="Newsletter Desc (TA)"
              value={footer.newsletter?.description?.ta || ''}
              onChange={e =>
                handleInputChange('newsletter', 'ta', e.target.value)
              }
              className="p-2 border rounded md:col-span-2"
              rows={2}
            />
            <input
              type="text"
              placeholder="Copyright (EN)"
              value={footer.copyright?.en || ''}
              onChange={e =>
                handleInputChange('copyright', 'en', e.target.value)
              }
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Copyright (TA)"
              value={footer.copyright?.ta || ''}
              onChange={e =>
                handleInputChange('copyright', 'ta', e.target.value)
              }
              className="p-2 border rounded"
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FooterPage;
