const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const { getAllUsers, getSuspiciousLogs, getAnalytics, getFraudSummary } = require('../controllers/adminController');

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.get('/suspicious', getSuspiciousLogs);
router.get('/analytics', getAnalytics);
router.get('/fraud-summary', getFraudSummary);

module.exports = router;
