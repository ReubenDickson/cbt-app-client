// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Matches backend MVP
});

// Intercept requests to automatically add the Authorization header
api.interceptors.request.use((config) => {
  // 
  if (config.headers.request.Authorization) {
    return config;
  }
  //
  const studentToken = sessionStorage.getItem('token'); //

  if (studentToken) {
    config.headers.Authorization = `Bearer ${studentToken}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;