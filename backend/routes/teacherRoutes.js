const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { createSession, getMySessions, getSessionReport, getSuspiciousAttempts, setAttendanceDecision } = require('../controllers/teacherController');

router.use(protect);
router.use(authorize('teacher'));

router.post('/sessions', createSession);
router.get('/sessions', getMySessions);
router.get('/sessions/:sessionId/report', getSessionReport);
router.get('/suspicious', getSuspiciousAttempts);
router.patch('/attendance/:logId/decision', setAttendanceDecision);

module.exports = router;
