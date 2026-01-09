import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "sehat-saathi-secret-key-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d"
};
