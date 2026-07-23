import axiosClient from './axiosClient.js';

export const registerRequest = (payload) => axiosClient.post('/auth/register', payload);

export const loginRequest = (payload) => axiosClient.post('/auth/login', payload);

export const changePasswordRequest = (payload) =>
  axiosClient.put('/users/me/password', payload);
