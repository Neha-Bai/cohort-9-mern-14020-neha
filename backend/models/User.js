const mongoose = require('mongoose');

// Define the shape of a "User" document
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
password: {
    type: String,
    required: true,
    select: false  // hide password hash from query results by default
  }
}, { timestamps: true }); // automatically adds createdAt and updatedAt fields

// Create the model from the schema and export it
const User = mongoose.model('User', userSchema);
module.exports = User;