const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config({ path: '../.env' }); // Adjust path if running from scripts dir

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');

    const adminData = {
      username: 'admin@gmail.com',
      password: 'adminadmin', // In a real app, this should be hashed!
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: adminData.username });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      existingAdmin.password = adminData.password;
      await existingAdmin.save();
      console.log('Admin password updated successfully.');
    } else {
      const newAdmin = new Admin(adminData);
      await newAdmin.save();
      console.log('Admin user created successfully.');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
