import axiosClient from './axiosClient.js';

export const getAllDepositsRequest = () => axiosClient.get('/admin/deposits');

export const getAllWithdrawalsRequest = () => axiosClient.get('/admin/withdrawals');

export const updateDepositStatusRequest = (id, status) =>
  axiosClient.put(`/admin/deposits/${id}/status`, { status });

export const updateWithdrawalStatusRequest = (id, status) =>
  axiosClient.put(`/admin/withdrawals/${id}/status`, { status });

export const getAllPlanSelectionsRequest = () => axiosClient.get('/admin/plan-selections');

export const approvePlanSelectionRequest = (id) =>
  axiosClient.put(`/admin/plan-selections/${id}/approve`);

export const rejectPlanSelectionRequest = (id) =>
  axiosClient.put(`/admin/plan-selections/${id}/reject`);

export const updatePlanSelectionValueRequest = (id, currentValue, notes) =>
  axiosClient.put(`/admin/plan-selections/${id}/value`, { currentValue, notes });

export const getAllPlanPerformanceRequest = () => axiosClient.get('/admin/plan-performance');

export const applyPlanPerformanceRequest = (payload) =>
  axiosClient.post('/admin/plan-performance', payload);
