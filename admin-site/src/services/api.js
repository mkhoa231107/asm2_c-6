import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add admin token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Auth
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),

  // Users
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),

  // Categories
  getCategories: () => api.get('/categories'),

  // Food Items
  getFoodItems: (params) => api.get('/fooditems', { params }),
  getFoodItem: (id) => api.get(`/fooditems/${id}`),
  createFoodItem: (data) => api.post('/fooditems', data),
  updateFoodItem: (id, data) => api.put(`/fooditems/${id}`, data),
  deleteFoodItem: (id) => api.delete(`/fooditems/${id}`),

  // Combos
  getCombos: () => api.get('/combos'),
  getCombo: (id) => api.get(`/combos/${id}`),
  createCombo: (data) => api.post('/combos', data),
  updateCombo: (id, data) => api.put(`/combos/${id}`, data),
  deleteCombo: (id) => api.delete(`/combos/${id}`),

  // Orders
  getOrders: (status) => api.get('/orders', { params: { status } }),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status?status=${status}`)
};