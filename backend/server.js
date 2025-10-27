import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import configRoutes from './routes/configRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import mongoose from 'mongoose';

// ✅ Load environment variables FIRST
dotenv.config();

// ✅ Resolve dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Initialize Express
const app = express();

console.log('🚀 Starting NyayBharat Backend...');
console.log('📝 NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('🌐 Allowed Client URL:', process.env.CLIENT_URL);

// ✅ Connect to Database before starting server
(async () => {
  try {
    await connectDB();
    console.log('✅ MongoDB Connected Successfully!');
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err.message);
  }
})();

// ✅ Define Allowed Origins for CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5174',
  'http://127.0.0.1:5174'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman or mobile apps)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS Blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ✅ Logging middleware
app.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ✅ Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/config', configRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'NyayBharat API Server Running ✅',
    version: '1.0.0'
  });
});

// ✅ Health Route
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const statusMap = { 0: '🔴 Disconnected', 1: '🟢 Connected', 2: '🟡 Connecting', 3: '🟠 Disconnecting' };

  res.json({
    success: true,
    status: 'Healthy',
    mongoDB: statusMap[mongoStatus] || 'Unknown',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString()
  });
});

// ✅ Error Middleware
app.use(notFound);
app.use(errorHandler);

// ✅ Start Server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM Received. Shutting Down Gracefully...');
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  console.log('\n👋 SIGINT Received. Shutting Down Gracefully...');
  server.close(() => process.exit(0));
});

export default app;
