const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

// Start the server only AFTER MongoDB successfully connects
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();