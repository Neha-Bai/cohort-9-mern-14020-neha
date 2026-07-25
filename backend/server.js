const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const logger = require('./logger');
const pinoHttp = require('pino-http');

// Fail fast if JWT_SECRET is missing - login/protected routes depend on it
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined in .env');
  process.exit(1);
}

const app = express();
const PORT = 5000;

// Log every incoming HTTP request/response automatically
app.use(pinoHttp({ logger }));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

// Start the server only AFTER MongoDB successfully connects
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error({ err: error }, 'Failed to start server');
    process.exit(1);
  }
};

startServer();