import api from './axios';

export const registerFace = (faceEmbedding) => api.post('/student/face', { faceEmbedding });
export const markAttendance = (data) => api.post('/student/mark-attendance', data);
export const getActiveSessions = () => api.get('/student/active-sessions');
export const getMyLogs = () => api.get('/student/my-logs');
