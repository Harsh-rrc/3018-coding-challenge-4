import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

/**
 * Controller to get the user profile.
 * Requires authentication middleware to set res.locals.uid
 * @param req - Incoming request object.
 * @param res - Response object to send the user profile response.
 * @param next - Next middleware function.
 */
export const getUserProfile = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        // This will be set by your authentication middleware
        const userId: string = res.locals.uid;

        if (!userId) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                error: "User not authenticated",
            });
        }

        res.status(HTTP_STATUS.OK).json({
            message: `User profile for user ID: ${userId}`,
            userId: userId,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Controller to delete a user (requires admin role).
 * Requires both authentication and authorization middleware
 * @param req - Incoming request object.
 * @param res - Response object to confirm deletion.
 * @param next - Next middleware function.
 */
export const deleteUser = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const userId: string = req.params.id;
        const currentUserRole: string = res.locals.role;

        if (!currentUserRole) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                error: "User role not found",
            });
        }

        res.status(HTTP_STATUS.OK).json({
            message: `User ${userId} deleted by admin`,
            deletedBy: res.locals.uid,
        });
    } catch (error) {
        next(error);
    }
};