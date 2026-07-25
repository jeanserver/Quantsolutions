import axiosClient from './axiosClient.js';

export const getInvestmentsRequest = () => axiosClient.get('/investments');
