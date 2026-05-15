import dotenv from 'dotenv';

dotenv.config();

import app from './app';

const PORT = process.env.PORT || 3001;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      // Server started successfully
    });
  } catch (error) {
    process.stderr.write(`SERVER_ERROR: ${String(error)}\n`);
    process.exit(1);
  }
};

startServer();
