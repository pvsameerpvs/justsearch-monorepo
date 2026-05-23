import dotenv from 'dotenv';

// Load .env only if it exists (Railway injects env vars directly)
dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const startServer = () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`[server] Running on port ${PORT} in ${NODE_ENV} mode`);
    });

    // Graceful shutdown for Railway
    const gracefulShutdown = (signal: string) => {
      console.log(`[server] Received ${signal}, shutting down gracefully...`);
      server.close(() => {
        console.log('[server] HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error(`[server] Failed to start: ${String(error)}`);
    process.exit(1);
  }
};

startServer();
