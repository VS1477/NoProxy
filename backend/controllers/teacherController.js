const AttendanceSession = require('../models/AttendanceSession');
const AttendanceLog = require('../models/AttendanceLog');

// Create attendance session
const createSession = async (req, res) => {
  try {
    const { subject, startTime, endTime, classroomLocation, radius } = req.body;

    if (!subject || !startTime || !endTime || !classroomLocation) {
      return res.status(400).json({ message: 'subject, startTime, endTime, classroomLocation required' });
    }

    const session = await AttendanceSession.create({
      subject,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      classroomLocation: {
        lat: Number(classroomLocation.lat),
        lng: Number(classroomLocation.lng)
      },
      radius: radius ?? 100,
      createdBy: req.user._id
    });

    const populated = await AttendanceSession.findById(session._id).populate('createdBy', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get teacher's sessions
const getMySessions = async (req, res) => {
  try {
    const sessions = await AttendanceSession.find({ createdBy: req.user._id })
      .populate('createdBy', 'name')
      .sort({ startTime: -1 });

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get attendance report for a session
const getSessionReport = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await AttendanceSession.findById(sessionId).populate('createdBy', 'name');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    if (session.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const logs = await AttendanceLog.find({ sessionId })
      .populate('studentId', 'name email')
      .sort({ timestamp: 1 });

    res.json({ session, logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get suspicious attempts
const getSuspiciousAttempts = async (req, res) => {
  try {
    const suspicious = await AttendanceLog.find({
      status: { $in: ['Suspicious', 'Rejected'] },
      sessionId: { $in: (await AttendanceSession.find({ createdBy: req.user._id })).map(s => s._id) }
    })
      .populate('studentId', 'name email')
      .populate('sessionId', 'subject startTime endTime')
      .sort({ timestamp: -1 });

    res.json(suspicious);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher accepts or ignores attendance (approve/reject)
const setAttendanceDecision = async (req, res) => {
  try {
    const { logId } = req.params;
    const { decision } = req.body;

    if (!['accepted', 'ignored'].includes(decision)) {
      return res.status(400).json({ message: 'decision must be "accepted" or "ignored"' });
    }

    const log = await AttendanceLog.findById(logId);
    if (!log) return res.status(404).json({ message: 'Attendance log not found' });

    const session = await AttendanceSession.findById(log.sessionId);
    if (!session || session.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    log.teacherDecision = decision;
    await log.save();

    const populated = await AttendanceLog.findById(log._id)
      .populate('studentId', 'name email')
      .populate('sessionId', 'subject startTime endTime');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSession, getMySessions, getSessionReport, getSuspiciousAttempts, setAttendanceDecision };
