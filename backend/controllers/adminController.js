const User = require('../models/User');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceLog = require('../models/AttendanceLog');

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -faceEmbedding').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get suspicious logs
const getSuspiciousLogs = async (req, res) => {
  try {
    const logs = await AttendanceLog.find({ status: { $in: ['Suspicious', 'Rejected'] } })
      .populate('studentId', 'name email')
      .populate('sessionId', 'subject startTime endTime')
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Attendance analytics
const getAnalytics = async (req, res) => {
  try {
    const totalSessions = await AttendanceSession.countDocuments();
    const totalLogs = await AttendanceLog.countDocuments();
    const presentCount = await AttendanceLog.countDocuments({ status: 'Present' });
    const suspiciousCount = await AttendanceLog.countDocuments({ status: 'Suspicious' });
    const rejectedCount = await AttendanceLog.countDocuments({ status: 'Rejected' });
    const studentCount = await User.countDocuments({ role: 'student' });
    const teacherCount = await User.countDocuments({ role: 'teacher' });

    const fraudSummary = await AttendanceLog.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      totalSessions,
      totalLogs,
      presentCount,
      suspiciousCount,
      rejectedCount,
      studentCount,
      teacherCount,
      fraudSummary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fraud scoring summary
const getFraudSummary = async (req, res) => {
  try {
    const summary = await AttendanceLog.aggregate([
      {
        $group: {
          _id: null,
          avgFraudScore: { $avg: '$fraudScore' },
          maxFraudScore: { $max: '$fraudScore' },
          suspiciousCount: { $sum: { $cond: [{ $eq: ['$status', 'Suspicious'] }, 1, 0] } },
          rejectedCount: { $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] } }
        }
      }
    ]);

    const byReason = await AttendanceLog.aggregate([
      { $unwind: '$fraudReasons' },
      { $group: { _id: '$fraudReasons', count: { $sum: 1 } } }
    ]);

    res.json({
      summary: summary[0] || {},
      byReason
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getSuspiciousLogs, getAnalytics, getFraudSummary };
