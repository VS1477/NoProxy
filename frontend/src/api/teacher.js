import api from './axios';

export const createSession = (data) => api.post('/teacher/sessions', data);
export const getMySessions = () => api.get('/teacher/sessions');
export const getSessionReport = (sessionId) => api.get(`/teacher/sessions/${sessionId}/report`);
export const getSuspiciousAttempts = () => api.get('/teacher/suspicious');
export const setAttendanceDecision = (logId, decision) =>
  api.patch(`/teacher/attendance/${logId}/decision`, { decision });
