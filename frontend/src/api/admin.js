import api from './axios';

export const getAllUsers = () => api.get('/admin/users');
export const getSuspiciousLogs = () => api.get('/admin/suspicious');
export const getAnalytics = () => api.get('/admin/analytics');
export const getFraudSummary = () => api.get('/admin/fraud-summary');
