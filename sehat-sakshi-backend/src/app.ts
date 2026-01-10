import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import medicalHistoryRoutes from "./routes/medicalHistory";
import symptomsRoutes from "./routes/symptoms";
import remindersRoutes from "./routes/reminders";
import ordersRoutes from "./routes/orders";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000", "http://localhost:8080"],
    credentials: true
  })
);

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Sehat Saathi backend running"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/medical-history", medicalHistoryRoutes);
app.use("/api/symptoms", symptomsRoutes);
app.use("/api/reminders", remindersRoutes);
app.use("/api/orders", ordersRoutes);

export default app;
