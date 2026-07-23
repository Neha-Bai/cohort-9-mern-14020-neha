// 1. Import the express library we installed
const express = require('express');

// 2. Import our new database connection function
const connectDB = require('./db');

// 3. Create the app
const app = express();

// 4. Define the port
const PORT = 5000;

// 5. Connect to MongoDB before starting the server
connectDB();

// 6. Define a route
app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

// 7. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});