import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { generalLimiter } from "./middleware/rateLimiter";
import authRoutes from "./routes/auth";
import medicalHistoryRoutes from "./routes/medicalHistory";
import symptomsRoutes from "./routes/symptoms";
import remindersRoutes from "./routes/reminders";
import ordersRoutes from "./routes/orders";
import metricsRoutes from "./routes/metrics";

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5000",
      "http://localhost:8080",
      process.env.FRONTEND_URL || ""
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  })
);

// Body parser with size limits
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request ID middleware
app.use((req, _res, next) => {
  req.id = req.headers["x-request-id"] as string ||
    `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  next();
});

// General rate limiting
app.use(generalLimiter);

// Health check (no rate limiting)
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Sehat Saathi backend running",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/medical-history", medicalHistoryRoutes);
app.use("/api/symptoms", symptomsRoutes);
app.use("/api/reminders", remindersRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/metrics", metricsRoutes);

// 404 handler
app.use((req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
  });

  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(`Unhandled error: ${err.message}`, {
    requestId: req.id,
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(err.statusCode || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
