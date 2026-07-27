import axiosClient from './axiosClient.js';

export const getPortfolioSummaryRequest = () => axiosClient.get('/portfolio/summary');

export const getPortfolioOverviewRequest = () => axiosClient.get('/portfolio/overview');
