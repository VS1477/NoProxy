const mongoose = require('mongoose');

const attendanceLogSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AttendanceSession',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  distanceFromClass: {
    type: Number,
    required: true
  },
  faceMatchScore: {
    type: Number,
    default: null
  },
  deviceId: {
    type: String,
    required: true
  },
  fraudScore: {
    type: Number,
    default: 0
  },
  fraudReasons: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['Present', 'Suspicious', 'Rejected'],
    required: true
  },
  teacherDecision: {
    type: String,
    enum: ['accepted', 'ignored'],
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('AttendanceLog', attendanceLogSchema);
