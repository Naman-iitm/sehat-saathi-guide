import { createServer } from 'http';
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";
import logger from "./config/logger";
import { initSocket } from "./config/socket";
import { reminderWorker } from "./services/reminderWorker";

const startServer = async () => {
  try {
    // Log startup
    logger.info("Starting Sehat Saathi Backend Server...");
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Node version: ${process.version}`);

    // Try to connect to database (non-blocking)
    logger.info("Attempting to connect to database...");
    try {
      await connectDB();
      logger.info("Database connected successfully");
    } catch (dbError) {
      logger.warn("Database connection failed - some features may be unavailable");
      logger.warn("Contact form will still work using JSON file storage");
    }

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.io
    initSocket(httpServer);
    logger.info("Socket.io initialized for WebRTC signaling and notifications");

    // Start reminder worker
    reminderWorker.start();
    logger.info("Reminder worker started");

    // Start server
    httpServer.listen(env.PORT, () => {
      logger.info(`✓ Server running on http://localhost:${env.PORT}`);
      logger.info(`✓ Health check: http://localhost:${env.PORT}/health`);
      logger.info(`✓ Metrics endpoint: http://localhost:${env.PORT}/api/metrics`);
      logger.info("Server is ready to accept connections");
    });

    // Graceful shutdown
    const gracefullyShutdown = () => {
      logger.info('Shutting down gracefully...');
      reminderWorker.stop();
      httpServer.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefullyShutdown);
    process.on('SIGINT', gracefullyShutdown);

  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', {
    reason,
    promise,
  });
  process.exit(1);
});

startServer();
