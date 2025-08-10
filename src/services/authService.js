// src/services/authService.js
import api from './api';

export const loginUser = async (phone, password) => {
  try {
    const response = await api.post('/user/login-user', {
      userPhone: phone,
      userPassword: password,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};
