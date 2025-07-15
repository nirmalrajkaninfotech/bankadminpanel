import React, { useState, useEffect } from 'react';
import { Video } from '@/types';
import { createVideo, updateVideo } from '@/services/videoService';

interface VideoFormProps {
  video?: Video | null;
  onSave: () => void;
  onCancel: () => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ video, onSave, onCancel }) => {
  const [titleEn, setTitleEn] = useState('');
  const [titleTa, setTitleTa] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (video) {
      setTitleEn(video.title_en);
      setTitleTa(video.title_ta);
      setVideoId(video.videoId);
    }
  }, [video]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const data = { title_en: titleEn, title_ta: titleTa, videoId };

    try {
      if (video) {
        await updateVideo(video.id, data);
      } else {
        await createVideo(data);
      }
      onSave();
    } catch (err) {
      setError('Failed to save video. Please check the details and try again.');
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

      <div>
        <label className="block text-sm font-medium text-gray-700">YouTube Video ID</label>
        <input
          type="text"
          placeholder="e.g., dQw4w9WgXcQ"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          className="p-2 border rounded-md w-full mt-1"
          required
        />
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
          {isSaving ? 'Saving...' : 'Save Video'}
        </button>
      </div>
    </form>
  );
};

export default VideoForm;
