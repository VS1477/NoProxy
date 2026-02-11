const User = require('../models/User');
const AttendanceSession = require('../models/AttendanceSession');
const AttendanceLog = require('../models/AttendanceLog');
const { haversineDistance } = require('../utils/haversine');
const { isFaceMatch } = require('../utils/faceCompare');
const { computeFraudScore } = require('../utils/fraudScore');

// Register face embedding for student
const registerFace = async (req, res) => {
  try {
    const userId = req.user._id;
    const { faceEmbedding } = req.body;

    if (!faceEmbedding || !Array.isArray(faceEmbedding)) {
      return res.status(400).json({ message: 'Face embedding array required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { faceEmbedding },
      { new: true }
    );
    res.json({ message: 'Face registered successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark attendance - validate location, face, device
const markAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { sessionId, location, faceEmbedding, deviceId } = req.body;

    if (!sessionId || !location || !deviceId) {
      return res.status(400).json({ message: 'sessionId, location, and deviceId required' });
    }

    const session = await AttendanceSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const now = new Date();
    if (now < session.startTime) {
      return res.status(400).json({ message: 'Session has not started yet' });
    }
    if (now > session.endTime) {
      return res.status(400).json({ message: 'Session has ended' });
    }

    // Check if already marked
    const existing = await AttendanceLog.findOne({ studentId, sessionId });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this session' });
    }

    // Haversine distance
    const distanceFromClass = haversineDistance(
      location.lat,
      location.lng,
      session.classroomLocation.lat,
      session.classroomLocation.lng
    );
    const outsideRadius = distanceFromClass > session.radius;

    // Face match
    const user = await User.findById(studentId);
    let faceMatched = true;
    let faceMatchScore = null;
    if (user.faceEmbedding && user.faceEmbedding.length > 0) {
      if (!faceEmbedding || !Array.isArray(faceEmbedding)) {
        faceMatched = false;
        faceMatchScore = Infinity;
      } else {
        const result = isFaceMatch(user.faceEmbedding, faceEmbedding);
        faceMatched = result.matched;
        faceMatchScore = result.distance;
      }
    } else {
      faceMatched = false; // No registered face = treat as mismatch
    }

    // Same device multiple accounts - device used by other students before
    const deviceUsers = await AttendanceLog.distinct('studentId', { deviceId });
    const otherUsersOnDevice = deviceUsers.filter(id => id.toString() !== studentId.toString());
    const sameDeviceMultipleAccounts = otherUsersOnDevice.length > 0;

    const { fraudScore, fraudReasons, status } = computeFraudScore({
      outsideRadius,
      faceMismatch: !faceMatched,
      sameDeviceMultipleAccounts
    });

    const log = await AttendanceLog.create({
      studentId,
      sessionId,
      location: { lat: location.lat, lng: location.lng },
      distanceFromClass,
      faceMatchScore,
      deviceId,
      fraudScore,
      fraudReasons,
      status
    });

    const populated = await AttendanceLog.findById(log._id)
      .populate('studentId', 'name email')
      .populate('sessionId', 'subject startTime endTime');

    res.status(201).json({
      message: 'Attendance recorded',
      log: populated,
      status,
      fraudScore,
      fraudReasons
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active sessions for student
const getActiveSessions = async (req, res) => {
  try {
    const now = new Date();
    const sessions = await AttendanceSession.find({
      startTime: { $lte: now },
      endTime: { $gte: now }
    }).populate('createdBy', 'name');

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my attendance logs
const getMyLogs = async (req, res) => {
  try {
    const logs = await AttendanceLog.find({ studentId: req.user._id })
      .populate({ path: 'sessionId', select: 'subject startTime endTime createdBy', populate: { path: 'createdBy', select: 'name' } })
      .sort({ timestamp: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerFace, markAttendance, getActiveSessions, getMyLogs };
