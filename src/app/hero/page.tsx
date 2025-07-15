"use client";

import React, { useEffect, useState } from 'react';
import { getHero, updateHero } from '@/services/heroService';
import { Hero, MultiLangText } from '@/types';

const HeroPage = () => {
  const [hero, setHero] = useState<Partial<Hero>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getHero();
        setHero(data);
      } catch (err) {
        setError('Failed to fetch hero data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleInputChange = (section: keyof Hero, field: keyof MultiLangText, value: string) => {
    setHero(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await updateHero(hero);
      setSuccess('Hero section updated successfully!');
    } catch (err) {
      setError('Failed to save hero data.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p>Loading hero settings...</p>;
  if (error && !hero.mainText) return <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Hero Section</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}
        {success && <p className="text-green-500 bg-green-100 p-3 rounded-md">{success}</p>}

        {/* Main Text */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Main Text</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea placeholder="Main Text (EN)" value={hero.mainText?.en || ''} onChange={e => handleInputChange('mainText', 'en', e.target.value)} className="p-2 border rounded-md" rows={3} />
            <textarea placeholder="Main Text (TA)" value={hero.mainText?.ta || ''} onChange={e => handleInputChange('mainText', 'ta', e.target.value)} className="p-2 border rounded-md" rows={3} />
          </div>
        </div>

        {/* Sub Text */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Sub Text</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <textarea placeholder="Sub Text (EN)" value={hero.subText?.en || ''} onChange={e => handleInputChange('subText', 'en', e.target.value)} className="p-2 border rounded-md" rows={2} />
            <textarea placeholder="Sub Text (TA)" value={hero.subText?.ta || ''} onChange={e => handleInputChange('subText', 'ta', e.target.value)} className="p-2 border rounded-md" rows={2} />
          </div>
        </div>

        {/* Button Text */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Button Text</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Button Text (EN)" value={hero.buttonText?.en || ''} onChange={e => handleInputChange('buttonText', 'en', e.target.value)} className="p-2 border rounded-md" />
            <input type="text" placeholder="Button Text (TA)" value={hero.buttonText?.ta || ''} onChange={e => handleInputChange('buttonText', 'ta', e.target.value)} className="p-2 border rounded-md" />
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

export default HeroPage;
