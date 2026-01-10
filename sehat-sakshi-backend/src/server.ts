import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/database";

const startServer = async () => {
  await connectDB();
  
  app.listen(env.PORT, () => {
    console.log(`Backend running on http://localhost:${env.PORT}`);
  });
};

startServer();
