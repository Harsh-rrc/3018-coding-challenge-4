import { Request, Response, NextFunction } from "express";
import { auth } from "../../../config/firebaseConfig";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Authentication middleware to verify Firebase ID tokens
 */
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get the authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: "Authorization header missing or invalid",
            });
            return;
        }

        // Extract the token
        const token = authHeader.split('Bearer ')[1];
        
        if (!token) {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: "Token missing",
            });
            return;
        }

        // Verify the token with Firebase
        const decodedToken = await auth.verifyIdToken(token);
        
        // Store user information in res.locals for use in subsequent middleware
        res.locals.uid = decodedToken.uid;
        res.locals.role = decodedToken.role || 'user'; // Default role is 'user'
        res.locals.email = decodedToken.email;

        console.log(`Authenticated user: ${decodedToken.uid}, role: ${res.locals.role}`);
        
        next();
    } catch (error: any) {
        console.error("Authentication error:", error);
        
        if (error.code === 'auth/id-token-expired') {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: "Token expired",
            });
        } else if (error.code === 'auth/id-token-revoked') {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: "Token revoked",
            });
        } else {
            res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: "Invalid token",
            });
        }
    }
};