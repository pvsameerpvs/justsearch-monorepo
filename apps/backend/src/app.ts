import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware';
import { tenantMiddleware } from './middleware/tenant.middleware';
import v1Routes from './routes/v1.routes';

const app: Express = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Tenant resolution — must run before API routes
app.use(tenantMiddleware);

// Health Check (includes DB connectivity status)
app.get('/health', async (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/v1', v1Routes);

// Error Handling
app.use(errorHandler);

export default app;
