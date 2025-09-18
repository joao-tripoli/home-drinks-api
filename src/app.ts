import express, { Application } from 'express';
import { config } from './config/environment';
import { errorHandler, notFoundHandler, requestLogger } from './middlewares';
import routes from './routes';
import { logger } from './utils/logger';

const app: Application = express();

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use(requestLogger);

// API routes
app.use('/', routes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Log application startup
logger.info('Application initialized', {
  environment: config.NODE_ENV,
  port: config.PORT,
  version: config.API_VERSION,
});

export default app;
