import { createServer } from 'http';
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";
import logger from "./config/logger";
import { initSocket } from "./config/socket";
import { startReminderWorker } from "./services/reminderWorker";

const startServer = async () => {
  try {
    // Log startup
    logger.info("Starting Sehat Saathi Backend Server...");
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Node version: ${process.version}`);

    // Connect to database
    logger.info("Connecting to database...");
    await connectDB();
    logger.info("Database connected successfully");

    // Create HTTP server from Express app
    const httpServer = createServer(app);

    // Initialize Socket.io
    initSocket(httpServer);
    logger.info("Socket.io initialized");

    // Start background worker
    startReminderWorker();
    logger.info("Background reminder worker started");

    // Start server
    httpServer.listen(env.PORT, () => {
      logger.info(`✓ Server running on http://localhost:${env.PORT}`);
      logger.info(`✓ Health check: http://localhost:${env.PORT}/health`);
      logger.info(`✓ Metrics endpoint: http://localhost:${env.PORT}/api/metrics`);
      logger.info("Server is ready to accept connections");
    });

    // Graceful shutdown
    const shutdown = () => {
      logger.info('Closure signal received: closing HTTP server');
      httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  if (logger) {
    logger.error('Uncaught Exception:', {
      error: error.message,
      stack: error.stack,
    });
  } else {
    console.error('Uncaught Exception:', error);
  }
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  if (logger) {
    logger.error('Unhandled Rejection at:', {
      promise,
      reason,
    });
  } else {
    console.error('Unhandled Rejection:', reason);
  }
  process.exit(1);
});

startServer();
