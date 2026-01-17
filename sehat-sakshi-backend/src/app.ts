import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { generalLimiter } from "./middleware/rateLimiter";
import { conditionalRequestLogger } from "./middleware/requestLogger";
import { performanceMonitor } from "./middleware/performanceMonitor";
import authRoutes from "./routes/auth";
import medicalHistoryRoutes from "./routes/medicalHistory";
import symptomsRoutes from "./routes/symptoms";
import remindersRoutes from "./routes/reminders";
import ordersRoutes from "./routes/orders";
import analyticsRoutes from "./routes/analytics";
import notificationRoutes from "./routes/notifications";
import appointmentRoutes from "./routes/appointments";
import metricsRoutes from "./routes/metrics";
import forumRoutes from "./routes/forum";

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

// Logging & Performance middleware
app.use(conditionalRequestLogger);
app.use(performanceMonitor);

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
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/metrics", metricsRoutes);
app.use("/api/forum", forumRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
