import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth";
import videoRoutes from "./routes/videos";
import commentRoutes from "./routes/comments";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();



// CORS configuration
app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow frontend origin
      methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], // Allowed methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    })
  );
  
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
