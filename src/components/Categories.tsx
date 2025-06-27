
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { categoriesApi } from '../services/api';
import { Category } from '../types';
import { useToast } from '../hooks/use-toast';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setError(null);
      console.log('Fetching categories...');
      const response = await categoriesApi.getAll();
      console.log('Categories response:', response.data);
      
      // Ensure we have an array
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
      setError('Failed to connect to the server. Please check if your backend is running.');
      toast({
        title: "Connection Error",
        description: "Cannot connect to the backend server. Please check if it's running.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      await categoriesApi.create({ name: newCategoryName });
      setNewCategoryName('');
      setShowAddForm(false);
      fetchCategories();
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editingName.trim()) return;

    try {
      await categoriesApi.update(id, { name: editingName });
      setEditingId(null);
      setEditingName('');
      fetchCategories();
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoriesApi.delete(id);
      fetchCategories();
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 sm:h-48 lg:h-64">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-32 sm:h-48 lg:h-64 space-y-3 sm:space-y-4 px-4">
        <div className="text-red-600 text-center max-w-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Connection Error</h2>
          <p className="text-sm sm:text-base text-gray-600">{error}</p>
        </div>
        <button
          onClick={fetchCategories}
          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Categories</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Add New Category</h3>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <div className="flex gap-2 sm:gap-3">
              <button
                type="submit"
                className="flex-1 sm:flex-none bg-green-600 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCategoryName('');
                }}
                className="flex-1 sm:flex-none bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow"
          >
            {editingId === category.id ? (
              <div className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(category.id)}
                    className="flex-1 bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center text-xs sm:text-sm"
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center text-xs sm:text-sm"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center gap-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate pr-2">{category.name}</h3>
                <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => startEdit(category)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-base sm:text-lg">No categories found. Create your first category!</p>
        </div>
      )}
    </div>
  );
};

export default Categories;
