import express, { Request, Response, NextFunction, Express } from "express";
import userRoutes from "./api/v1/routes/userRoutes";

const app: Express = express();
app.use(express.json());

app.use("/api/v1/users", userRoutes);

/**
 * Global error handler.
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

export default app;