import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';
import { 
  helmetConfig, 
  generalRateLimit, 
  compressionConfig, 
  corsConfig 
} from './config/security.config';
import { requestLogger, requestIdMiddleware } from './config/logger.config';
import apiRoutes from './routes';
import cors from 'cors';

const app = express();

// Configure security middleware
app.use(helmetConfig);
app.use(generalRateLimit);
app.use(compressionConfig);
app.use(cors(corsConfig));

// Configure logging
app.use(requestIdMiddleware);
app.use(requestLogger);

app.use(express.json());

// API routes with base URL as specified in context.md
app.use('/api/v1', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
