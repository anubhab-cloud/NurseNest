import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import { config } from './config/env';
import { connectDatabase } from './config/database';
import { initializeSocket } from './socket';
import { initializeScheduler } from './services/scheduler.service';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

// ─── Express App Setup ─────────────────────────────────────────────────────────

const app = express();
const httpServer = http.createServer(app);

// ─── Security Middleware ───────────────────────────────────────────────────────

app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ─── Body Parsing ──────────────────────────────────────────────────────────────

// Stripe webhook needs raw body for signature verification
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));

// Standard JSON parsing for all other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── Logging ───────────────────────────────────────────────────────────────────

if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Routes ────────────────────────────────────────────────────────────────────

app.use('/api/v1', routes);

// ─── Error Handling ────────────────────────────────────────────────────────────

app.use(errorHandler);

// ─── 404 Handler ───────────────────────────────────────────────────────────────

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Initialize Socket.io ──────────────────────────────────────────────────────

const io = initializeSocket(httpServer);

// ─── Initialize Scheduled Jobs ─────────────────────────────────────────────────

initializeScheduler();

// ─── Start Server ──────────────────────────────────────────────────────────────

const startServer = async () => {
  try {
    await connectDatabase();

    httpServer.listen(config.port, () => {
      console.log(`
╔══════════════════════════════════════════════════════════╗
║         🏥 HOMECARE API SERVER                          ║
╠══════════════════════════════════════════════════════════╣
║  Environment : ${config.env.padEnd(40)}║
║  Port        : ${String(config.port).padEnd(40)}║
║  Socket.io   : Enabled with Redis adapter               ║
║  API Base    : /api/v1                                   ║
╚══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────

const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });

  // Force close after 10s
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export { app, httpServer, io };
