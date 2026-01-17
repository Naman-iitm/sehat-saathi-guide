import { createServer } from 'http';
import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";
import logger from "./config/logger";
import { initSocket } from "./config/socket";

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

    // Create HTTP server
    const httpServer = createServer(app);

    // Initialize Socket.io
    initSocket(httpServer);
    logger.info("Socket.io initialized for WebRTC signaling");

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
