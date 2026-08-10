import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { createServer } from 'http';
import { pinoHttp } from 'pino-http';
import { WebSocketServer } from 'ws';

import { env } from './config/env.js';
import { logger } from './observability/logger.js';
import { db, pool } from './db/index.js';
import { redis, connectRedis } from './cache/redis.js';
import { setupWebSocketServer } from './ws/server.js';
import { setupPersistence } from './persistence/postgres.js';

// Setup Yjs Postgres persistence binding
setupPersistence();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ noServer: true });

// Handle upgrade requests for WebSockets manually to isolate paths if needed
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  // Let WebSocketServer handle all upgrades
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});

setupWebSocketServer(wss);

// Use Pino HTTP logger
app.use(pinoHttp({ logger }));

// Security Headers
app.use(helmet());

// CORS Setup
const allowedOrigins = env.ALLOWED_ORIGINS.split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health Check Endpoint
app.get('/health', async (req, res) => {
  let dbStatus = 'disconnected';
  let redisStatus = 'disconnected';

  try {
    // Simple query to verify DB connection
    await pool.query('SELECT 1');
    dbStatus = 'connected';
  } catch (err) {
    logger.error('Healthcheck DB connection error:', err);
  }

  try {
    if (redis.isOpen) {
      await redis.ping();
      redisStatus = 'connected';
    }
  } catch (err) {
    logger.error('Healthcheck Redis connection error:', err);
  }

  const isHealthy = dbStatus === 'connected' && redisStatus === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    uptime: process.uptime(),
    db: dbStatus,
    redis: redisStatus,
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'CoCanvas Server API' });
});

async function main() {
  try {
    // Connect to Redis asynchronously so it does not block server startup in local dev
    connectRedis().catch((err) => {
      logger.error('Failed to connect to Redis:', err);
    });

    // Start Express server
    server.listen(env.PORT, () => {
      logger.info(`Server is running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    });
  } catch (error) {
    logger.fatal('Error during startup:', error);
    process.exit(1);
  }
}

main();
