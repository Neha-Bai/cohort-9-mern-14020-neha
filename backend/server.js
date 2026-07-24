// 1. Import the express library we installed
const express = require('express');

// 2. Import our database connection function
const connectDB = require('./db');

// 3. Create the app
const app = express();

// 4. Define the port
const PORT = 5000;

// 5. Define a route
app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

// 6. Start the server only AFTER MongoDB successfully connects
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();