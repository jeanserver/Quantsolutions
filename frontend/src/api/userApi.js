import axiosClient from './axiosClient.js';

export const getProfileRequest = () => axiosClient.get('/users/me');

export const updateProfileRequest = (payload) => axiosClient.put('/users/me', payload);
