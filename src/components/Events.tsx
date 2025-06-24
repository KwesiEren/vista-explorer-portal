
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar, MapPin, Upload, X } from 'lucide-react';
import { eventsApi } from '../services/api';
import { Event, CreateEvent } from '../types';
import { useToast } from '../hooks/use-toast';

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<CreateEvent>({
    title: '',
    description: '',
    location: '',
    start_date: '',
    end_date: '',
    image: undefined
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventsApi.getAll();
      setEvents(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      start_date: '',
      end_date: '',
      image: undefined
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location || !formData.start_date || !formData.end_date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('title', formData.title);
    submitFormData.append('description', formData.description);
    submitFormData.append('location', formData.location);
    submitFormData.append('start_date', formData.start_date);
    submitFormData.append('end_date', formData.end_date);

    if (formData.image) {
      submitFormData.append('image', formData.image);
    }

    try {
      if (editingEvent) {
        await eventsApi.update(editingEvent.id, submitFormData);
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
      } else {
        await eventsApi.create(submitFormData);
        toast({
          title: "Success",
          description: "Event created successfully",
        });
      }
      resetForm();
      fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingEvent ? 'update' : 'create'} event`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsApi.delete(id);
      fetchEvents();
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };

  const startEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      start_date: event.start_date,
      end_date: event.end_date,
      image: undefined
    });
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFormData(prev => ({ ...prev, image: file }));
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Events of Interest</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date & Time *
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.image && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected: {formData.image.name}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                {editingEvent ? 'Update' : 'Create'} Event
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow overflow-hidden"
          >
            {event.image_url && (
              <div className="h-48 bg-gray-200">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(event)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{event.description}</p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formatDateTime(event.start_date)}
                </div>
                <div className="text-xs text-gray-400">
                  Ends: {formatDateTime(event.end_date)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found. Create your first event!</p>
        </div>
      )}
    </div>
  );
};

export default Events;
