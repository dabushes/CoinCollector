import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import coinRoutes from './routes/coins.js';
import typeRoutes from './routes/types.js';
import mintRoutes from './routes/mints.js';
import collectionRoutes from './routes/collections.js';
import userRoutes from './routes/users.js';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/coins', coinRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/mints', mintRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CoinCollector API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      coins: '/api/coins',
      types: '/api/types',
      mints: '/api/mints',
      collections: '/api/collections',
      users: '/api/users',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 CoinCollector API server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

export { prisma };