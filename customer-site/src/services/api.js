import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Auth
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),

  // Users
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),

  // Categories
  getCategories: () => api.get('/categories'),

  // Food Items
  getFoodItems: (params) => api.get('/fooditems', { params }),
  getFoodItem: (id) => api.get(`/fooditems/${id}`),

  // Combos
  getCombos: () => api.get('/combos'),
  getCombo: (id) => api.get(`/combos/${id}`),

  // Orders
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`)
};