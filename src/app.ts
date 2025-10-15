import express, { Request, Response, NextFunction, Express } from "express";
import userRoutes from "./api/v1/routes/userRoutes";
import adminRoutes from "../api/v1/routes/adminRoutes";
import morgan from "morgan";

// Load environment variables
require('dotenv').config();

const app: Express = express();

// Middleware
app.use(morgan('combined')); // Logging middleware
app.use(express.json());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

/**
 * Global error handler.
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error("Global error handler:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

export default app;