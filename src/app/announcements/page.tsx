"use client";

import React, { useEffect, useState } from 'react';
import { getAnnouncements, deleteAnnouncement } from '@/services/announcementService';
import { Announcement } from '@/types';
import AnnouncementForm from '@/components/announcements/AnnouncementForm';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError('Failed to fetch announcements. Please make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAdd = () => {
    setSelectedAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(id);
        fetchAnnouncements(); // Refresh the list
      } catch (err) {
        setError('Failed to delete announcement.');
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchAnnouncements();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Announcements</h1>
        <button 
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Announcement
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">{selectedAnnouncement ? 'Edit Announcement' : 'Add New Announcement'}</h2>
            <AnnouncementForm 
              announcement={selectedAnnouncement}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isLoading && <p>Loading announcements...</p>}
      {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-semibold">EN: {announcement.text_en}</p>
                  <p className="font-semibold">TA: {announcement.text_ta}</p>
                  <p className="text-sm text-gray-600">Speed: {announcement.speed}</p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(announcement)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(announcement.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No announcements found. Click "Add New Announcement" to create one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;
