import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB, disconnectDB } from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import ApiError from './utils/ApiError.js';

// ─── Route Imports ───────────────────────────────────────────────────
import authRoutes from './routes/authRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import userRoutes from './routes/userRoutes.js';

// ─── Load Environment Variables ──────────────────────────────────────
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    message: 'InterviewIQ Backend Service is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/users', userRoutes);

// ─── 404 Catch-All ───────────────────────────────────────────────────
app.all('*', (req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

// ─── Global Error Handler (must be last middleware) ──────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────
const startServer = async () => {
  try {
    // Connect to PostgreSQL
    await connectDB();

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(` InterviewIQ Backend running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ───────────────────────────────────────────────
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

startServer();

export default app;
