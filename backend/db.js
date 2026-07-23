// 1. Load environment variables from .env file
require('dotenv').config();

// 2. Import mongoose
const mongoose = require('mongoose');

// 3. Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Stop the app if we can't connect to the database
  }
};

// 4. Export this function so other files (like server.js) can use it
module.exports = connectDB;