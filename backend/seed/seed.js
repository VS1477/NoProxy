const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_attendance';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');

    await User.deleteMany({});

    const users = [
      { name: 'Admin User', email: 'admin@test.com', password: '123456', role: 'admin' },
      { name: 'Teacher One', email: 'teacher@test.com', password: '123456', role: 'teacher' },
      { name: 'Student One', email: 'student@test.com', password: '123456', role: 'student' }
    ];

    await User.create(users);
    console.log('Seed data inserted');

    const created = await User.find().select('-password');
    console.log('Users:', created.map(u => ({ name: u.name, email: u.email, role: u.role })));

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
