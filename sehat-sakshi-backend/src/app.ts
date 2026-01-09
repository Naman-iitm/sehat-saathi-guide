import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";

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

// Auth routes
app.use("/api/auth", authRoutes);

export default app;
