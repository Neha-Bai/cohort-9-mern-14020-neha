
const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');   // NEW

const app = express();
const PORT = 5000;

connectDB();

app.use(express.json());          // NEW - lets Express understand JSON request bodies
app.use('/api/auth', authRoutes); // NEW - mounts our auth routes under /api/auth

app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});