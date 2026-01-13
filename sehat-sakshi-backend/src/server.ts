import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";
import logger from "./config/logger";

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

    // Start server
    app.listen(env.PORT, () => {
      logger.info(`✓ Server running on http://localhost:${env.PORT}`);
      logger.info(`✓ Health check: http://localhost:${env.PORT}/health`);
      logger.info(`✓ Metrics endpoint: http://localhost:${env.PORT}/api/metrics`);
      logger.info("Server is ready to accept connections");
    });
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

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

startServer();
