const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');

// Fail fast if JWT_SECRET is missing - login/protected routes depend on it
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in .env');
  process.exit(1);
}

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

// Start the server only AFTER MongoDB successfully connects
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();