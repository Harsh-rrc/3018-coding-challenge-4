import express, { Request, Response, NextFunction, Express } from "express";
import userRoutes from "./api/v1/routes/userRoutes";
import adminRoutes from "./api/v1/routes/adminRoutes";
import morgan from "morgan";
import { AuthenticationError, AuthorizationError, ValidationError } from "./errors/customErrors";
import { HTTP_STATUS } from "./constants/httpConstants";

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
  res.status(HTTP_STATUS.OK).json({ 
    status: "OK", 
    message: "Admin and Permissions API Server is running",
    timestamp: new Date().toISOString()
  });
});

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    error: "Endpoint not found",
    path: req.path,
    method: req.method
  });
});

/**
 * Global error handler.
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error("Global error handler:", err);
    
    // Handle custom errors
    if (err instanceof AuthenticationError) {
        res.status(err.statusCode).json({ 
            error: err.message,
            type: err.name
        });
    } else if (err instanceof AuthorizationError) {
        res.status(err.statusCode).json({ 
            error: err.message,
            type: err.name
        });
    } else if (err instanceof ValidationError) {
        res.status(err.statusCode).json({ 
            error: err.message,
            type: err.name
        });
    } else if (err.name === 'FirebaseAuthError') {
        // Handle Firebase authentication errors
        res.status(HTTP_STATUS.UNAUTHORIZED).json({
            error: "Authentication failed",
            type: "FirebaseAuthError"
        });
    } else {
        // Generic server error
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ 
            error: "Internal Server Error",
            // Only show stack trace in development
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }
});

export default app;