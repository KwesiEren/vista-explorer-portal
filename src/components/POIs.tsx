import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Upload, X, FileSpreadsheet } from 'lucide-react';
import { poisApi, categoriesApi } from '../services/api';
import { POI, Category, CreatePOI } from '../types';
import { useToast } from '../hooks/use-toast';
import ImportModal from './ImportModal';

const POIs = () => {
  const [pois, setPois] = useState<POI[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingPOI, setEditingPOI] = useState<POI | null>(null);
  const [formData, setFormData] = useState<CreatePOI>({
    name: '',
    description: '',
    category_id: 0,
    location: '',
    images: []
  });
  const [locationCoords, setLocationCoords] = useState({ lat: '', lng: '' });
  const { toast } = useToast();

  useEffect(() => {
    fetchPOIs();
    fetchCategories();
  }, []);

  const fetchPOIs = async () => {
    try {
      console.log('Fetching POIs...');
      const response = await poisApi.getAll();
      console.log('POIs response:', response.data);
      
      // Ensure we have an array
      const poisData = Array.isArray(response.data) ? response.data : [];
      setPois(poisData);
    } catch (error) {
      console.error('Error fetching POIs:', error);
      setPois([]); // Set empty array on error
      toast({
        title: "Error",
        description: "Failed to fetch POIs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const response = await categoriesApi.getAll();
      console.log('Categories response:', response.data);
      
      // Ensure we have an array
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category_id: 0,
      location: '',
      images: []
    });
    setLocationCoords({ lat: '', lng: '' });
    setEditingPOI(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.category_id || !locationCoords.lat || !locationCoords.lng) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const submitFormData = new FormData();
    submitFormData.append('name', formData.name);
    submitFormData.append('description', formData.description);
    submitFormData.append('category_id', formData.category_id.toString());
    submitFormData.append('location', JSON.stringify({
      lat: parseFloat(locationCoords.lat),
      lng: parseFloat(locationCoords.lng)
    }));

    formData.images.forEach((image, index) => {
      submitFormData.append('images[]', image);
    });

    try {
      if (editingPOI) {
        await poisApi.update(editingPOI.id, submitFormData);
        toast({
          title: "Success",
          description: "POI updated successfully",
        });
      } else {
        await poisApi.create(submitFormData);
        toast({
          title: "Success",
          description: "POI created successfully",
        });
      }
      resetForm();
      fetchPOIs();
    } catch (error) {
      console.error('Error submitting POI:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingPOI ? 'update' : 'create'} POI`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this POI?')) return;

    try {
      await poisApi.delete(id);
      fetchPOIs();
      toast({
        title: "Success",
        description: "POI deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting POI:', error);
      toast({
        title: "Error",
        description: "Failed to delete POI",
        variant: "destructive",
      });
    }
  };

  const startEdit = (poi: POI) => {
    setEditingPOI(poi);
    setFormData({
      name: poi.name,
      description: poi.description,
      category_id: poi.category_id,
      location: JSON.stringify(poi.location),
      images: []
    });
    setLocationCoords({
      lat: poi.location.lat.toString(),
      lng: poi.location.lng.toString()
    });
    setShowForm(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 2) {
      toast({
        title: "Error",
        description: "Maximum 2 images allowed",
        variant: "destructive",
      });
      return;
    }
    setFormData(prev => ({ ...prev, images: files }));
  };

  const handleBulkImport = async (importData: any[]) => {
    const results = { success: 0, failed: 0, errors: [] as string[] };
    
    for (let i = 0; i < importData.length; i++) {
      try {
        const formData = new FormData();
        formData.append('name', importData[i].name);
        formData.append('description', importData[i].description);
        formData.append('category_id', importData[i].category_id.toString());
        formData.append('location', importData[i].location);
        
        // Handle image URLs if provided
        if (importData[i].image_urls && Array.isArray(importData[i].image_urls)) {
          importData[i].image_urls.forEach((url: string, index: number) => {
            if (url.trim()) {
              formData.append(`image_urls[${index}]`, url.trim());
            }
          });
        }
        
        await poisApi.create(formData);
        results.success++;
      } catch (error) {
        console.error(`Failed to import POI ${i + 1}:`, error);
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${importData[i].name} - Import failed`);
      }
    }
    
    if (results.success > 0) {
      fetchPOIs(); // Refresh the list
    }
    
    // Show summary toast
    if (results.failed === 0) {
      toast({
        title: "Import Successful",
        description: `Successfully imported ${results.success} POIs`,
      });
    } else {
      toast({
        title: "Import Completed with Errors",
        description: `${results.success} successful, ${results.failed} failed`,
        variant: "destructive",
      });
    }
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
        <h1 className="text-2xl font-bold text-gray-900">Places of Interest</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Import from Excel
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add POI
          </button>
        </div>
      </div>

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={handleBulkImport}
        type="poi"
        categories={categories}
      />

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {editingPOI ? 'Edit POI' : 'Add New POI'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value={0}>Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
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

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  value={locationCoords.lat}
                  onChange={(e) => setLocationCoords(prev => ({ ...prev, lat: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  value={locationCoords.lng}
                  onChange={(e) => setLocationCoords(prev => ({ ...prev, lng: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images (Max 2)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formData.images.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.images.length} image(s) selected
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                {editingPOI ? 'Update' : 'Create'} POI
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
        {pois.map((poi) => (
          <div
            key={poi.id}
            className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow overflow-hidden"
          >
            {poi.image_urls && Array.isArray(poi.image_urls) && poi.image_urls.length > 0 && (
              <div className="h-48 bg-gray-200">
                <img
                  src={poi.image_urls[0]}
                  alt={poi.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image failed to load:', poi.image_urls?.[0]);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{poi.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(poi)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(poi.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-blue-600 mb-2">{poi.category_name}</p>
              <p className="text-gray-600 text-sm mb-3">{poi.description}</p>
              
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {poi.location?.lat?.toFixed(4)}, {poi.location?.lng?.toFixed(4)}
              </div>
              
              {poi.image_urls && Array.isArray(poi.image_urls) && poi.image_urls.length > 1 && (
                <p className="text-xs text-gray-400 mt-2">
                  +{poi.image_urls.length - 1} more image(s)
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {pois.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No POIs found. Create your first place of interest!</p>
        </div>
      )}
    </div>
  );
};

export default POIs;
