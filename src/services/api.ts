
import axios from 'axios';

// Replace with your actual ngrok subdomain
const BASE_URL = 'https://e51f-197-255-102-7.ngrok-free.app/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data: { name: string }) => api.post('/categories', data),
  update: (id: number, data: { name: string }) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// POIs API
export const poisApi = {
  getAll: () => api.get('/pois'),
  create: (formData: FormData) => api.post('/pois', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: number, formData: FormData) => api.put(`/pois/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: number) => api.delete(`/pois/${id}`),
};

// Events API
export const eventsApi = {
  getAll: () => api.get('/events'),
  create: (formData: FormData) => api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id: number, formData: FormData) => api.put(`/events/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id: number) => api.delete(`/events/${id}`),
};

export default api;
