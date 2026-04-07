import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

const startServer = () => {
  try {
    app.listen(PORT, () => {
      console.log(`🚀 JustSearch Shared Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('SERVER_ERROR:', error);
    process.exit(1);
  }
};

startServer();
