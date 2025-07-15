import React, { useState, useEffect } from 'react';
import { Announcement } from '@/types';
import { createAnnouncement, updateAnnouncement } from '@/services/announcementService';

interface AnnouncementFormProps {
  announcement?: Announcement | null;
  onSave: () => void;
  onCancel: () => void;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ announcement, onSave, onCancel }) => {
  const [textEn, setTextEn] = useState('');
  const [textTa, setTextTa] = useState('');
  const [speed, setSpeed] = useState('normal');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (announcement) {
      setTextEn(announcement.text_en);
      setTextTa(announcement.text_ta);
      setSpeed(announcement.speed);
    }
  }, [announcement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const data = { text_en: textEn, text_ta: textTa, speed };

    try {
      if (announcement) {
        await updateAnnouncement(announcement.id, data);
      } else {
        await createAnnouncement(data);
      }
      onSave();
    } catch (err) {
      setError('Failed to save announcement. Please check the details and try again.');
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
          placeholder="Text (English)"
          value={textEn}
          onChange={(e) => setTextEn(e.target.value)}
          className="p-2 border rounded-md w-full"
          required
        />
        <input
          type="text"
          placeholder="Text (Tamil)"
          value={textTa}
          onChange={(e) => setTextTa(e.target.value)}
          className="p-2 border rounded-md w-full"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Speed</label>
        <select 
            value={speed} 
            onChange={e => setSpeed(e.target.value)} 
            className="p-2 border rounded-md w-full mt-1"
        >
            <option value="slow">Slow</option>
            <option value="normal">Normal</option>
            <option value="fast">Fast</option>
        </select>
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
          {isSaving ? 'Saving...' : 'Save Announcement'}
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
