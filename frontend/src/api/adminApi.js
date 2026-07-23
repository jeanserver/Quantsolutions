import axiosClient from './axiosClient.js';

export const getAllDepositsRequest = () => axiosClient.get('/admin/deposits');

export const getAllWithdrawalsRequest = () => axiosClient.get('/admin/withdrawals');

export const updateDepositStatusRequest = (id, status) =>
  axiosClient.put(`/admin/deposits/${id}/status`, { status });

export const updateWithdrawalStatusRequest = (id, status) =>
  axiosClient.put(`/admin/withdrawals/${id}/status`, { status });
