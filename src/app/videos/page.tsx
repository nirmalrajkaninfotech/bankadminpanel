"use client";

import React, { useEffect, useState } from 'react';
import { getVideos, deleteVideo } from '@/services/videoService';
import { Video } from '@/types';
import VideoForm from '@/components/videos/VideoForm';

const VideosPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getVideos();
      setVideos(data);
    } catch (err) {
      setError('Failed to fetch videos. Please make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleAdd = () => {
    setSelectedVideo(null);
    setIsModalOpen(true);
  };

  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await deleteVideo(id);
        fetchVideos(); // Refresh the list
      } catch (err) {
        setError('Failed to delete video.');
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchVideos();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Videos</h1>
        <button 
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Video
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">{selectedVideo ? 'Edit Video' : 'Add New Video'}</h2>
            <VideoForm 
              video={selectedVideo}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isLoading && <p>Loading videos...</p>}
      {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <iframe 
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title_en}
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">EN: {video.title_en}</h3>
                <h3 className="font-semibold text-lg">TA: {video.title_ta}</h3>
                <div className="flex justify-end space-x-2 mt-4">
                  <button 
                    onClick={() => handleEdit(video)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(video.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          !isLoading && <p>No videos found. Click "Add New Video" to create one.</p>
        )}
      </div>
    </div>
  );
};

export default VideosPage;
