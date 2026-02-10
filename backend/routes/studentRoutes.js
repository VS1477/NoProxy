const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { registerFace, markAttendance, getActiveSessions, getMyLogs } = require('../controllers/studentController');

router.use(protect);
router.use(authorize('student'));

router.post('/face', registerFace);
router.post('/mark-attendance', markAttendance);
router.get('/active-sessions', getActiveSessions);
router.get('/my-logs', getMyLogs);

module.exports = router;
