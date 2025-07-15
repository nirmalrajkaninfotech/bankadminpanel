"use client";

import React, { useEffect, useState } from 'react';
import { getSlides, deleteSlide } from '@/services/slideService';
import { Slide } from '@/types';
import SlideForm from '@/components/slides/SlideForm';

const SlidesPage = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSlides();
      setSlides(data);
    } catch (err) {
      setError('Failed to fetch slides. Please make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleAdd = () => {
    setSelectedSlide(null);
    setIsModalOpen(true);
  };

  const handleEdit = (slide: Slide) => {
    setSelectedSlide(slide);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      try {
        await deleteSlide(id);
        fetchSlides(); // Refresh the list
      } catch (err) {
        setError('Failed to delete slide.');
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchSlides();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Slides</h1>
        <button 
          onClick={handleAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add New Slide
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
            <h2 className="text-2xl font-semibold mb-6">{selectedSlide ? 'Edit Slide' : 'Add New Slide'}</h2>
            <SlideForm 
              slide={selectedSlide}
              onSave={handleSave}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isLoading && <p>Loading slides...</p>}
      {error && <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          {slides.length > 0 ? (
            slides.map((slide) => (
              <div key={slide.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center">
                  <img src={`http://localhost:5000${slide.image_url}`} alt={slide.title_en} className="w-24 h-16 object-cover rounded-md mr-4" />
                  <div>
                    <h3 className="font-semibold">{slide.title_en} / {slide.title_ta}</h3>
                    <p className="text-sm text-gray-600">{slide.description_en} / {slide.description_ta}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(slide)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(slide.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No slides found. Click "Add New Slide" to create one.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlidesPage;
