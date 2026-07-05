const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  try {
    const adminEmail = 'admin@zancafe.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('Admin user already exists! Email: admin@zancafe.com | Password: password123');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await User.create({
      name: 'Zan Admin',
      email: adminEmail,
      phone: '1234567890',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user successfully created! Email: admin@zancafe.com | Password: password123');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
