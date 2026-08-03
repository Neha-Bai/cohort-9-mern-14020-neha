const logger = require('../logger');

// 404 handler - runs when no route matched the request
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error); // pass it forward to the error handler below
};

// Global error handler - catches ANY error passed via next(error)
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  logger.error({ err, statusCode, path: req.originalUrl }, 'Unhandled error caught by global handler');

  res.status(statusCode).json({
    message: statusCode === 500 ? 'Something went wrong. Please try again.' : err.message
  });
};

module.exports = { notFound, errorHandler };