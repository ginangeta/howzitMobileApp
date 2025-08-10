// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://165.227.202.115/api/howzitapi/v1/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// // ✅ Log full request
// api.interceptors.request.use((config) => {
//   console.log('API Request:', {
//     url: `${config.baseURL}${config.url}`,
//     method: config.method.toUpperCase(),
//     headers: config.headers,
//     data: config.data,
//     params: config.params
//   });
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });

// // ✅ Optionally log responses too
// api.interceptors.response.use((response) => {
//   console.log('API Response:', response.data);
//   return response;
// }, (error) => {
//   console.error('API Error:', error.response?.data || error.message);
//   return Promise.reject(error);
// });

export default api;
