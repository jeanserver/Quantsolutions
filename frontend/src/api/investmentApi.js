import axiosClient from './axiosClient.js';

export const getInvestmentPlansRequest = () => axiosClient.get('/investments');
