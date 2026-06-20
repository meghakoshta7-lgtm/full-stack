import express from 'express';
import cors from 'cors';
import { config } from './config/database';
import { connectDB } from './config/sequelize';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import storeRoutes from './modules/store/store.routes';
import ratingRoutes from './modules/rating/rating.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/ratings', ratingRoutes);

app.get('/health', async (_req, res) => {
  try {
    const mongoose = await import('mongoose');
    const dbState = mongoose.default.connection.readyState;
    const states: Record<number, string> = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.json({
      status: 'ok',
      db: states[dbState] || 'unknown',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.json({ status: 'ok', db: 'unknown', timestamp: new Date().toISOString() });
  }
});

const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected successfully');

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
