const express = require('express');
const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');
const logger = require('./logger');
const pinoHttp = require('pino-http');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(pinoHttp({ logger }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the Notes App backend!');
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;