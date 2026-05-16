import express, { Express, Request, Response } from 'express';
import { join } from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error.middleware';
import { tenantMiddleware } from './middleware/tenant.middleware';
import v1Routes from './routes/v1.routes';

const app: Express = express();

// Security & parsing middleware
app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
].filter((o): o is string => !!o);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Serve uploaded files
app.use('/uploads', express.static(join(__dirname, '..', 'public', 'uploads')));

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
