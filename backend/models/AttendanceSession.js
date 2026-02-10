const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  classroomLocation: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  radius: {
    type: Number,
    required: true,
    default: 100 // meters
  }
}, { timestamps: true });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
