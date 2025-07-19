import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import itemRoutes from './routes/itemRoutes';
import { auth } from './lib/auth';
import { toNodeHandler } from 'better-auth/node';

const app = express();

// Enable CORS for all routes
app.use(cors());

app.all('/api/auth/{*any}', toNodeHandler(auth));

app.use(express.json());

// Routes
app.use('/api/items', itemRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
