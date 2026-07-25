import axiosClient from './axiosClient.js';

export const selectPlanRequest = (payload) => axiosClient.post('/user-investments', payload);

export const getMySelectionsRequest = () => axiosClient.get('/user-investments/mine');
