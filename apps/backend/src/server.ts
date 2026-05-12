import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      // Server started successfully
    });
  } catch (error) {
    console.error('SERVER_ERROR:', error);
    process.exit(1);
  }
};

startServer();
