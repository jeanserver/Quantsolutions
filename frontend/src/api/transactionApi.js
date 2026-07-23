import axiosClient from './axiosClient.js';

export const getTransactionsRequest = () => axiosClient.get('/transactions');

export const createDepositRequest = (payload) => axiosClient.post('/deposits', payload);

export const createWithdrawalRequest = (payload) => axiosClient.post('/withdrawals', payload);
